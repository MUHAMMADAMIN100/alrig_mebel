import { Wrapper } from '../../shared/ui/Wrapper'
import { navDate } from '../header/const/navDate'
import classes from './footer.module.scss'
// import Logo from '@icons/logo.svg?react'
// import Facebook from '@icons/facebook.svg?react'
// import Instagram from '@icons/instagram.svg?react'
import clsx from 'clsx'
// import { useQuery } from 'react-query'
// import { IContact } from '../contacts/model/contacts'
// import { getFetcher } from '../../shared/api/fetcher/getFetcher'
import Logo from '@icons/logo.svg?react';
import InstagramSvg from '@icons/instagram.svg?react'
import TelegramIcon from '@icons/telegram.svg?react'
import WhatsAppIcon from '@icons/whatsapp.svg?react'
export const Footer = () => {
    // const { data } = useQuery<IContact>('contact-footer', () => getFetcher('contact'))

    return <div className={classes.wrapper} >
        <Wrapper >
            <div className={classes.footer} >
                <div className={classes.footer_top}>
                    <div className={classes.bl_logo} >
                        <a href='/' >
                            {/* <Logo width={120} height={40} /> */}
                            <img
                                src='./assets/icons/alrig_logoo.png'
                                className={classes.logo}
                                width={200} height={100}
                            />
                        </a>
                        <div className={clsx(classes.socials, classes.socials_mobile)} >
                            {/* <a href='/asd' className={classes.link} target='_blank' >
                                <Facebook className={classes.icon} />
                            </a> */}
                            <a href='https://www.instagram.com/barf.dushanbe/' className={classes.link} target='_blank' >
                                <InstagramSvg className={classes.icon} />
                            </a>
                            <a href={'https://t.me/barftelegram'} className={classes.link} target='_blank' >
                                <TelegramIcon className={classes.icon} />
                            </a>
                            <a href={'https://wa.me/+992985829367'} className={classes.link} target='_blank' >
                                <WhatsAppIcon className={classes.icon} />
                            </a>
                        </div>
                    </div>
                    <div className={classes.nav} >
                        {/* <p className={classes.nav_title} >
                            Навигация
                        </p> */}
                        <div className={classes.nav_items} >
                            {navDate.map((item, index) => <a className={classes.nav_link} href={item.link} key={index} >{item.name}</a>)}
                        </div>
                    </div>
                    <div className={classes.socials} >
                        {/* <a href={data?.facebook} className={classes.link} target='_blank' >
                            <Facebook className={classes.icon} />
                        </a> */}
                        <a href={'https://www.instagram.com/barf.dushanbe/'} className={classes.link} target='_blank' >
                            <InstagramSvg className={classes.icon} />
                        </a>
                        <a href={'https://t.me/barftelegram'} className={classes.link} target='_blank' >
                            <TelegramIcon className={classes.icon} />
                        </a>
                        <a href={'https://wa.me/+992985829367'} className={classes.link} target='_blank' >
                            <WhatsAppIcon className={classes.icon} />
                        </a>
                    </div>
                </div>
                <div className={classes.footer_bottom} >
                    <p className={classes.bottom_text} >
                        © Alrig, 2025. Разработано в <a className={classes.bottom_link} href='https://www.webrand.tj/' target='_blank' >
                            {/* <WeBrandSvg className={classes.webrand_icon} /> */}
                            WeBrand
                        </a>
                    </p>
                </div>
            </div>
        </Wrapper>
    </div>
}