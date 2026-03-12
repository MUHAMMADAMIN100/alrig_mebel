// import { Button } from "../../../../shared/ui/Button"
import { Title } from "../../../../shared/ui/Title/indext"
import { Wrapper } from "../../../../shared/ui/Wrapper"
import classes from './understanding.module.scss'
// import { ServicesTable } from "../ServicesTable"
// import { Subtitle } from "../../../../shared/ui/Subtitle/indext"
// import { IService } from "../../model/services"
import { Subtitle } from "../../../../shared/ui/Subtitle/indext"


const TestDate = [
    {
        id: 1,
        name: 'Этичный подход',
        image: '/assets/images/understanding_1.png'
    },
    {
        id: 2,
        name: 'Индивидуальная программа',
        image: '/assets/images/understanding_2.png'
    },
    {
        id: 3,
        name: 'Доказательная база',
        image: '/assets/images/understanding_3.png'
    },
]

export const Understanding = () => {
    
    return <div className={classes.wrapper_main} > 
        <Wrapper className={classes.wrapper} >
            <div className={classes.section} >
                <div className={classes.header} >
                    <div>
                        <Title title="Понимаем вашу ситуацию" />
                        <Subtitle className={classes.subtitle} subtitle="Родителям бывает сложно понять, что именно мешает ребёнку. Мы мягко выявляем причины и выстраиваем индивидуальный план, который работает." />
                    </div>
                    {/* <div>
                        <Button buttonSize="medium" >
                            Узнать больше
                        </Button>
                    </div> */}
                </div>
                <div className={classes.items_main}>
                    <div className={classes.items}>
                    {TestDate.map(item => <div key={item.id} className={classes.item}>
                        <div className={classes.item_content}> 
                            <div className={classes.text_content} >
                                <h3 className={classes.item_title} >{item.name}</h3>
                            </div>
                        </div>
                        <img src={item.image} width={150} height={150} alt="asd" />
                    </div>
                    )}
                </div>
                </div>
            </div>
        </Wrapper>
    </div>
}
