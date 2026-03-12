import { Map, YMaps, Placemark } from "@pbe/react-yandex-maps";
import classes from './map.module.scss'
import clsx from "clsx";


export const MapComponent = () => {
  const iconUrl = '/assets/icons/location.svg';
  
  return (
    <YMaps>
      <div style={{ width: '100%', height: '100%' }}>
        <Map className={clsx(classes.map)} defaultState={{ center: [38.586216, 68.787027], zoom: 17 }}>
          <Placemark
            geometry={[38.586216, 68.787027]}
            options={{
              iconLayout: 'default#image',
              iconImageHref: iconUrl,
              iconImageSize: [30, 42],
              iconImageOffset: [-32, -76 / 2], // Отрегулируйте смещение при необходимости
            }}
          />
        </Map>
      </div>
    </YMaps>
  );
};
