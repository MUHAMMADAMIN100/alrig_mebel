import { Map, YMaps, Placemark } from "@pbe/react-yandex-maps";
import { CONTACTS } from "../../../../shared/const/contacts";
import classes from './map.module.scss'

export const MapComponent = () => {
  const iconUrl = '/assets/icons/location.svg';

  return (
    <YMaps>
      <div className={classes.wrapper}>
        <Map
          className={classes.map}
          defaultState={{ center: [...CONTACTS.mapCenter], zoom: CONTACTS.mapZoom }}
        >
          <Placemark
            geometry={[...CONTACTS.mapCenter]}
            options={{
              iconLayout: 'default#image',
              iconImageHref: iconUrl,
              iconImageSize: [30, 42],
              iconImageOffset: [-15, -42],
            }}
          />
        </Map>
      </div>
    </YMaps>
  );
};
