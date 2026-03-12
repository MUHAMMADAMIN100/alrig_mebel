// shared/ui/CooperationForm.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
// import clsx from "clsx";
import cls from "./CooperationForm.module.scss";
import { Input } from "../../../../shared/ui/Input";
import { TextArea } from "../../../../shared/ui/TextArea";
import { Button } from "../../../../shared/ui/Button";
import { BarLoader } from "../../../../shared/ui/loaders/BarLoader";
// import { Input } from "@shared/ui/Input";
// import { TextArea } from "@shared/ui/TextArea";
// import { Button } from "@shared/ui/Button";
// import { BarLoader } from "@shared/ui/loaders/BarLoader";

interface CooperationFormProps {
  selectedOptions?: Record<string, string>;
}

type FormValues = {
  name: string;
  phone: string;
  telegram?: string;
  comment?: string;
};

export const CooperationForm = ({ selectedOptions = {} }: CooperationFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      phone: "+992",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let message = `<b>Заявка с конструктора сайта</b>\n\n`;
    message += `<b>Имя:</b> ${data.name}\n`;
    message += `<b>Телефон:</b> ${data.phone}\n`;
    if (data.telegram) message += `<b>Telegram:</b> ${data.telegram}\n`;
    if (data.comment) message += `<b>Комментарий:</b> ${data.comment}\n`;

    if (Object.keys(selectedOptions).length > 0) {
      message += `\n<b>Выбранные параметры:</b>\n`;
      Object.entries(selectedOptions).forEach(([key, value]) => {
        message += `- ${key}: ${value}\n`;
      });
    }

    try {
      await fetch(`https://api.telegram.org/botYOUR_TOKEN/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: "YOUR_CHAT_ID",
          text: message,
          parse_mode: "HTML",
        }),
      });

      toast.success("Заявка отправлена!");
      reset();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Ошибка отправки");
    }
  };

  return (
    <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
      <Input label="Имя" {...register("name", { required: "Введите имя" })} errorMessage={errors.name?.message} />
      <Input label="Телефон" {...register("phone", { required: "Введите номер" })} errorMessage={errors.phone?.message} />
      <Input label="Telegram" {...register("telegram")} />
      <TextArea label="Комментарий" {...register("comment")} />

      <Button type="submit" className={cls.submit}>
        <BarLoader color="#fff" width={18} height={18} size={3} />
        <span>Отправить</span>
      </Button>
    </form>
  );
};
