import { ServicesTable } from "../ServicesTable"
import classes from './services-item.module.scss'
import { ICategory } from "../../model/services"
import { useState } from "react"
import clsx from "clsx"
import ShowIcon from '@icons/show.svg?react'


interface Props {
    index: number
    category: ICategory
}

export const ServicesItem = ({ index, category}:Props) => {
    const [isActive, setIsActive] = useState<boolean>(true)

    return  <div className={classes.item} >
            <div className={clsx(classes.item_header, isActive && category.services.length > 0 && classes.header_active)} 
                onClick={() => setIsActive(!isActive)} >
                <div className={classes.left}>
                    <div className={classes.index}>
                        <p>
                            {index+1}
                        </p>
                    </div>
                    <h3 className={classes.item_title}>
                        {category.name}
                    </h3>
                </div>
                {category.services.length > 0 && <ShowIcon className={clsx(classes.show, isActive && classes.show_active)} width={24} height={24} />}
            </div>
            <div className={clsx( classes.table, isActive && classes.active)}>
                <ServicesTable services={category.services}  />
            </div>
    </div>
}