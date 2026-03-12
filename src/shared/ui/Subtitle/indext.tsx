import clsx from 'clsx'
import classes from './subtitle.module.scss'

interface Props {
    className?: string
    subtitle: string
}
export const Subtitle = ({className, subtitle}: Props) => {
    return <h3 className={clsx(classes.subtitle, className)} >{subtitle}</h3>
}