// import { Button } from '../../../../shared/ui/Button'
import { Title } from '../../../../shared/ui/Title/indext'
import { Wrapper } from '../../../../shared/ui/Wrapper'
// import { MapComponent } from '../map'
import classes from './contacts-section.module.scss'
import { ContactsLnks } from '../contacts-links'
// import { Link } from 'react-router-dom'
// import { useQuery } from 'react-query'
// import { IContact } from '../../model/contacts'
// import { getFetcher } from '../../../../shared/api/fetcher/getFetcher'



export const ContactsSection = () => {

    return <div id='contacts' className={classes.ContactsSection}> 
        <Wrapper>
            <div className={classes.contacts}>
                <div className={classes.left} >
                    <div className={classes.body}>
                        <div className={classes.bl_info}>
                            <Title className={classes.title} title='Контакты' />
                            <p className={classes.date} >
                                Режим работы с понедельника по пятницу 09:00 до 18:00
                            </p>
                            <ContactsLnks className={classes.items} />
                        </div>
                        {/* <Link to='/company'>
                            <Button buttonSize='medium' fullWidth>
                                Собрать подарок
                            </Button>
                        </Link> */}
                    </div>
                </div>
                {/* <div className={classes.right}>
                    <MapComponent />
                </div> */}
            </div>
        </Wrapper>
        {/* <img className={classes.bl_img} src="/assets/images/pattern_2.png" alt="price" width={1920} height={1080} /> */}
    </div>
}