import { Title } from '../../../shared/ui/Title/indext'
import { Wrapper } from '../../../shared/ui/Wrapper'
import { PriceConstructor } from '../../constructor/ui/price'
import classes from './main.module.scss'

export const Company = () => {
    return (
        <Wrapper className={classes.wrapper}>
            <Title title='Индивидуальный заказ'  />
            <PriceConstructor />
        </Wrapper>
    )
}
