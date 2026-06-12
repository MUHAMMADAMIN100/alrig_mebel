import { useParams } from 'react-router-dom'
import { Wrapper } from '../../shared/ui/Wrapper'
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { useSubcategory } from '../../shared/api/hooks'
import { ProductListing } from '../../widgets/products/listing'
import classes from './subcategory.module.scss'

export const SubcategoryPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: subcategory } = useSubcategory(slug)

  return (
    <Wrapper>
      <div className={classes.header}>
        <Breadcrumbs
          items={[
            { label: 'Главная', to: '/' },
            { label: 'Каталог', to: '/products' },
            ...(subcategory
              ? [{ label: subcategory.category.name, to: `/category/${subcategory.category.slug}` }]
              : []),
            { label: subcategory?.name ?? '…' },
          ]}
        />
        <h1 className={classes.title}>{subcategory?.name ?? 'Загрузка…'}</h1>
      </div>
      <ProductListing filter={{ subcategory: slug }} />
      <div className={classes.bottomGap} />
    </Wrapper>
  )
}
