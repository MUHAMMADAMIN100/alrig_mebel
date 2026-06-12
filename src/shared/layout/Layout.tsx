import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "../../widgets/header/ui/Header";
import { Footer } from "../../widgets/footer";
import classes from "./layout.module.scss";


const Layout = () => {
  const location = useLocation();

  // Скролл при навигации: якорь (#contacts) — плавно к секции, иначе — к верху
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // ждём отрисовку страницы (данные/анимации), затем скроллим
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => clearTimeout(timer);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

  return (
    <div className={classes.main}>
      <Header />
      <div className={classes.content}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
