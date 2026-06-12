import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { FolderOpen, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Modal } from '../../../shared/ui/Modal'
import { getCategories } from '../../../shared/api/catalog'
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminUpdateCategory,
  CategoryPayload,
} from '../../../shared/api/admin'
import { ApiCategory } from '../../../shared/api/types'
import { ConfirmModal } from '../../../shared/ui/ConfirmModal'
import { Toggle } from '../../components/Toggle'
import { ImageDropzone } from '../../components/ImageDropzone'
import { apiErrorMessage } from '../../lib/apiError'
import { ICON_SIZE, ICON_STROKE } from '../../lib/icons'
import classes from '../../admin.module.scss'

interface FormValues {
  name: string
  slug: string
  order: number
}

export const AdminCategoriesPage = () => {
  const queryClient = useQueryClient()
  const { data: categories, isLoading } = useQuery('admin-categories', getCategories)

  const [editing, setEditing] = useState<ApiCategory | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)
  const [isActive, setActive] = useState(true)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [deleting, setDeleting] = useState<ApiCategory | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>()

  const invalidate = () => {
    queryClient.invalidateQueries('admin-categories')
    queryClient.invalidateQueries('categories')
    queryClient.invalidateQueries('admin-subcategories')
  }

  const saveMutation = useMutation(
    (values: FormValues) => {
      const payload: Partial<CategoryPayload> = {
        name: values.name.trim(),
        slug: values.slug.trim() || undefined,
        order: Number(values.order) || 0,
        is_active: isActive,
        image: imageFiles[0] ?? undefined,
      }
      return editing
        ? adminUpdateCategory(editing.slug, payload)
        : adminCreateCategory(payload as CategoryPayload)
    },
    {
      onSuccess: () => {
        toast.success(editing ? 'Категория обновлена' : 'Категория создана')
        invalidate()
        closeForm()
      },
      onError: (error) => { toast.error(apiErrorMessage(error, 'Не удалось сохранить категорию')) },
    },
  )

  const deleteMutation = useMutation(
    (slug: string) => adminDeleteCategory(slug),
    {
      onSuccess: () => {
        toast.success('Удалено')
        invalidate()
        setDeleting(null)
        setDeleteError(null)
      },
      onError: (error) => {
        setDeleteError(apiErrorMessage(error, 'Не удалось удалить категорию'))
      },
    },
  )

  const closeDelete = () => {
    setDeleting(null)
    setDeleteError(null)
  }

  // категорию с подкатегориями удалить нельзя (PROTECT)
  const deleteBlocked = !!deleting && deleting.subcategories.length > 0

  const openCreate = () => {
    setEditing(null)
    setActive(true)
    setImageFiles([])
    reset({ name: '', slug: '', order: 0 })
    setFormOpen(true)
  }

  const openEdit = (category: ApiCategory) => {
    setEditing(category)
    setActive(category.is_active)
    setImageFiles([])
    reset({ name: category.name, slug: category.slug, order: category.order })
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
          <h1 className={classes.pageTitle}>Категории</h1>
          <p className={classes.pageSubtitle}>Верхний уровень каталога</p>
        </div>
        <button type="button" className={classes.btnPrimary} onClick={openCreate}>
          <Plus size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
          Добавить категорию
        </button>
      </div>

      {isLoading && (
        <div>
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className={classes.skeletonRow} />)}
        </div>
      )}

      {categories && (
        <div className={classes.tableWrap}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th>Фото</th>
                <th>Название</th>
                <th>Slug</th>
                <th>Подкатегорий</th>
                <th>Товаров</th>
                <th>Порядок</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td data-label="Фото">
                    {category.image
                      ? <img className={classes.tableImage} src={category.image} alt={category.name} />
                      : <div className={classes.tableImage} />}
                  </td>
                  <td data-label="Название" className={classes.tableTitle}>{category.name}</td>
                  <td data-label="Slug">{category.slug}</td>
                  <td data-label="Подкатегорий">{category.subcategories.length}</td>
                  <td data-label="Товаров">{category.products_count}</td>
                  <td data-label="Порядок">{category.order}</td>
                  <td data-label="Статус">
                    {category.is_active
                      ? <span className={classes.badgeGreen}>Активна</span>
                      : <span className={classes.badgeGray}>Скрыта</span>}
                  </td>
                  <td data-label="">
                    <div className={classes.rowActions}>
                      <button type="button" className={classes.btnIcon} onClick={() => openEdit(category)} aria-label="Редактировать">
                        <Pencil size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                      </button>
                      <button type="button" className={classes.btnIconDanger} onClick={() => setDeleting(category)} aria-label="Удалить">
                        <Trash2 size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className={classes.emptyState}>
              <FolderOpen className={classes.emptyIcon} size={ICON_SIZE.empty} strokeWidth={ICON_STROKE} />
              <b>Категорий пока нет</b>
              Создайте первую категорию, чтобы начать наполнять каталог.
            </div>
          )}
        </div>
      )}

      {/* ── Форма создания/редактирования ── */}
      <Modal isOpen={isFormOpen} close={closeForm}>
        <div style={{ width: 440, maxWidth: '100%' }}>
          <h3 className={classes.dialogTitle}>
            {editing ? 'Редактировать категорию' : 'Новая категория'}
          </h3>
          <form onSubmit={handleSubmit((values) => saveMutation.mutate(values))} noValidate>
            <div className={classes.formGrid}>
              <div className={classes.fieldFull}>
                <label className={classes.label}>Название *</label>
                <input
                  className={classes.input}
                  placeholder="Например: Крупная техника"
                  aria-invalid={!!errors.name}
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
                <Toggle label="Категория активна (видна на сайте)" checked={isActive} onChange={setActive} />
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

      <ConfirmModal
        isOpen={!!deleting}
        title={`Удалить категорию «${deleting?.name ?? ''}»?`}
        description="Действие необратимо."
        isLoading={deleteMutation.isLoading}
        confirmDisabled={deleteBlocked}
        errorMessage={
          deleteBlocked
            ? 'Сначала удалите или перенесите подкатегории этой категории.'
            : deleteError
        }
        onConfirm={() => deleting && deleteMutation.mutate(deleting.slug)}
        onCancel={closeDelete}
      />
    </div>
  )
}
