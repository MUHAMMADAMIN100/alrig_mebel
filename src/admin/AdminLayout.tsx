import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ExternalLink,
  FolderTree,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Package,
} from 'lucide-react'
import { useAuthStore } from '../shared/auth/useAuthStore'
import { ICON_SIZE, ICON_STROKE } from './lib/icons'
import classes from './admin.module.scss'

const NAV_ITEMS: { to: string; label: string; icon: LucideIcon; end: boolean }[] = [
  { to: '/admin', label: 'Дашборд', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Товары', icon: Package, end: false },
  { to: '/admin/categories', label: 'Категории', icon: FolderTree, end: false },
  { to: '/admin/subcategories', label: 'Подкатегории', icon: Layers, end: false },
  { to: '/admin/orders', label: 'Заявки', icon: Inbox, end: false },
]

export const AdminLayout = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={classes.layout}>
      <aside className={classes.sidebar}>
        <NavLink to="/admin" className={classes.logo} end>
          <img
            src="/assets/icons/alrig-logo.png"
            alt="ALRIG"
            className={classes.logoImg}
          />
          <span className={classes.logoText}>admin</span>
        </NavLink>

        <nav className={classes.nav}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? `${classes.navItem} ${classes.navItemActive}` : classes.navItem
                }
              >
                <Icon className={classes.navIcon} size={ICON_SIZE.nav} strokeWidth={ICON_STROKE} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className={classes.sidebarFooter}>
          <a href="/" target="_blank" rel="noreferrer" className={classes.siteLink}>
            <ExternalLink size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
            Открыть сайт
          </a>
          <div className={classes.userRow}>
            <div className={classes.userAvatar}>{(user?.username ?? 'A')[0].toUpperCase()}</div>
            <div className={classes.userInfo}>
              <span className={classes.userName}>{user?.username}</span>
              <button type="button" className={classes.logoutBtn} onClick={handleLogout}>
                <LogOut size={ICON_SIZE.mini} strokeWidth={ICON_STROKE} />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className={classes.content}>
        <Outlet />
      </main>
    </div>
  )
}
