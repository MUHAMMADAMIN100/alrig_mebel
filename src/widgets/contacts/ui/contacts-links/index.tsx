import classes from './contacts-lnks.module.scss'
// import FacebookIcon from '@icons/facebook.svg?react'
import InstagramIcon from '@icons/instagram.svg?react'
// import TelegramIcon from '@icons/telegram.svg?react'
import WhatsAppIcon from '@icons/whatsapp.svg?react'
import PhoneIcon from '@icons/phone.svg?react'
// import LocationIcon from '@icons/location_small.svg?react'
import clsx from 'clsx'
import { IContact } from '../../model/contacts'
import { extractInstagramUsername } from '../../../../shared/lib/extractInstagramUsername'
import { Link } from 'react-router-dom'
import { Button } from '../../../../shared/ui/Button'
// import { extractFacebookUsername } from '../../../../shared/lib/extractFacebookUsername'

interface Props {
    className?: string
}

const ContactsDate: IContact = {
    id: 1,
    work_schedule: 'string',
    phone: '+992988645543',
    address: 'проспект Рудаки 78',
    // facebook: 'string',
    instagram: 'https://www.instagram.com/stol.dushanbe/',
    telegram: 'https://t.me/barftelegram',
    whatsapp: 'https://wa.me/+992985829367',
}



export const ContactsLnks = ({className}:Props) => {
    const contacts: IContact = ContactsDate
    // if(!contacts) return null
    const instagramUsername = contacts.instagram ? extractInstagramUsername(contacts.instagram) : '';
    // const facebookUsername = contacts.facebook ? extractFacebookUsername(contacts.facebook) : '';

    return (
        <div className={clsx(classes.items, className)} >
            <a className={classes.item} target='_blank' href={`tel:+992975205115`} >
                <PhoneIcon className={classes.icon} />
                <p className={clsx(classes.item_text, classes.phone)} >
                    +992&nbsp;975 20 51 15
                </p>
            </a>
            {/* <a className={clsx(classes.item, classes.item_address)} target='_blank' href={contacts.address} >
                <LocationIcon className={classes.icon} />
                <p className={classes.item_text} >
                    {contacts.address}
                </p>
            </a> */}
            {/* {facebookUsername && (
                <a className={classes.item}
                href={contacts.facebook}
                target="_blank"
                rel="noopener noreferrer"
                >
                    <FacebookIcon className={classes.icon} />
                    <p className={clsx(classes.item_text, classes.facebook)}>{facebookUsername}</p>
                </a>
            )} */}
            {instagramUsername && (
                <a className={classes.item}
                    href={contacts.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {/* <img src='./assets/icons/instagram.png' className={classes.icon} /> */}
                    <InstagramIcon className={classes.icon} />
                    <p className={clsx(classes.item_text, classes.instagram)}>{instagramUsername}</p>
                </a>
            )}
            
            <a className={classes.item}
                href={contacts.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
            >
                {/* <img src='./assets/icons/instagram.png' className={classes.icon} /> */}
                <WhatsAppIcon className={classes.icon} />
                <p className={clsx(classes.item_text, classes.instagram)}>+992&nbsp;985-82-93-67</p>
            </a>
             <Link to='/products'>
                <Button buttonSize='medium' fullWidth>
                    Заказать стол
                </Button>
            </Link>
        </div>
    )
}