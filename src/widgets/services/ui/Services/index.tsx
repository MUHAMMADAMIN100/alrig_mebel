import { useQuery } from "react-query"
import { getFetcher } from "../../../../shared/api/fetcher/getFetcher"
import { Title } from "../../../../shared/ui/Title/indext"
import { Wrapper } from "../../../../shared/ui/Wrapper"
import classes from './services.module.scss'
import { ICategory } from "../../model/services"
import { ServicesItem } from "../ServicesItem"

export const Services = () => {
    const { data } = useQuery<{data: ICategory[]}>('categories', () => getFetcher('/categories'))
    
    return <Wrapper className={classes.wrapper}>
        <div className={classes.services}>
            <Title className={classes.title} title='Наши услуги' />
            <div className={classes.items} >
                {data?.data.map((item, index) => <ServicesItem category={item} index={index} />
            )}
            </div>
        </div>
    </Wrapper>
}