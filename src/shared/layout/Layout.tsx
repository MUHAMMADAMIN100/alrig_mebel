import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "../../widgets/header/ui/Header";
import { Footer } from "../../widgets/footer";
import classes from "./layout.module.scss";


const Layout = () => {
  const location = useLocation();

  // Скролл к верху при переходе по страницам
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

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
