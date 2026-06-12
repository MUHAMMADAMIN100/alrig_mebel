import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { Modal } from '../../shared/ui/Modal'
import { Input } from '../../shared/ui/Input'
import { Button } from '../../shared/ui/Button'
import { createOrder, CreateOrderPayload } from '../../shared/api/catalog'
import { CONTACTS } from '../../shared/const/contacts'
import classes from './order-modal.module.scss'

interface FormValues {
  name: string
  phone: string
  comment: string
}

interface Props {
  isOpen: boolean
  close(): void
  productId?: number
  productName?: string
}

export const OrderModal = ({ isOpen, close, productId, productName }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: '', phone: '', comment: '' } })

  const mutation = useMutation(
    (payload: CreateOrderPayload) => createOrder(payload),
    {
      onSuccess: () => {
        toast.success('Заявка отправлена! Мы свяжемся с вами в ближайшее время.')
        reset()
        close()
      },
      onError: () => {
        toast.error('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.')
      },
    },
  )

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      name: values.name.trim(),
      phone: values.phone.trim(),
      comment: values.comment.trim(),
      product: productId ?? null,
    })
  }

  return (
    <Modal isOpen={isOpen} close={close}>
      <div className={classes.body}>
        <h3 className={classes.title}>Оформить заявку</h3>
        {productName && (
          <p className={classes.product}>{productName}</p>
        )}
        <p className={classes.hint}>
          Оставьте контакты — мы перезвоним, ответим на вопросы и оформим заказ.
        </p>

        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Ваше имя"
            errorMessage={errors.name?.message}
            {...register('name', {
              required: 'Укажите имя',
              minLength: { value: 2, message: 'Слишком короткое имя' },
            })}
          />
          <Input
            label="Телефон"
            type="tel"
            errorMessage={errors.phone?.message}
            {...register('phone', {
              required: 'Укажите номер телефона',
              minLength: { value: 7, message: 'Слишком короткий номер' },
            })}
          />
          <Input
            label="Комментарий (необязательно)"
            errorMessage={errors.comment?.message}
            {...register('comment')}
          />
          <Button
            type="submit"
            fullWidth
            disabled={mutation.isLoading}
            className={classes.submit}
          >
            {mutation.isLoading ? 'Отправляем…' : 'Отправить заявку'}
          </Button>
        </form>

        <p className={classes.phoneHint}>
          Или позвоните нам: <a href={CONTACTS.phone.href}>{CONTACTS.phone.label}</a>
        </p>
        {CONTACTS.address && (
          <p className={classes.addressHint}>
            Адрес:{' '}
            <a href={CONTACTS.routeUrl} target="_blank" rel="noreferrer">{CONTACTS.address}</a>
          </p>
        )}
      </div>
    </Modal>
  )
}
