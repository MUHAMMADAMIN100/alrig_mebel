import { useState } from 'react'
import classes from './project-item.module.scss'
import { IProjectImage } from '../../model/project'
import GalleryModal from '../../../../shared/ui/GalleryModal'
import clsx from 'clsx'

interface Props {
    project: IProjectImage
    className?: string
}

export const ProjectItem = ({project, className}:Props) => {
    const [open, setOpen] = useState(false)

    return <div className={clsx(classes.card, className)} onClick={() => setOpen(!open)} >
    <img className={classes.card_image}
        src={project.image} 
        alt='portfolio'
    />
    <GalleryModal picture={project} close={() => setOpen(!open)} open={open} />
</div>
}