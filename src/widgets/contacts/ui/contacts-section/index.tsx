import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrapper } from '../../../../shared/ui/Wrapper'
import { CONTACTS, activeSocials } from '../../../../shared/const/contacts'
import { MapComponent } from '../map'
import InstagramSvg from '@icons/instagram.svg?react'
import TelegramIcon from '@icons/telegram.svg?react'
import WhatsAppIcon from '@icons/whatsapp.svg?react'
import PhoneIcon from '@icons/phone.svg?react'
import classes from './contacts-section.module.scss'

const SOCIAL_ICONS: Record<string, typeof InstagramSvg> = {
  instagram: InstagramSvg,
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
}

export const ContactsSection = () => {
  const socials = activeSocials()

  return (
    <section id="contacts" className={classes.section}>
      <Wrapper>
        <motion.div
          className={classes.card}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          {/* ── Информация ── */}
          <div className={classes.info}>
            <p className={classes.label}>Свяжитесь с нами</p>
            <h2 className={classes.title}>Контакты</h2>
            <p className={classes.subtitle}>
              Позвоните или напишите — поможем выбрать технику, рассчитаем
              рассрочку и организуем доставку по Душанбе.
            </p>

            <div className={classes.rows}>
              <a href={CONTACTS.phone.href} className={classes.phoneRow}>
                <span className={classes.rowIcon}>
                  <PhoneIcon className={classes.iconSvg} />
                </span>
                <span>
                  <span className={classes.rowCaption}>Телефон</span>
                  <span className={classes.phoneValue}>{CONTACTS.phone.label}</span>
                </span>
              </a>

              <div className={classes.row}>
                <span className={classes.rowIcon}>🕘</span>
                <span>
                  <span className={classes.rowCaption}>Режим работы</span>
                  <span className={classes.rowValue}>{CONTACTS.workingHours}</span>
                </span>
              </div>

              <div className={classes.row}>
                <span className={classes.rowIcon}>📍</span>
                <span>
                  <span className={classes.rowCaption}>Адрес</span>
                  <span className={classes.rowValue}>{CONTACTS.address}</span>
                </span>
              </div>
            </div>

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
                      <span>{label}</span>
                    </a>
                  )
                })}
              </div>
            )}

            <div className={classes.actions}>
              <a href={CONTACTS.phone.href} className={classes.primaryBtn}>
                Связаться
              </a>
              <Link to="/products" className={classes.secondaryBtn}>
                Заказать технику
              </Link>
            </div>
          </div>

          {/* ── Карта ── */}
          <div className={classes.mapWrap}>
            <MapComponent />
          </div>
        </motion.div>
      </Wrapper>
    </section>
  )
}
