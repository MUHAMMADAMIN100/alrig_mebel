import clsx from "clsx";
// import { Button } from "../../../../shared/ui/Button"
import { Title } from "../../../../shared/ui/Title/indext";
import { Wrapper } from "../../../../shared/ui/Wrapper";
import classes from "./services-section.module.scss";
import { ServicesTable } from "../ServicesTable";
// import { Subtitle } from "../../../../shared/ui/Subtitle/indext"
import { IService } from "../../model/services";
import { useReveal } from "./useReveal";


const TestDate: IService[] = [
  {
    id: 1,
    name: "Диагностика первичная",
    description: "Определим причины и составим план.",
    image: "./assets/images/service_1.webp",
    price: 'от 300',
    slug: "string",
  },
  {
    id: 2,
    name: "Консультация психолога",
    description: "Для детей, подростков и взрослых.",
    image: "./assets/images/service_2.webp",
    price: 'от 250',
    slug: "string",
  },
  {
    id: 3,
    name: "Нейросенсорная коррекция",
    description: "Внимание, память, речь.",
    image: "./assets/images/service_3.webp",
    price: 'от 200',
    slug: "string",
  },
  {
    id: 4,
    name: "Поддержка родителей.",
    description: "Помощь и поддержка в вопросах родительства",
    image: "./assets/images/service_4.webp",
    price: 'от 150',
    slug: "string",
  },
];

export const ServicesSection = () => {
  // Ранний триггер, чтобы не было ощущения «пустоты»
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <Wrapper id="services" className={classes.wrapper}>
      <div
        ref={ref}
        className={clsx(classes.section, classes.reveal, isVisible && classes.isVisible)}
      >
        <div className={classes.header}>
          <Title title="Услуги" />
          <div className={classes.bl_subtitle}>
            {/* <Subtitle subtitle="Ваш стиль — наша забота: откройте красоту вместе с нами!" /> */}
            {/* <a href="services">
              <Button className={classes.button} buttonSize="medium">
                Показать все услуги
              </Button>
            </a> */}
          </div>
        </div>

        {/* Контент виден сразу, без задержек */}
        <ServicesTable services={TestDate} />
      </div>
    </Wrapper>
  );
};
