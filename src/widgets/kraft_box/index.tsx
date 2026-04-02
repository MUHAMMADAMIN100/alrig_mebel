import classes from "./kraft_box.module.scss";
import { Wrapper } from "../../shared/ui/Wrapper";

const categories = [
  {
    src: "/assets/products/washing machine/washing machine 6kg.png",
    name: "Стиральные машины",
  },
  {
    src: "/assets/products/microvawe/microwawe black.png",
    name: "Микроволновые печи",
  },
  {
    src: "/assets/products/kholodilnik/kholodilnik.png",
    name: "Холодильники",
  },
  {
    src: "/assets/products/dukhovka/dukhovka black.png",
    name: "Духовки",
  },
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
