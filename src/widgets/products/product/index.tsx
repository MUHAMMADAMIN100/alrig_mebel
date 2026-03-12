import { useMemo, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import classes from "./product.module.scss";
import { Button } from "../../../shared/ui/Button";
import { Wrapper } from "../../../shared/ui/Wrapper";
import { Input } from "../../../shared/ui/Input";
import { BarLoader } from "../../../shared/ui/loaders/BarLoader";
import { Modal } from "../../../shared/ui/Modal"; // <-- путь поправь под свой проект

type ProductSpec = { label: string; value: string };

type OrderFormData = {
  name: string;
  number: string;
  contact?: string; // telegram/email
  address: string;
  comment?: string;
};

export type ProductProps = {
  title: string;
  subtitle?: string;
  priceFrom?: number;
  currency?: string;
  badges?: string[];

  images: string[];
  youtubeId?: string;
  youtubeTitle?: string;

  description: string;
  specs?: ProductSpec[];

  showInstallments?: boolean;
  phone?: string;

  /** Telegram (как у тебя в индивидуальном) */
  telegramBotUrl?: string;
  telegramChatId?: number;
};

const formatMoney = (n: number) => n.toLocaleString();

export const Product = ({
  title,
  subtitle,
  priceFrom,
  currency = "сомони",
  badges = [],

  images,
  youtubeId,
  youtubeTitle,

  description,
  specs = [],

  showInstallments = true,
  phone = "975 20 51 15",

  telegramBotUrl = "https://api.telegram.org/bot7393488523:AAEOT0g2Vou4NnHxgD51NdrDi3B3gO8a63Y/sendMessage",
  telegramChatId = -1003454309909,
}: ProductProps) => {
  const safeImages = images?.length ? images : ["/assets/images/banner.webp"];
  const [activeIndex, setActiveIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<OrderFormData>();

  const activeImage = useMemo(
    () => safeImages[Math.min(activeIndex, safeImages.length - 1)],
    [safeImages, activeIndex]
  );

  const openOrderModal = () => {
    setIsModalOpen(true);
    setOrderSuccess(false);
    setLastOrderId(null);
  };

  const closeOrderModal = () => {
    setIsModalOpen(false);
    setOrderSuccess(false);
    setLastOrderId(null);
    reset();
  };

  const onSubmit = async (data: OrderFormData) => {
    const orderId = `LF-${Math.floor(100000 + Math.random() * 900000)}`;

    let text = `<b>Новый заказ Loftory ${orderId}</b>\n\n`;
    text += `<b>Товар:</b> ${title}\n`;
    if (subtitle) text += `<b>Размер:</b> ${subtitle}\n`;
    if (typeof priceFrom === "number") {
      text += `<b>Цена от:</b> ${formatMoney(priceFrom)} ${currency}\n`;
    }

    text += `\n<b>Контакты:</b>\n`;
    text += `<b>Имя:</b> ${data.name}\n`;
    text += `<b>Телефон:</b> ${data.number}\n`;
    if (data.contact) text += `<b>Telegram/Email:</b> ${data.contact}\n`;
    text += `<b>Адрес:</b> ${data.address}\n`;
    if (data.comment) text += `<b>Комментарий:</b> ${data.comment}\n`;

    text += `\n<b>Оплата:</b> доступна рассрочка через карту Salom\n`;
    text += `<b>Источник:</b> страница товара\n`;

    try {
      await fetch(telegramBotUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          parse_mode: "HTML",
          text,
        }),
      });

      setLastOrderId(orderId);
      setOrderSuccess(true);
      toast.success(`Заявка отправлена! № ${orderId}`);
      reset();
    } catch (e) {
      toast.error("Ошибка при отправке заявки");
      console.error(e);
    }
  };

  return (
    <Wrapper className={classes.page}>
      <div className={classes.product}>
        {/* LEFT: gallery + video */}
        <div className={classes.media}>
          <div className={classes.mainMedia}>
            <img className={classes.mainImg} src={activeImage} alt={title} loading="eager" />

            {badges.length > 0 && (
              <div className={classes.badges}>
                {badges.slice(0, 4).map((b) => (
                  <span key={b} className={classes.badge}>
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {safeImages.length > 1 && (
            <div className={classes.thumbs}>
              {safeImages.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={clsx(classes.thumb, i === activeIndex && classes.thumb_active)}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Фото ${i + 1}`}
                >
                  <img src={src} alt={`${title} — фото ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {youtubeId && (
            <div className={classes.video}>
              <div className={classes.videoHead}>
                <p className={classes.videoTitle}>{youtubeTitle || "Видео товара"}</p>
              </div>

              <div className={classes.videoFrame}>
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={youtubeTitle || title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: info */}
        <div className={classes.info}>
          <div className={classes.header}>
            <h1 className={classes.title}>{title}</h1>
            {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
          </div>

          {(priceFrom || showInstallments) && (
            <div className={classes.buyBox}>
              {typeof priceFrom === "number" && (
                <div className={classes.priceRow}>
                  <div>
                    <span className={classes.priceLabel}>Цена</span>
                  </div>
                  <div>
                    <span className={classes.priceValue}>{formatMoney(priceFrom)}</span>
                    <span className={classes.priceCurrency}>{currency}</span>
                  </div>
                </div>
              )}

              {showInstallments && (
                <p className={classes.installment}>
                  Рассрочка через карту <strong>Salom</strong>.
                </p>
              )}

              <div className={classes.actions}>
                <Button
                  buttonSize="medium"
                  variant="contained"
                  fullWidth
                  onClick={openOrderModal}
                >
                  Оформить заказ
                </Button>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>
                  <Button buttonSize="medium" variant="outlined" fullWidth>
                    Позвонить: {phone}
                  </Button>
                </a>
              </div>
            </div>
          )}

          <div className={classes.block}>
            <h2 className={classes.blockTitle}>Описание</h2>
            <p className={classes.text}>{description}</p>
          </div>

          {specs.length > 0 && (
            <div className={classes.block}>
              <h2 className={classes.blockTitle}>Характеристики</h2>
              <div className={classes.specs}>
                {specs.map((s) => (
                  <div key={s.label} className={classes.specRow}>
                    <span className={classes.specLabel}>{s.label}</span>
                    <span className={classes.specValue}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* <div className={classes.bottomCta}>
            <Button buttonSize="medium" variant="contained" fullWidth onClick={openOrderModal}>
              Оформить заказ
            </Button>
            <p className={classes.bottomHint}>Ответим быстро. Рассрочка Salom доступна.</p>
          </div> */}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        close={closeOrderModal}
        isShowCloseButton
        contentClassName={classes.orderModalContent}
        mainClassName={classes.orderModalMain}
      >
        {!orderSuccess ? (
          <div className={classes.orderModal}>
            <h3 className={classes.orderTitle}>Оформление заказа</h3>

            <p className={classes.orderText}>
              Вы оформляете: <strong>{title}</strong>
              {subtitle ? <> — {subtitle}</> : null}
              {typeof priceFrom === "number" ? (
                <>
                  <br />
                  Цена от: <strong>{formatMoney(priceFrom)} {currency}</strong>
                </>
              ) : null}
            </p>

            <div className={classes.formGrid}>
              <Input
                label="Имя"
                placeholder="Ваше имя"
                {...register("name", { required: "Введите имя" })}
              />
              <Input
                label="Номер телефона"
                placeholder="Например: 975 20 51 15"
                {...register("number", { required: "Введите номер" })}
              />
              <Input
                label="Telegram или Email (необязательно)"
                placeholder="@username или example@mail.com"
                {...register("contact")}
              />
              <Input
                label="Адрес"
                placeholder="Город, улица, дом/офис"
                {...register("address", { required: "Укажите адрес" })}
              />
              <Input
                label="Комментарий (необязательно)"
                placeholder="Например: этаж, удобное время"
                {...register("comment")}
              />
            </div>

            <div className={classes.orderActions}>
              <Button
                buttonSize="medium"
                variant="contained"
                fullWidth
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <BarLoader color="#fff" width={18} height={18} size={3} />
                ) : (
                  "Отправить заявку"
                )}
              </Button>
              <Button
                buttonSize="medium"
                variant="outlined"
                fullWidth
                onClick={() => closeOrderModal()}
                // disabled={isSubmitting}
              >
                Назад
              </Button>

              <p className={classes.orderHint}>
                Мы свяжемся с вами, подтвердим наличие/сроки и поможем с рассрочкой Salom.
              </p>
            </div>
          </div>
        ) : (
          <div className={classes.orderModal}>
            <h3 className={classes.orderTitle}>Заявка отправлена ✅</h3>

            <p className={classes.orderText}>
              Спасибо! {lastOrderId ? <>Номер заявки: <strong>№ {lastOrderId}</strong>.</> : null}
              <br />
              Мы свяжемся с вами, чтобы подтвердить детали.
            </p>

            <div className={classes.orderActions}>
              <Button
                buttonSize="medium"
                variant="contained"
                fullWidth
                onClick={() => {
                  setOrderSuccess(false);
                  setLastOrderId(null);
                }}
              >
                Отправить ещё одну заявку
              </Button>

              <Button
                buttonSize="medium"
                variant="outlined"
                fullWidth
                onClick={closeOrderModal}
              >
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Wrapper>
  );
};
