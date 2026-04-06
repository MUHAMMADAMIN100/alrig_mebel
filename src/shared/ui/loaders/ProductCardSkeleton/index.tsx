import { HTMLAttributes } from 'react'
import clsx from 'clsx'
import classes from './product-card-skeleton.module.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function ProductCardSkeleton({ className }: Props) {
  return (
    <div className={clsx(classes.card, className)}>
      <div className={classes.imageWrap}>
        <div className={clsx(classes.skeleton, classes.image)} />
      </div>
      <div className={classes.body}>
        <div className={classes.top}>
          <div className={clsx(classes.skeleton, classes.title)} />
          <div className={clsx(classes.skeleton, classes.text)} />
        </div>
        <div className={classes.bottom}>
          <div className={classes.price}>
            <div className={clsx(classes.skeleton, classes.priceValue)} />
            <div className={clsx(classes.skeleton, classes.priceCurrency)} />
          </div>
          <div className={clsx(classes.skeleton, classes.more)} />
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeletonGrid({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={clsx(classes.grid, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
