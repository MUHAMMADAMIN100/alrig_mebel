/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import classes from './price.module.scss'
import { AnimatedPrice } from '../../../../shared/ui/AnimatedPrice'
import { Button } from '../../../../shared/ui/Button'
import { Input } from '../../../../shared/ui/Input'
import { BarLoader } from '../../../../shared/ui/loaders/BarLoader'
import clsx from 'clsx'

/** -----------------------------
 *  Настройки Loftory (ПОД СЕБЯ)
 *  -----------------------------
 *  Здесь ты задаёшь цены/коэфы.
 *  Сделано максимально просто: m2, периметр, наценки.
 */

type TableShape = 'rect' | 'round'
type LdspThickness = 16 | 18
type EdgeType = 'pvc_0_4' | 'pvc_2'
type MetalColor = 'black' | 'white' | 'graphite'
type TopColor = 'oak' | 'white' | 'concrete' | 'black'

type FormData = {
  name: string
  number: string
  contact?: string // telegram/email
  address: string
  comment?: string
}

type TableConfig = {
  shape: TableShape
  lengthCm: number // для прямоугольного
  widthCm: number  // для прямоугольного
  diameterCm: number // для круглого
  heightCm: number

  topColor: TopColor
  ldspThickness: LdspThickness
  edge: EdgeType
  metalColor: MetalColor

  hasLegLevelers: boolean // у вас всегда true, но оставил как факт в заказе
  delivery: boolean
  assembly: boolean
}

/** Базовые прайсы (примерные — поменяй на свои) */
const PRICES = {
  /** ЛДСП по м2 (столешница) */
  ldspPerM2: {
    16: 280, // сомони / м2
    18: 320,
  } as const,

  /** Каркас/металл базово (за стол) */
  frameBase: 550, // сомони

  /** Наценка за цвет металла */
  metalColorAdd: {
    black: 0,
    white: 40,
    graphite: 60,
  } as const,

  /** Кромка по погонному метру */
  edgePerMeter: {
    pvc_0_4: 12,
    pvc_2: 28,
  } as const,

  /** Доставка/сборка */
  delivery: 80,
  assembly: 60,

  /** Минимальная цена (чтобы не уходить в ноль на мелких столах) */
  minTotal: 1200,
}

/** Калькулятор площади/периметра */
function calcGeometry(cfg: TableConfig) {
  if (cfg.shape === 'round') {
    const rM = (cfg.diameterCm / 100) / 2
    const area = Math.PI * rM * rM
    const perimeter = 2 * Math.PI * rM
    return { areaM2: area, perimeterM: perimeter }
  }
  const areaM2 = (cfg.lengthCm / 100) * (cfg.widthCm / 100)
  const perimeterM = 2 * ((cfg.lengthCm / 100) + (cfg.widthCm / 100))
  return { areaM2, perimeterM }
}

function formatMoney(n: number) {
  return Math.round(n).toLocaleString()
}

export const PriceConstructor = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>()

  const [step, setStep] = useState<1 | 2>(1)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)

  // Конфиг по умолчанию (под популярную модель)
  const [cfg, setCfg] = useState<TableConfig>({
    shape: 'rect',
    lengthCm: 120,
    widthCm: 60,
    diameterCm: 80,
    heightCm: 75,

    topColor: 'oak',
    ldspThickness: 18,
    edge: 'pvc_2',
    metalColor: 'black',

    hasLegLevelers: true,
    delivery: true,
    assembly: false,
  })

  /** Цена считается автоматически */
  const price = useMemo(() => {
    const { areaM2, perimeterM } = calcGeometry(cfg)

    const top = areaM2 * PRICES.ldspPerM2[cfg.ldspThickness]
    const edge = perimeterM * PRICES.edgePerMeter[cfg.edge]
    const frame = PRICES.frameBase + PRICES.metalColorAdd[cfg.metalColor]
    const services = (cfg.delivery ? PRICES.delivery : 0) + (cfg.assembly ? PRICES.assembly : 0)

    const raw = top + edge + frame + services

    // Минимальная цена (чтобы маленькие размеры не убивали маржу)
    const total = Math.max(PRICES.minTotal, raw)

    return {
      areaM2,
      perimeterM,
      top: Math.round(top),
      edge: Math.round(edge),
      frame: Math.round(frame),
      services: Math.round(services),
      total: Math.round(total),
    }
  }, [cfg])

  const canGoNext = useMemo(() => {
    if (cfg.shape === 'round') {
      return cfg.diameterCm >= 60 && cfg.diameterCm <= 140 && cfg.heightCm >= 65 && cfg.heightCm <= 110
    }
    return (
      cfg.lengthCm >= 60 &&
      cfg.lengthCm <= 220 &&
      cfg.widthCm >= 40 &&
      cfg.widthCm <= 120 &&
      cfg.heightCm >= 65 &&
      cfg.heightCm <= 110
    )
  }, [cfg])

  const goNextStep = () => {
    if (!canGoNext) {
      toast.error('Проверьте размеры — они вне допустимого диапазона')
      return
    }
    setStep(2)
    setOrderSuccess(false)
  }

  const goPrevStep = () => setStep(1)

  const resetAll = () => {
    reset()
    setStep(1)
  }

  const handleNewOrder = () => {
    setOrderSuccess(false)
    setLastOrderId(null)
    resetAll()
  }

  const onSubmit = async (data: FormData) => {
    const orderId = `LF-${Math.floor(100000 + Math.random() * 900000)}`

    const shapeText =
      cfg.shape === 'round'
        ? `Круглый стол (Ø ${cfg.diameterCm} см)`
        : `Прямоугольный стол (${cfg.lengthCm}×${cfg.widthCm} см)`

    let text = `<b>Новый заказ Loftory ${orderId}</b>\n\n`
    text += `<b>Имя:</b> ${data.name}\n`
    text += `<b>Телефон:</b> ${data.number}\n`
    if (data.contact) text += `<b>Telegram/Email:</b> ${data.contact}\n`
    text += `<b>Адрес:</b> ${data.address}\n`
    if (data.comment) text += `<b>Комментарий:</b> ${data.comment}\n`

    text += `\n<b>Конфигурация стола:</b>\n`
    text += `- Форма: ${shapeText}\n`
    text += `- Высота: ${cfg.heightCm} см\n`
    text += `- Цвет столешницы: ${cfg.topColor}\n`
    text += `- ЛДСП: ${cfg.ldspThickness} мм\n`
    text += `- Кромка: ${cfg.edge === 'pvc_2' ? 'ПВХ 2 мм' : 'ПВХ 0.4 мм'}\n`
    text += `- Цвет металла: ${cfg.metalColor}\n`
    text += `- Регулировка ножек: ${cfg.hasLegLevelers ? 'Да' : 'Нет'}\n`
    text += `- Доставка: ${cfg.delivery ? 'Да' : 'Нет'}\n`
    text += `- Сборка: ${cfg.assembly ? 'Да' : 'Нет'}\n`

    text += `\n<b>Расчёт:</b>\n`
    text += `- Столешница: ${formatMoney(price.top)} сомони\n`
    text += `- Кромка: ${formatMoney(price.edge)} сомони\n`
    text += `- Каркас: ${formatMoney(price.frame)} сомони\n`
    if (price.services > 0) text += `- Услуги: ${formatMoney(price.services)} сомони\n`
    text += `\n<b>Итого:</b> ${formatMoney(price.total)} сомони\n`
    text += `\n<b>Оплата:</b> доступна рассрочка через карту Salom\n`

    try {
      await fetch(
        `https://api.telegram.org/bot7393488523:AAEOT0g2Vou4NnHxgD51NdrDi3B3gO8a63Y/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: -1003454309909,
            parse_mode: 'HTML',
            text,
          }),
        }
      )

      setLastOrderId(orderId)
      setOrderSuccess(true)
      toast.success(`Заказ отправлен! № ${orderId}`)
      resetAll()
    } catch (e) {
      toast.error('Ошибка при отправке заказа')
      console.error(e)
    }
  }

  const renderStep1 = () => (
    <div className={classes.block}>
      <h3 className={classes.stepTitle}>Соберите свой стол</h3>
      <p className={classes.helperText}>
        Выберите размеры и материалы — стоимость пересчитывается автоматически.
      </p>

      {/* Форма/размеры */}
      <h4 className={classes.subTitle}>1) Форма и размеры</h4>

      <div className={classes.optionGrid}>
        <button
          type="button"
          className={clsx(classes.optionCard, cfg.shape === 'rect' && classes.optionCard_active)}
          onClick={() => setCfg(prev => ({ ...prev, shape: 'rect' }))}
        >
          <div className={classes.optionInfo}>
            <div className={classes.optionName}>Прямоугольный</div>
            <div className={classes.optionBottom}>
              <span className={classes.optionAction}>
                {cfg.shape === 'rect' ? 'Выбрано' : 'Выбрать'}
              </span>
            </div>
          </div>
        </button>

        <button
          type="button"
          className={clsx(classes.optionCard, cfg.shape === 'round' && classes.optionCard_active)}
          onClick={() => setCfg(prev => ({ ...prev, shape: 'round' }))}
        >
          <div className={classes.optionInfo}>
            <div className={classes.optionName}>Круглый</div>
            <div className={classes.optionBottom}>
              <span className={classes.optionAction}>
                {cfg.shape === 'round' ? 'Выбрано' : 'Выбрать'}
              </span>
            </div>
          </div>
        </button>
      </div>

      {cfg.shape === 'rect' ? (
        <div className={classes.formRow}>
          <Input
            label="Длина (см)"
            type="number"
            min={60}
            max={220}
            value={cfg.lengthCm}
            onChange={(e) =>
              setCfg((p) => ({ ...p, lengthCm: Number((e.target as HTMLInputElement).value) || 0 }))
            }
            placeholder="Например: 120"
          />
          <Input
            label="Ширина (см)"
            type="number"
            min={40}
            max={120}
            value={cfg.widthCm}
            onChange={(e) =>
              setCfg((p) => ({ ...p, widthCm: Number((e.target as HTMLInputElement).value) || 0 }))
            }
            placeholder="Например: 60"
          />
        </div>
      ) : (
        <div className={classes.formRow}>
          <Input
            label="Диаметр (см)"
            type="number"
            min={60}
            max={140}
            value={cfg.diameterCm}
            onChange={(e) =>
              setCfg((p) => ({ ...p, diameterCm: Number((e.target as HTMLInputElement).value) || 0 }))
            }
            placeholder="Например: 80"
          />
        </div>
      )}

      <div className={classes.formRow}>
        <Input
          label="Высота (см)"
          type="number"
          min={65}
          max={110}
          value={cfg.heightCm}
          onChange={(e) =>
            setCfg((p) => ({ ...p, heightCm: Number((e.target as HTMLInputElement).value) || 0 }))
          }
          placeholder="Например: 75"
        />
      </div>

      {/* Материалы */}
      <h4 className={classes.subTitle}>2) Материалы</h4>

      <div className={classes.optionGrid}>
        <button
          type="button"
          className={clsx(classes.optionCard, cfg.ldspThickness === 16 && classes.optionCard_active)}
          onClick={() => setCfg((p) => ({ ...p, ldspThickness: 16 }))}
        >
          <div className={classes.optionInfo}>
            <div className={classes.optionName}>ЛДСП 16 мм</div>
            <div className={classes.optionBottom}>
              <span className={classes.optionAction}>
                {cfg.ldspThickness === 16 ? 'Выбрано' : 'Выбрать'}
              </span>
            </div>
          </div>
        </button>

        <button
          type="button"
          className={clsx(classes.optionCard, cfg.ldspThickness === 18 && classes.optionCard_active)}
          onClick={() => setCfg((p) => ({ ...p, ldspThickness: 18 }))}
        >
          <div className={classes.optionInfo}>
            <div className={classes.optionName}>ЛДСП 18 мм</div>
            <div className={classes.optionBottom}>
              <span className={classes.optionAction}>
                {cfg.ldspThickness === 18 ? 'Выбрано' : 'Выбрать'}
              </span>
            </div>
          </div>
        </button>
      </div>

      <div className={classes.optionGrid}>
        <button
          type="button"
          className={clsx(classes.optionCard, cfg.edge === 'pvc_0_4' && classes.optionCard_active)}
          onClick={() => setCfg((p) => ({ ...p, edge: 'pvc_0_4' }))}
        >
          <div className={classes.optionInfo}>
            <div className={classes.optionName}>Кромка ПВХ 0.4 мм</div>
            <div className={classes.optionBottom}>
              <span className={classes.optionAction}>
                {cfg.edge === 'pvc_0_4' ? 'Выбрано' : 'Выбрать'}
              </span>
            </div>
          </div>
        </button>

        <button
          type="button"
          className={clsx(classes.optionCard, cfg.edge === 'pvc_2' && classes.optionCard_active)}
          onClick={() => setCfg((p) => ({ ...p, edge: 'pvc_2' }))}
        >
          <div className={classes.optionInfo}>
            <div className={classes.optionName}>Кромка ПВХ 2 мм</div>
            <div className={classes.optionBottom}>
              <span className={classes.optionAction}>
                {cfg.edge === 'pvc_2' ? 'Выбрано' : 'Выбрать'}
              </span>
            </div>
          </div>
        </button>
      </div>

      <h4 className={classes.subTitle}>3) Цвет</h4>

      <div className={classes.optionGrid}>
        {(['oak', 'white', 'concrete', 'black'] as TopColor[]).map((c) => (
          <button
            key={c}
            type="button"
            className={clsx(classes.optionCard, cfg.topColor === c && classes.optionCard_active)}
            onClick={() => setCfg((p) => ({ ...p, topColor: c }))}
          >
            <div className={classes.optionInfo}>
              <div className={classes.optionName}>
                {c === 'oak' ? 'Дуб' : c === 'white' ? 'Белый' : c === 'concrete' ? 'Бетон' : 'Чёрный'}
              </div>
              <div className={classes.optionBottom}>
                <span className={classes.optionAction}>
                  {cfg.topColor === c ? 'Выбрано' : 'Выбрать'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <h4 className={classes.subTitle}>4) Металл</h4>

      <div className={classes.optionGrid}>
        {(['black', 'white', 'graphite'] as MetalColor[]).map((c) => (
          <button
            key={c}
            type="button"
            className={clsx(classes.optionCard, cfg.metalColor === c && classes.optionCard_active)}
            onClick={() => setCfg((p) => ({ ...p, metalColor: c }))}
          >
            <div className={classes.optionInfo}>
              <div className={classes.optionName}>
                {c === 'black' ? 'Чёрный' : c === 'white' ? 'Белый' : 'Графит'}
              </div>
              <div className={classes.optionBottom}>
                <span className={classes.optionAction}>
                  {cfg.metalColor === c ? 'Выбрано' : 'Выбрать'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Услуги */}
      <h4 className={classes.subTitle}>5) Доставка и сборка</h4>

      <div className={classes.optionGrid}>
        <button
          type="button"
          className={clsx(classes.optionCard, cfg.delivery && classes.optionCard_active)}
          onClick={() => setCfg((p) => ({ ...p, delivery: !p.delivery }))}
        >
          <div className={classes.optionInfo}>
            <div className={classes.optionName}>Доставка по Душанбе</div>
            <div className={classes.optionBottom}>
              <span className={classes.optionAction}>{cfg.delivery ? 'Включено' : 'Добавить'}</span>
            </div>
          </div>
        </button>

        <button
          type="button"
          className={clsx(classes.optionCard, cfg.assembly && classes.optionCard_active)}
          onClick={() => setCfg((p) => ({ ...p, assembly: !p.assembly }))}
        >
          <div className={classes.optionInfo}>
            <div className={classes.optionName}>Сборка</div>
            <div className={classes.optionBottom}>
              <span className={classes.optionAction}>{cfg.assembly ? 'Включено' : 'Добавить'}</span>
            </div>
          </div>
        </button>

        <button
          type="button"
          className={clsx(classes.optionCard, classes.optionCard_active)}
          disabled
        >
          <div className={classes.optionInfo}>
            <div className={classes.optionName}>Регулировка ножек</div>
            <div className={classes.optionBottom}>
              <span className={classes.optionAction}>Всегда включено</span>
            </div>
          </div>
        </button>
      </div>

      {/* Итог */}
      <div className={classes.summary}>
        <h4>Итоговая стоимость</h4>
        <ul className={classes.summaryList}>
          <li><span>Столешница</span><span className={classes.pricess}>{formatMoney(price.top)} сомони</span></li>
          <li><span>Кромка</span><span className={classes.pricess}>{formatMoney(price.edge)} сомони</span></li>
          <li><span>Каркас</span><span className={classes.pricess}>{formatMoney(price.frame)} сомони</span></li>
          {price.services > 0 && (
            <li><span>Услуги</span><span className={classes.pricess}>{formatMoney(price.services)} сомони</span></li>
          )}
        </ul>

        <div className={classes.total}>
          Итого:
          <div>
            <AnimatedPrice targetPrice={price.total} duration={500} />
          </div>
          <p className={classes.helperTextSmall}>
            Доступна рассрочка через карту Salom.
          </p>
        </div>
      </div>

      <Button buttonSize="medium" onClick={goNextStep}>
        Перейти к оформлению
      </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className={classes.form}>
      <div className={classes.block}>
        <h3 className={classes.stepTitle}>Оформление заказа</h3>
        <p className={classes.helperText}>
          Оставьте контакты — мы подтвердим размеры, цвет и сроки изготовления.
        </p>

        <h4 className={classes.subTitle}>Контакты</h4>
        <Input
          label="Имя"
          placeholder="Ваше имя"
          {...register('name', { required: 'Введите имя' })}
        />
        <Input
          label="Номер телефона"
          placeholder="Например: 975 20 51 15"
          {...register('number', { required: 'Введите номер' })}
        />
        <Input
          label="Telegram или Email (необязательно)"
          placeholder="@username или example@mail.com"
          {...register('contact')}
        />

        <h4 className={classes.subTitle}>Доставка</h4>
        <Input
          label="Адрес"
          placeholder="Город, улица, дом/офис"
          {...register('address', { required: 'Укажите адрес' })}
        />
        <Input
          label="Комментарий (необязательно)"
          placeholder="Например: этаж, лифт, удобное время"
          {...register('comment')}
        />

        <div className={classes.navButtons}>
          <Button
            buttonSize="small"
            variant="outlined"
            type="button"
            onClick={goPrevStep}
          >
            Назад к настройке
          </Button>
        </div>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className={classes.successBlock}>
      <h3 className={classes.stepTitle}>Заявка отправлена</h3>
      <p className={classes.helperText}>
        Спасибо! {lastOrderId && <>Номер заявки: <span className={classes.orderId}>№ {lastOrderId}</span>.</>}
        Мы свяжемся с вами, чтобы подтвердить детали.
      </p>
      <Button buttonSize="medium" onClick={handleNewOrder}>
        Собрать ещё один стол
      </Button>
    </div>
  )

  return (
    <section className={classes.section}>
      <div className={classes.content}>
        <p className={classes.description}>
          Настройте размеры и материалы — калькулятор покажет стоимость сразу.
        </p>

        {!orderSuccess && (
          <div className={classes.stepsIndicator}>Шаг {step} из 2</div>
        )}

        {orderSuccess ? renderSuccess() : step === 1 ? renderStep1() : renderStep2()}
      </div>

      <aside className={classes.formBlock}>
        <h3 className={classes.sidebarTitle}>Ваш стол</h3>

        <div className={classes.sidebarTotal}>
          <div className={classes.sidebarRow}>
            <span className={classes.sidebarRowLabel}>Форма:</span>
            <span className={classes.sidebarRowValue}>
              {cfg.shape === 'round' ? 'Круглый' : 'Прямоугольный'}
            </span>
          </div>

          <div className={classes.sidebarRow}>
            <span className={classes.sidebarRowLabel}>Размер:</span>
            <span className={classes.sidebarRowValue}>
              {cfg.shape === 'round'
                ? `Ø ${cfg.diameterCm} см`
                : `${cfg.lengthCm}×${cfg.widthCm} см`}
            </span>
          </div>

          <div className={classes.sidebarRow}>
            <span className={classes.sidebarRowLabel}>Высота:</span>
            <span className={classes.sidebarRowValue}>{cfg.heightCm} см</span>
          </div>

          <div className={classes.sidebarRow}>
            <span className={classes.sidebarRowLabel}>ЛДСП:</span>
            <span className={classes.sidebarRowValue}>{cfg.ldspThickness} мм</span>
          </div>

          <div className={classes.sidebarRow}>
            <span className={classes.sidebarRowLabel}>Кромка:</span>
            <span className={classes.sidebarRowValue}>
              {cfg.edge === 'pvc_2' ? 'ПВХ 2 мм' : 'ПВХ 0.4 мм'}
            </span>
          </div>

          <div className={classes.sidebarRow}>
            <span className={classes.sidebarRowLabel}>Цвет металла:</span>
            <span className={classes.sidebarRowValue}>
              {cfg.metalColor === 'black' ? 'Чёрный' : cfg.metalColor === 'white' ? 'Белый' : 'Графит'}
            </span>
          </div>

          <div className={`${classes.sidebarRow} ${classes.sidebarRowGrand}`}>
            <span className={classes.sidebarRowLabel}>Итого:</span>
            <span className={classes.sidebarRowValue}>
              <AnimatedPrice targetPrice={price.total} duration={500} />
            </span>
          </div>

          <p className={classes.helperTextSmall}>
            Рассрочка через Salom доступна.
          </p>
        </div>

        {!orderSuccess && (
          <Button
            buttonSize="medium"
            disabled={step === 2 && isSubmitting}
            onClick={step === 1 ? goNextStep : handleSubmit(onSubmit)}
          >
            {step === 1
              ? 'Оформить заявку'
              : isSubmitting
              ? <BarLoader color="#fff" width={18} height={18} size={3} />
              : 'Отправить заявку'}
          </Button>
        )}
      </aside>
    </section>
  )
}
