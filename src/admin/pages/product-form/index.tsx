import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, ChevronDown, ChevronUp, Loader2, Plus, Star, Trash2 } from 'lucide-react'
import { getCategories, getProduct, getSubcategories } from '../../../shared/api/catalog'
import { Select } from '../../../shared/ui/Select'
import {
  adminCreateProduct,
  adminDeleteProductImage,
  adminUpdateProduct,
  adminUpdateProductImage,
  adminUploadProductImage,
  ProductPayload,
  SpecRow,
} from '../../../shared/api/admin'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Toggle } from '../../components/Toggle'
import { ImageDropzone } from '../../components/ImageDropzone'
import { apiErrorMessage } from '../../lib/apiError'
import { ICON_SIZE, ICON_STROKE } from '../../lib/icons'
import classes from '../../admin.module.scss'
import local from './product-form.module.scss'

interface FormValues {
  name: string
  slug: string
  subtitle: string
  description: string
  price: string
  old_price: string
  currency: string
  order: number
}

export const ProductFormPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const isEdit = !!slug
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: categories } = useQuery('admin-categories', getCategories)
  const { data: subcategories } = useQuery('admin-subcategories', () => getSubcategories())
  const { data: product, isLoading: isProductLoading } = useQuery(
    ['admin-product', slug],
    () => getProduct(slug!),
    { enabled: isEdit },
  )

  const [categoryId, setCategoryId] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')
  const [specs, setSpecs] = useState<SpecRow[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [inStock, setInStock] = useState(true)
  const [isActive, setActive] = useState(true)
  const [isFeatured, setFeatured] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: '', slug: '', subtitle: '', description: '',
      price: '', old_price: '', currency: 'сомони', order: 0,
    },
  })

  // префилл формы в режиме редактирования
  useEffect(() => {
    if (!product) return
    reset({
      name: product.name,
      slug: product.slug,
      subtitle: product.subtitle,
      description: product.description,
      price: product.price,
      old_price: product.old_price ?? '',
      currency: product.currency,
      order: product.order,
    })
    setCategoryId(String(product.category.id))
    setSubcategoryId(String(product.subcategory.id))
    setSpecs(product.specs.map((s) => ({ label: s.label, value: s.value })))
    setInStock(product.in_stock)
    setActive(product.is_active)
    setFeatured(product.is_featured)
  }, [product, reset])

  // каскад: подкатегории выбранной категории
  const subcategoryOptions = useMemo(() => {
    if (!subcategories || !categoryId) return []
    return subcategories.filter((sub) => String(sub.category.id) === categoryId)
  }, [subcategories, categoryId])

  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    setSubcategoryId('')
  }

  // ── характеристики ──
  const addSpec = () => setSpecs([...specs, { label: '', value: '' }])
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index))
  const updateSpec = (index: number, key: keyof SpecRow, value: string) => {
    setSpecs(specs.map((s, i) => (i === index ? { ...s, [key]: value } : s)))
  }
  const moveSpec = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= specs.length) return
    const next = [...specs]
    const [row] = next.splice(index, 1)
    next.splice(target, 0, row)
    setSpecs(next)
  }

  const invalidate = () => {
    queryClient.invalidateQueries('admin-products')
    queryClient.invalidateQueries('admin-products-count')
    queryClient.invalidateQueries('products')
    queryClient.invalidateQueries(['admin-product', slug])
    queryClient.invalidateQueries('admin-categories')
    queryClient.invalidateQueries('admin-subcategories')
  }

  const saveMutation = useMutation(
    async (values: FormValues) => {
      const cleanSpecs = specs
        .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
        .filter((s) => s.label && s.value)

      const payload: Partial<ProductPayload> = {
        name: values.name.trim(),
        slug: values.slug.trim() || undefined,
        subtitle: values.subtitle.trim(),
        description: values.description.trim(),
        subcategory: Number(subcategoryId),
        price: values.price,
        old_price: values.old_price.trim() || undefined,
        currency: values.currency.trim() || 'сомони',
        order: Number(values.order) || 0,
        in_stock: inStock,
        is_active: isActive,
        is_featured: isFeatured,
        specs: cleanSpecs,
      }

      if (isEdit && product) {
        const updated = await adminUpdateProduct(product.slug, payload)
        // новые фото — отдельными запросами в галерею
        for (const file of newFiles) {
          await adminUploadProductImage(updated.slug, file, { alt: updated.name })
        }
        return updated
      }
      return adminCreateProduct({ ...(payload as ProductPayload), uploaded_images: newFiles })
    },
    {
      onSuccess: () => {
        toast.success(isEdit ? 'Товар сохранён' : 'Товар создан')
        invalidate()
        navigate('/admin/products')
      },
      onError: (error) => { toast.error(apiErrorMessage(error, 'Не удалось сохранить товар')) },
    },
  )

  const setMainMutation = useMutation(
    (imageId: number) => adminUpdateProductImage(imageId, { is_main: true }),
    {
      onSuccess: () => {
        toast.success('Главное фото обновлено')
        queryClient.invalidateQueries(['admin-product', slug])
        queryClient.invalidateQueries('admin-products')
      },
      onError: (error) => { toast.error(apiErrorMessage(error)) },
    },
  )

  const deleteImageMutation = useMutation(
    (imageId: number) => adminDeleteProductImage(imageId),
    {
      onSuccess: () => {
        toast.success('Фото удалено')
        setDeletingImageId(null)
        queryClient.invalidateQueries(['admin-product', slug])
        queryClient.invalidateQueries('admin-products')
      },
      onError: (error) => {
        toast.error(apiErrorMessage(error))
        setDeletingImageId(null)
      },
    },
  )

  const onSubmit = (values: FormValues) => {
    if (!subcategoryId) {
      toast.error('Выберите категорию и подкатегорию')
      return
    }
    saveMutation.mutate(values)
  }

  if (isEdit && isProductLoading) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className={classes.skeletonRow} />)}
      </div>
    )
  }

  return (
    <div className={local.page}>
      <div className={classes.pageHead}>
        <div>
          <Link to="/admin/products" className={local.backLink}>
            <ArrowLeft size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
            К списку товаров
          </Link>
          <h1 className={classes.pageTitle}>
            {isEdit ? `Редактирование: ${product?.name ?? ''}` : 'Новый товар'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={local.columns}>
          {/* ── Левая колонка ── */}
          <div className={local.colMain}>
            <div className={classes.card}>
              <h3 className={local.cardTitle}>Основное</h3>
              <div className={classes.formGrid}>
                <div className={classes.fieldFull}>
                  <label className={classes.label}>Название *</label>
                  <input
                    className={classes.input}
                    placeholder="Например: Микроволновая печь ALRIG B20MXP07"
                    {...register('name', { required: 'Укажите название' })}
                  />
                  {errors.name && <span className={classes.errorText}>{errors.name.message}</span>}
                </div>
                <div className={classes.field}>
                  <label className={classes.label}>Подзаголовок</label>
                  <input
                    className={classes.input}
                    placeholder="Серебристый / 20 л"
                    {...register('subtitle')}
                  />
                </div>
                <div className={classes.field}>
                  <label className={classes.label}>Slug (автоматически)</label>
                  <input className={classes.input} placeholder="auto" {...register('slug')} />
                </div>
                <div className={classes.fieldFull}>
                  <label className={classes.label}>Описание</label>
                  <textarea
                    className={classes.textarea}
                    placeholder="Подробное описание товара…"
                    {...register('description')}
                  />
                </div>
              </div>
            </div>

            <div className={classes.card}>
              <h3 className={local.cardTitle}>Размещение в каталоге</h3>
              <div className={classes.formGrid}>
                <div className={classes.field}>
                  <label className={classes.label}>Категория *</label>
                  <Select
                    ariaLabel="Категория"
                    fullWidth
                    placeholder="— Выберите категорию —"
                    value={categoryId}
                    onChange={handleCategoryChange}
                    options={(categories ?? []).map((cat) => ({ value: String(cat.id), label: cat.name }))}
                  />
                </div>
                <div className={classes.field}>
                  <label className={classes.label}>Подкатегория *</label>
                  <Select
                    ariaLabel="Подкатегория"
                    fullWidth
                    disabled={!categoryId}
                    placeholder={categoryId ? '— Выберите подкатегорию —' : 'Сначала выберите категорию'}
                    value={subcategoryId}
                    onChange={setSubcategoryId}
                    options={subcategoryOptions.map((sub) => ({ value: String(sub.id), label: sub.name }))}
                  />
                </div>
              </div>
            </div>

            <div className={classes.card}>
              <h3 className={local.cardTitle}>Фотографии</h3>

              {isEdit && product && product.images.length > 0 && (
                <div className={local.gallery}>
                  {product.images.map((image) => (
                    <div key={image.id} className={local.galleryItem}>
                      <img src={image.image} alt={image.alt} />
                      {image.is_main && <span className={local.mainBadge}>Главное</span>}
                      <div className={local.galleryActions}>
                        {!image.is_main && (
                          <button
                            type="button"
                            className={local.galleryBtn}
                            onClick={() => setMainMutation.mutate(image.id)}
                            title="Сделать главным"
                            aria-label="Сделать главным"
                          >
                            <Star size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                          </button>
                        )}
                        <button
                          type="button"
                          className={local.galleryBtnDanger}
                          onClick={() => setDeletingImageId(image.id)}
                          title="Удалить фото"
                          aria-label="Удалить фото"
                        >
                          <Trash2 size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <ImageDropzone
                files={newFiles}
                onChange={setNewFiles}
                hint={isEdit ? 'Новые фото добавятся в галерею после сохранения' : 'Первое фото станет главным'}
              />
            </div>

            <div className={classes.card}>
              <div className={local.specsHead}>
                <h3 className={local.cardTitle}>Характеристики</h3>
                <button type="button" className={classes.btnGhost} onClick={addSpec}>
                  <Plus size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
                  Добавить строку
                </button>
              </div>

              {specs.length === 0 && (
                <p className={local.specsEmpty}>
                  Добавьте пары «характеристика — значение», например «Мощность — 700 Вт».
                </p>
              )}

              <div className={local.specsList}>
                {specs.map((spec, index) => (
                  <div key={index} className={local.specRow}>
                    <div className={local.specMove}>
                      <button type="button" onClick={() => moveSpec(index, -1)} disabled={index === 0} aria-label="Вверх">
                        <ChevronUp size={ICON_SIZE.mini} strokeWidth={ICON_STROKE} />
                      </button>
                      <button type="button" onClick={() => moveSpec(index, 1)} disabled={index === specs.length - 1} aria-label="Вниз">
                        <ChevronDown size={ICON_SIZE.mini} strokeWidth={ICON_STROKE} />
                      </button>
                    </div>
                    <input
                      className={classes.input}
                      placeholder="Характеристика"
                      value={spec.label}
                      onChange={(e) => updateSpec(index, 'label', e.target.value)}
                    />
                    <input
                      className={classes.input}
                      placeholder="Значение"
                      value={spec.value}
                      onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className={classes.btnIconDanger}
                      onClick={() => removeSpec(index)}
                      aria-label="Удалить строку"
                    >
                      <Trash2 size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Правая колонка ── */}
          <div className={local.colSide}>
            <div className={classes.card}>
              <h3 className={local.cardTitle}>Цена</h3>
              <div className={local.sideFields}>
                <div className={classes.field}>
                  <label className={classes.label}>Цена *</label>
                  <input
                    className={classes.input}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    {...register('price', { required: 'Укажите цену' })}
                  />
                  {errors.price && <span className={classes.errorText}>{errors.price.message}</span>}
                </div>
                <div className={classes.field}>
                  <label className={classes.label}>Старая цена (для скидки)</label>
                  <input
                    className={classes.input}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="—"
                    {...register('old_price')}
                  />
                </div>
                <div className={classes.field}>
                  <label className={classes.label}>Валюта</label>
                  <input className={classes.input} {...register('currency')} />
                </div>
                <div className={classes.field}>
                  <label className={classes.label}>Порядок сортировки</label>
                  <input className={classes.input} type="number" {...register('order')} />
                </div>
              </div>
            </div>

            <div className={classes.card}>
              <h3 className={local.cardTitle}>Статусы</h3>
              <div className={local.sideFields}>
                <Toggle label="В наличии" checked={inStock} onChange={setInStock} />
                <Toggle label="Активен (виден на сайте)" checked={isActive} onChange={setActive} />
                <Toggle label="Рекомендуемый (на главной)" checked={isFeatured} onChange={setFeatured} />
              </div>
            </div>

            <div className={local.submitBlock}>
              <button type="submit" className={classes.btnPrimary} disabled={saveMutation.isLoading}>
                {saveMutation.isLoading && (
                  <Loader2 className={classes.btnSpinner} size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
                )}
                {saveMutation.isLoading ? 'Сохраняем…' : isEdit ? 'Сохранить изменения' : 'Создать товар'}
              </button>
              <Link to="/admin/products" className={classes.btnGhost}>Отмена</Link>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        isOpen={deletingImageId !== null}
        title="Удалить фото?"
        text="Фотография будет удалена из галереи товара."
        isLoading={deleteImageMutation.isLoading}
        onConfirm={() => deletingImageId !== null && deleteImageMutation.mutate(deletingImageId)}
        onCancel={() => setDeletingImageId(null)}
      />
    </div>
  )
}
