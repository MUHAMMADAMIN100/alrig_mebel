import { Wrapper } from "../../../../shared/ui/Wrapper";
import { navDate } from "../../const/navDate";
import { Burger } from "../Burger";
import { Navigation } from "../Navigation";
import classes from './header.module.scss';
import Logo from '@icons/logo.svg?react';
import { Button } from "../../../../shared/ui/Button";
import { Link } from "react-router-dom";

export const Header = () => {

    return (
        <div className={classes.main_header} >
        <Wrapper id="header" >
            <div className={classes.body}>
                <div className={classes.header}>
                    <a href="/" className={classes.bl_logo}>
                        <Logo width={120} height={40} />
                        {/* <img src="./assets/icons/barf-horizontak.svg" className={classes.logo} width={100} height={50} /> */}
                    </a>
                    <div className={classes.nav}>
                        <ul className={classes.items}>
                            {navDate.map((item) => (
                                <li key={item.id} className={classes.item}>
                                    <a className={classes.link}
                                        href={item.link} >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link className={classes.link_small} to="/products">
                        <Button 
                            className={classes.button} 
                            buttonSize='small'
                            // onClick={(event) => { event.preventDefault(); (window as any).openSabtModal && (window as any).openSabtModal(); }}
                            >
                            Заказать
                        </Button>
                    </Link>
                    <Burger />
                </div>
                <Navigation />
            </div>
        </Wrapper>
    </div>
    );
};