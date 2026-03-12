import { IService } from "../../model/services";
import classes from './mobile-table.module.scss';
// import Time from '@icons/time.svg?react';
// import Eyes from '@icons/eyes.svg?react';
// import EyesNo from '@icons/eye-no.svg?react';
import { Button } from "../../../../shared/ui/Button";
import RightIcon from '@icons/right.svg?react'

interface Props {
    services: IService[];
}


export const MobileTable = ({services}: Props) => {
    return <div className={classes.items} >
    {services.map((service) => (
      <div key={service.id} className={classes.item} >
        <div className={classes.left}>
            <div className={classes.title} >
            {service.name}
            </div>
            <div className={classes.item_medium} >
                {/* {service.individual_room ? <div className={classes.item_icon}>
                  <Eyes />  Индивидуальная комната
                </div> : <div className={classes.item_icon}>
                  <EyesNo />  Общая комната
                </div>} */}
                {/* <div className={classes.item_icon} >
                    <Time /> {service.duration}
                </div> */}
            </div>
            <div className={classes.price} >
                {service.price} сомони
            </div>
        </div>
        <div className={classes.right} >
            <Button className={classes.button} fullWidth buttonSize="large" >
                <RightIcon width={24} height={24} />
            </Button>
        </div>
      </div>
    ))}
  </div>
}