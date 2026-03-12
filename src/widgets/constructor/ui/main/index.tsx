// import { NewsSection } from "@widgets/news"
import classes from './main.module.scss'
// import { Breadcrumbs } from "@shared/ui/Breadcrumbs"
// import { Wrapper } from "@shared/ui/Wrapper"
// import { IProjectCard } from "@widgets/projects/model/IProjectCard"
// import { INews } from "@widgets/news/model/News"
// import useTranslation from "next-translate/useTranslation"
import { Price } from '../../../price'
import { PageHeader } from '../../../../shared/ui/PageHeader'
// import { Price } from "../price"

export const Constructor = () => {

    return <PageHeader 
    className={classes.section}
    name={'Конструктор сайта'}
    mainTitle
    lastSection
    // breadcrumbs={ 
    //     <Breadcrumbs
    //     className={classes.breadcrumbs}
    //     items={[
    //         {label: 'Конструктор сайта', isActive: true}
    //     ]}
    //     includeHome
    //     /> }
    >
        <Price />
    </PageHeader>
}