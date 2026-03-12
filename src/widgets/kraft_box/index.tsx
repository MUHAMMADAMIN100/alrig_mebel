import classes from "./kraft_box.module.scss";
import { Wrapper } from "../../shared/ui/Wrapper";

const categories = [
  {
    src: "/assets/products/l/1.webp",
    name: "Рабочий стол",
  },
  {
    src: "/assets/products/r/1.webp",
    name: "Круглые столы",
  },
  {
    src: "/assets/products/t/1.webp",
    name: "Табуретки",
  },
  {
    src: "/assets/products/k/4.webp",
    name: "Для дома",
  }
];

export const KraftBox = () => {
  return (
    <Wrapper className={classes.section}>
      <div className={classes.grid}>
        {categories.map((item, i) => (
          <div key={i} className={classes.card}>
            <img
              src={item.src}
              alt={item.name}
              loading="lazy"
            />
            <div className={classes.label}>
              <span>{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
