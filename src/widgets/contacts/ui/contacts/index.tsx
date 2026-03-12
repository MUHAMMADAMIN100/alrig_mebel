import { Title } from '../../../../shared/ui/Title/indext'
import { Wrapper } from '../../../../shared/ui/Wrapper'
// import { MapComponent } from '../map'
import classes from './contacts.module.scss'
import { ContactsLnks } from '../contacts-links'
// import { useQuery } from 'react-query'
// import { IContact } from '../../model/contacts'
// import { getFetcher } from '../../../../shared/api/fetcher/getFetcher'

export const Contacts = () => {
    // const { data } = useQuery<IContact>('contact', () => getFetcher('contact'))

    return <Wrapper>
        <div className={classes.contacts}>
            <div className={classes.header} >
                <Title className={classes.title} title='Контакты' />
                <p className={classes.date} >
                    С понедельника по пятницу с 9:00 до 18:00
                </p>
            </div>
           <div className={classes.content} > 
                <div className={classes.left} >
                    <div className={classes.body}>
                        <div className={classes.bl_info}>
                            <ContactsLnks  className={classes.items} />
                        </div>
                    </div>
                </div>
                {/* <div className={classes.right}>
                    <MapComponent  />
                </div> */}
            </div>
        </div>
    </Wrapper>
}