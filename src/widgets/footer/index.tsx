import { Link } from 'react-router-dom'
import { Wrapper } from '../../shared/ui/Wrapper'
import { useCategories } from '../../shared/api/hooks'
import { CONTACTS, activeSocials } from '../../shared/const/contacts'
import InstagramSvg from '@icons/instagram.svg?react'
import TelegramIcon from '@icons/telegram.svg?react'
import WhatsAppIcon from '@icons/whatsapp.svg?react'
import classes from './footer.module.scss'

const SOCIAL_ICONS: Record<string, typeof InstagramSvg> = {
  instagram: InstagramSvg,
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
}

export const Footer = () => {
  const { data: categories } = useCategories()
  const subcategories = (categories ?? []).flatMap((c) => c.subcategories)
  const socials = activeSocials()

  return (
    <footer className={classes.footer}>
      <Wrapper>
        <div className={classes.top}>
          {/* ── Бренд ── */}
          <div className={classes.brand}>
            <Link to="/" className={classes.logoLink} aria-label="ALRIG — на главную">
              <img
                src="/assets/icons/alrig-logo.png"
                className={classes.logo}
                alt="ALRIG"
                width={665}
                height={360}
              />
            </Link>
            <p className={classes.slogan}>
              Бытовая техника в Душанбе: надёжно, доступно, с официальной гарантией
              и рассрочкой через карту Salom.
            </p>
            {socials.length > 0 && (
              <div className={classes.socials}>
                {socials.map(({ key, label, href }) => {
                  const Icon = SOCIAL_ICONS[key]
                  return (
                    <a
                      key={key}
                      href={href}
                      className={classes.socialLink}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                    >
                      {Icon && <Icon className={classes.socialIcon} />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Навигация ── */}
          <div className={classes.col}>
            <p className={classes.colTitle}>Навигация</p>
            <nav className={classes.colLinks}>
              <Link to="/" className={classes.colLink}>Главная</Link>
              <Link to="/products" className={classes.colLink}>Каталог</Link>
              <Link to="/#contacts" className={classes.colLink}>Контакты</Link>
            </nav>
          </div>

          {/* ── Каталог ── */}
          <div className={classes.col}>
            <p className={classes.colTitle}>Каталог</p>
            <nav className={classes.colLinks}>
              {subcategories.slice(0, 6).map((sub) => (
                <Link key={sub.id} to={`/products/${sub.slug}`} className={classes.colLink}>
                  {sub.name}
                </Link>
              ))}
              <Link to="/products" className={classes.colLinkAccent}>
                Весь каталог →
              </Link>
            </nav>
          </div>

          {/* ── Контакты ── */}
          <div className={classes.col}>
            <p className={classes.colTitle}>Контакты</p>
            <div className={classes.colLinks}>
              <a href={CONTACTS.phone.href} className={classes.phone}>
                {CONTACTS.phone.label}
              </a>
              <p className={classes.contactText}>{CONTACTS.workingHours}</p>
              <p className={classes.contactText}>{CONTACTS.address}</p>
            </div>
          </div>
        </div>

        <div className={classes.bottom}>
          <p className={classes.bottomText}>© ALRIG, {new Date().getFullYear()}</p>
        </div>
      </Wrapper>
    </footer>
  )
}
