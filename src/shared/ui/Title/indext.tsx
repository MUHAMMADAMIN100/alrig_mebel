import clsx from 'clsx'
import classes from './title.module.scss'

interface Props {
    className?: string
    title: string
}
export const Title = ({className, title}: Props) => {
    return <h2 className={clsx(classes.title, className)} >{title}</h2>
}