import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import { CONTACTS } from '../../../../shared/const/contacts'
import classes from './map.module.scss'

export const MapComponent = () => {
  return (
    <YMaps>
      <div className={classes.wrapper}>
        <Map
          className={classes.map}
          defaultState={{
            center: [...CONTACTS.mapCenter],
            zoom: CONTACTS.mapZoom,
            controls: [], // без лишних контролов
          }}
          options={{ suppressMapOpenBlock: true }}
        >
          <Placemark
            geometry={[...CONTACTS.mapCenter]}
            properties={{
              iconCaption: 'ALRIG',
              hintContent: 'ALRIG',
              balloonContent: CONTACTS.address,
            }}
            options={{ preset: 'islands#redIcon' }}
          />
        </Map>
      </div>
    </YMaps>
  )
}
