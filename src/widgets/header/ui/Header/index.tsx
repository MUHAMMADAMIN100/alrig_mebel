import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import useLockBodyScroll from '@custom-react-hooks/use-lock-body-scroll'
import { Wrapper } from '../../../../shared/ui/Wrapper'
import { useCategories } from '../../../../shared/api/hooks'
import { CONTACTS } from '../../../../shared/const/contacts'
import { useMenuStore } from '../../model/manu'
import classes from './header.module.scss'

export const Header = () => {
  const location = useLocation()
  const { data: categories } = useCategories()
  const [isScrolled, setScrolled] = useState(false)
  const [isCatalogOpen, setCatalogOpen] = useState(false)
  const catalogRef = useRef<HTMLDivElement>(null)
  const { isOpen: isMobileOpen, toggle: toggleMobile, close: closeMobile } = useMenuStore()

  useLockBodyScroll(isMobileOpen)

  // тень/фон при скролле
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // закрытие меню при смене маршрута
  useEffect(() => {
    setCatalogOpen(false)
    closeMobile()
  }, [location.pathname, location.hash, closeMobile])

  // закрытие мега-меню по клику вне
  useEffect(() => {
    if (!isCatalogOpen) return
    const onClick = (event: MouseEvent) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setCatalogOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [isCatalogOpen])

  return (
    <header className={`${classes.header} ${isScrolled ? classes.scrolled : ''}`}>
      <Wrapper>
        <div className={classes.bar}>
          {/* ── Лого ── */}
          <Link to="/" className={classes.logoLink} aria-label="ALRIG — на главную">
            <img
              src="/assets/icons/alrig-logo.png"
              className={classes.logo}
              alt="ALRIG"
              loading="eager"
              width={665}
              height={360}
            />
          </Link>

          {/* ── Навигация (desktop) ── */}
          <nav className={classes.nav} ref={catalogRef}>
            <button
              type="button"
              className={`${classes.navLink} ${isCatalogOpen ? classes.navLinkActive : ''}`}
              onClick={() => setCatalogOpen((open) => !open)}
              aria-expanded={isCatalogOpen}
            >
              Каталог
              <svg
                className={`${classes.chevron} ${isCatalogOpen ? classes.chevronUp : ''}`}
                width="10" height="6" viewBox="0 0 10 6" fill="none"
              >
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <Link to="/#contacts" className={classes.navLink}>
              Контакты
            </Link>

            {/* ── Мега-меню каталога ── */}
            <AnimatePresence>
              {isCatalogOpen && categories && (
                <motion.div
                  className={classes.megaMenu}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <div className={classes.megaGrid}>
                    {categories.map((category) => (
                      <div key={category.id} className={classes.megaCol}>
                        <Link
                          to={`/category/${category.slug}`}
                          className={classes.megaTitle}
                          onClick={() => setCatalogOpen(false)}
                        >
                          {category.name}
                        </Link>
                        <ul className={classes.megaList}>
                          {category.subcategories.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                to={`/products/${sub.slug}`}
                                className={classes.megaLink}
                                onClick={() => setCatalogOpen(false)}
                              >
                                {sub.name}
                                <span className={classes.megaCount}>{sub.products_count}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/products"
                    className={classes.megaAll}
                    onClick={() => setCatalogOpen(false)}
                  >
                    Весь каталог →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* ── Правый блок ── */}
          <div className={classes.right}>
            <a href={CONTACTS.phone.href} className={classes.phone}>
              {CONTACTS.phone.label}
            </a>
            <Link to="/products" className={classes.cta}>
              Заказать
            </Link>

            {/* ── Бургер (mobile) ── */}
            <button
              type="button"
              className={`${classes.burger} ${isMobileOpen ? classes.burgerOpen : ''}`}
              onClick={toggleMobile}
              aria-label={isMobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </Wrapper>

      {/* ── Мобильное меню ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className={classes.mobileBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
            />
            <motion.div
              className={classes.mobileMenu}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <nav className={classes.mobileNav}>
                <Link to="/products" className={classes.mobileLink} onClick={closeMobile}>
                  Каталог
                </Link>
                {categories && (
                  <div className={classes.mobileCats}>
                    {categories.flatMap((c) => c.subcategories).map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/products/${sub.slug}`}
                        className={classes.mobileCat}
                        onClick={closeMobile}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
                <Link to="/#contacts" className={classes.mobileLink} onClick={closeMobile}>
                  Контакты
                </Link>
              </nav>
              <div className={classes.mobileFooter}>
                <a href={CONTACTS.phone.href} className={classes.mobilePhone}>
                  {CONTACTS.phone.label}
                </a>
                <p className={classes.mobileHours}>{CONTACTS.workingHours}</p>
                <Link to="/products" className={classes.mobileCta} onClick={closeMobile}>
                  Заказать
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
