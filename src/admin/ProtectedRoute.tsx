import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../shared/auth/useAuthStore'
import classes from './admin.module.scss'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const status = useAuthStore((state) => state.status)
  const location = useLocation()

  // idle/loading — сессия ещё восстанавливается из localStorage
  if (status === 'idle' || status === 'loading') {
    return (
      <div className={classes.fullScreenCenter}>
        <div className={classes.spinner} />
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
