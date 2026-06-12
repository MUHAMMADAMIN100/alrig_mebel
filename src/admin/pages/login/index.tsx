import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '../../../shared/auth/useAuthStore'
import { ICON_SIZE, ICON_STROKE } from '../../lib/icons'
import classes from './login.module.scss'

interface FormValues {
  username: string
  password: string
}

export const LoginPage = () => {
  const login = useAuthStore((state) => state.login)
  const status = useAuthStore((state) => state.status)
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { username: '', password: '' } })

  // уже вошли — сразу в админку
  if (status === 'authenticated') {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      await login(values.username.trim(), values.password)
      toast.success('Добро пожаловать!')
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true })
    } catch {
      toast.error('Неверный логин или пароль')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={classes.page}>
      <div className={classes.glow} />
      <motion.div
        className={classes.card}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className={classes.logo}>
          <img
            src="/assets/icons/alrig-logo.png"
            alt="ALRIG"
            className={classes.logoImg}
          />
        </div>
        <h1 className={classes.title}>Вход в админ-панель</h1>
        <p className={classes.subtitle}>Управление каталогом и заявками</p>

        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={classes.field}>
            <label className={classes.label} htmlFor="login-username">Логин</label>
            <input
              id="login-username"
              className={classes.input}
              type="text"
              autoComplete="username"
              placeholder="Имя пользователя"
              {...register('username', { required: 'Укажите логин' })}
            />
            {errors.username && <span className={classes.error}>{errors.username.message}</span>}
          </div>

          <div className={classes.field}>
            <label className={classes.label} htmlFor="login-password">Пароль</label>
            <input
              id="login-password"
              className={classes.input}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password', { required: 'Укажите пароль' })}
            />
            {errors.password && <span className={classes.error}>{errors.password.message}</span>}
          </div>

          <button type="submit" className={classes.submit} disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className={classes.spinner} size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
            )}
            {isSubmitting ? 'Входим…' : 'Войти'}
          </button>
        </form>

        <a href="/" className={classes.backLink}>← Вернуться на сайт</a>
      </motion.div>
    </div>
  )
}
