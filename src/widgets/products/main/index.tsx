import { Button } from '../../../shared/ui/Button'
import { Title } from '../../../shared/ui/Title/indext'
import { Wrapper } from '../../../shared/ui/Wrapper'
import { ProductItems } from '../product-items'
import classes from './main.module.scss'

export const Products = () => {
    return (
        <Wrapper className={classes.wrapper}>
            <div className={classes.header}>
                <Title title='Столы'  />
                <a href='/custom-order'>
                    <Button
                        buttonSize='small'
                        variant='outlined'
                    >
                        Индивидуальный заказать
                    </Button>
                </a>
            </div>
            <ProductItems />
        </Wrapper>
    )
}
