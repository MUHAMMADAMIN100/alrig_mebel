import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { Layers, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Modal } from '../../../shared/ui/Modal'
import { Select } from '../../../shared/ui/Select'
import { getCategories, getSubcategories } from '../../../shared/api/catalog'
import {
  adminCreateSubcategory,
  adminDeleteSubcategory,
  adminUpdateSubcategory,
  SubcategoryPayload,
} from '../../../shared/api/admin'
import { ApiSubcategory } from '../../../shared/api/types'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Toggle } from '../../components/Toggle'
import { ImageDropzone } from '../../components/ImageDropzone'
import { apiErrorMessage } from '../../lib/apiError'
import { ICON_SIZE, ICON_STROKE } from '../../lib/icons'
import classes from '../../admin.module.scss'

interface FormValues {
  name: string
  slug: string
  category: string
  order: number
}

export const AdminSubcategoriesPage = () => {
  const queryClient = useQueryClient()
  const { data: categories } = useQuery('admin-categories', getCategories)
  const { data: subcategories, isLoading } = useQuery('admin-subcategories', () => getSubcategories())

  const [categoryFilter, setCategoryFilter] = useState('')
  const [editing, setEditing] = useState<ApiSubcategory | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)
  const [isActive, setActive] = useState(true)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [deleting, setDeleting] = useState<ApiSubcategory | null>(null)

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>()

  const filtered = useMemo(() => {
    if (!subcategories) return []
    if (!categoryFilter) return subcategories
    return subcategories.filter((sub) => String(sub.category.id) === categoryFilter)
  }, [subcategories, categoryFilter])

  const invalidate = () => {
    queryClient.invalidateQueries('admin-subcategories')
    queryClient.invalidateQueries('admin-categories')
    queryClient.invalidateQueries('categories')
    queryClient.invalidateQueries('subcategories')
  }

  const saveMutation = useMutation(
    (values: FormValues) => {
      const payload: Partial<SubcategoryPayload> = {
        name: values.name.trim(),
        slug: values.slug.trim() || undefined,
        category: Number(values.category),
        order: Number(values.order) || 0,
        is_active: isActive,
        image: imageFiles[0] ?? undefined,
      }
      return editing
        ? adminUpdateSubcategory(editing.slug, payload)
        : adminCreateSubcategory(payload as SubcategoryPayload)
    },
    {
      onSuccess: () => {
        toast.success(editing ? 'Подкатегория обновлена' : 'Подкатегория создана')
        invalidate()
        closeForm()
      },
      onError: (error) => { toast.error(apiErrorMessage(error, 'Не удалось сохранить подкатегорию')) },
    },
  )

  const deleteMutation = useMutation(
    (slug: string) => adminDeleteSubcategory(slug),
    {
      onSuccess: () => {
        toast.success('Подкатегория удалена')
        invalidate()
        setDeleting(null)
      },
      onError: (error) => {
        toast.error(apiErrorMessage(error, 'Не удалось удалить подкатегорию'))
        setDeleting(null)
      },
    },
  )

  const openCreate = () => {
    setEditing(null)
    setActive(true)
    setImageFiles([])
    reset({ name: '', slug: '', category: '', order: 0 })
    setFormOpen(true)
  }

  const openEdit = (sub: ApiSubcategory) => {
    setEditing(sub)
    setActive(sub.is_active)
    setImageFiles([])
    reset({ name: sub.name, slug: sub.slug, category: String(sub.category.id), order: sub.order })
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setImageFiles([])
  }

  return (
    <div>
      <div className={classes.pageHead}>
        <div>
          <h1 className={classes.pageTitle}>Подкатегории</h1>
          <p className={classes.pageSubtitle}>Каждая подкатегория принадлежит категории</p>
        </div>
        <button type="button" className={classes.btnPrimary} onClick={openCreate}>
          <Plus size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
          Добавить подкатегорию
        </button>
      </div>

      <div className={classes.toolbar}>
        <Select
          ariaLabel="Фильтр по категории"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: '', label: 'Все категории' },
            ...(categories?.map((cat) => ({ value: String(cat.id), label: cat.name })) ?? []),
          ]}
        />
      </div>

      {isLoading && (
        <div>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className={classes.skeletonRow} />)}
        </div>
      )}

      {subcategories && (
        <div className={classes.tableWrap}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th>Фото</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Slug</th>
                <th>Товаров</th>
                <th>Порядок</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id}>
                  <td data-label="Фото">
                    {sub.image
                      ? <img className={classes.tableImage} src={sub.image} alt={sub.name} />
                      : <div className={classes.tableImage} />}
                  </td>
                  <td data-label="Название" className={classes.tableTitle}>{sub.name}</td>
                  <td data-label="Категория">{sub.category.name}</td>
                  <td data-label="Slug">{sub.slug}</td>
                  <td data-label="Товаров">{sub.products_count}</td>
                  <td data-label="Порядок">{sub.order}</td>
                  <td data-label="Статус">
                    {sub.is_active
                      ? <span className={classes.badgeGreen}>Активна</span>
                      : <span className={classes.badgeGray}>Скрыта</span>}
                  </td>
                  <td data-label="">
                    <div className={classes.rowActions}>
                      <button type="button" className={classes.btnIcon} onClick={() => openEdit(sub)} aria-label="Редактировать">
                        <Pencil size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                      </button>
                      <button type="button" className={classes.btnIconDanger} onClick={() => setDeleting(sub)} aria-label="Удалить">
                        <Trash2 size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className={classes.emptyState}>
              <Layers className={classes.emptyIcon} size={ICON_SIZE.empty} strokeWidth={ICON_STROKE} />
              <b>Подкатегорий нет</b>
              {categoryFilter ? 'В выбранной категории пусто.' : 'Создайте первую подкатегорию.'}
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isFormOpen} close={closeForm}>
        <div style={{ width: 440, maxWidth: '100%' }}>
          <h3 className={classes.dialogTitle}>
            {editing ? 'Редактировать подкатегорию' : 'Новая подкатегория'}
          </h3>
          <form onSubmit={handleSubmit((values) => saveMutation.mutate(values))} noValidate>
            <div className={classes.formGrid}>
              <div className={classes.fieldFull}>
                <label className={classes.label}>Категория *</label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Выберите категорию' }}
                  render={({ field }) => (
                    <Select
                      ariaLabel="Категория"
                      fullWidth
                      placeholder="— Выберите категорию —"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      options={(categories ?? []).map((cat) => ({ value: String(cat.id), label: cat.name }))}
                    />
                  )}
                />
                {errors.category && <span className={classes.errorText}>{errors.category.message}</span>}
              </div>
              <div className={classes.fieldFull}>
                <label className={classes.label}>Название *</label>
                <input
                  className={classes.input}
                  placeholder="Например: Стиральные машины"
                  {...register('name', { required: 'Укажите название' })}
                />
                {errors.name && <span className={classes.errorText}>{errors.name.message}</span>}
              </div>
              <div className={classes.field}>
                <label className={classes.label}>Slug (автоматически)</label>
                <input className={classes.input} placeholder="auto" {...register('slug')} />
              </div>
              <div className={classes.field}>
                <label className={classes.label}>Порядок</label>
                <input className={classes.input} type="number" {...register('order')} />
              </div>
              <div className={classes.fieldFull}>
                <label className={classes.label}>Изображение</label>
                <ImageDropzone
                  multiple={false}
                  files={imageFiles}
                  onChange={setImageFiles}
                  hint={editing?.image ? 'Загрузите новое, чтобы заменить текущее' : 'JPG или PNG'}
                />
              </div>
              <div className={classes.fieldFull}>
                <Toggle label="Подкатегория активна (видна на сайте)" checked={isActive} onChange={setActive} />
              </div>
            </div>
            <div className={classes.dialogActions}>
              <button type="button" className={classes.btnGhost} onClick={closeForm}>Отмена</button>
              <button type="submit" className={classes.btnPrimary} disabled={saveMutation.isLoading}>
                {saveMutation.isLoading && (
                  <Loader2 className={classes.btnSpinner} size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
                )}
                {saveMutation.isLoading ? 'Сохраняем…' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        title="Удалить подкатегорию?"
        text={`«${deleting?.name}» будет удалена безвозвратно. Подкатегорию с товарами удалить нельзя.`}
        isLoading={deleteMutation.isLoading}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.slug)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
