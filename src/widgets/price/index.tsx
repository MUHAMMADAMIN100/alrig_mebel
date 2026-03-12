import { Link } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import { Wrapper } from "../../shared/ui/Wrapper";
import classes from "./price.module.scss";

export const Price = () => {
  return (
    <div className={classes.wrapper}>
      <Wrapper>
        <div className={classes.about}>
          <div className={classes.certificate}>
            <div className={classes.ribbon}>Loft мебель</div>

            <div className={classes.inner}>
              <p className={classes.label}>Alrig</p>

              <h2 className={classes.title}>
                Столы и табуретки в стиле Loft
              </h2>

              <p className={classes.subtitle}>
                Прочная мебель из металла и ЛДСП. Подходит для дома, офиса и заведений.
                У всех моделей есть регулировка ножек.
              </p>

              <div className={classes.priceBlock}>
                <span className={classes.priceLabel}>Цены от</span>
                <span className={classes.priceValue}>1 200</span>
                <span className={classes.priceCurrency}>сомони</span>
              </div>

              <p className={classes.note}>
                Доступна рассрочка через карту Salom и доставка по Душанбе.
              </p>

              <div className={classes.button_body}>
                <Link to="/catalog" className={classes.link_button}>
                  <Button buttonSize="medium" variant="contained">
                    Посмотреть каталог
                  </Button>
                </Link>
              </div>
            </div>

            <div className={classes.footerDecor}>
              <span>Собственное производство</span>
              <span className={classes.separator}>•</span>
              <span>Ограниченные партии</span>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};
