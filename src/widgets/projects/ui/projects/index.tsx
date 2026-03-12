import { useState } from 'react'
import Tabs from '../../../../shared/ui/Tabs/Tabs'
import { Title } from '../../../../shared/ui/Title/indext'
import { Wrapper } from '../../../../shared/ui/Wrapper'
import classes from './projects.module.scss'
import { useQuery } from 'react-query'
import { ICategory } from '../../../services/model/services'
import { getFetcher } from '../../../../shared/api/fetcher/getFetcher'
import { IProjectImage } from '../../model/project'
import { ProjectItem } from '../project-item'
import clsx from 'clsx'

export const Projects = () => {
    const [activeId, setActiveId] = useState<number>(0)

    const { data } = useQuery<{data: ICategory[]}>('categories', () => getFetcher('/categories'))

    const { data: images } = useQuery<{data: IProjectImage[]}>(['job-photos', activeId], () => getFetcher(`/job-photos`+ (activeId ? `?category=${activeId}` : '')))
    
    return <div className={classes.projects}>
        <Wrapper>
            <Title className={classes.title} title='Наши работы' />
            <Tabs 
                className={classes.tabs}
                headers={[{id: 0, title:'Все'}, ...(data?.data.map((item) => ({id: item.id, title: item.name})) || [])]}
                activeId={activeId}
                selectTab={(id) => {
                    setActiveId(id)
                }}
            >
                {images && <div 
                    className={clsx(classes.items, 
                        images.data.length <= 2 && classes.items_one
                        )} >
                    {images.data.map((item, index) => 
                        <ProjectItem project={item} key={index} className={classes.card} />
                )}
                </div>}
            </Tabs>
        </Wrapper>
    </div>
}