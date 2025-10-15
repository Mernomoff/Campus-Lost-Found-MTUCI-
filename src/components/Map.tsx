import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Announcement {
  id: number;
  type: string;
  Категория: string;
  Описание: string;
  Локация: [number, number];
}

const announcements: Announcement[] = [
  {'id': 1, 'type': 'Пропал', 'Категория': 'Электроника', 'Описание': 'Чёрный ноутбук', 'Локация': [55.7557, 37.71174]},
  {'id': 2, 'type': 'Найден', 'Категория': 'Ключи', 'Описание': 'Серебряный брелок', 'Локация': [55.75566, 37.71494]},
];

function Map() {
  const campusPolygon: [number, number][] = [
    [55.75537, 37.71102],
    [55.75591, 37.71171],
    [55.75591, 37.71356],
    [55.7563, 37.71356],
    [55.75629, 37.71476],
    [55.75591, 37.71476],
    [55.75592, 37.71584],
    [55.75448, 37.71573],
    [55.75457, 37.7146],
    [55.75413, 37.71373],
    [55.75381, 37.71206]
  ];

  return (
    <div>
      <h1 className="center-title">Карта МТУСИ</h1>
      <div id="map" style={{width: '100%', maxWidth: '1400px', height: '750px', margin: '0 auto', borderRadius: '20px', overflow: 'hidden'}}>
        <MapContainer center={[55.75508, 37.71376]} zoom={17} style={{height: '100%', width: '100%'}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon
            positions={campusPolygon}
            pathOptions={{
              color: '#6366f1',
              weight: 5,
              fillColor: '#6366f1',
              fillOpacity: 0.1
            }}
          >
            <Popup>Кампус МТУСИ</Popup>
          </Polygon>
          {announcements.map(item => (
            <Marker key={item.id} position={item.Локация}>
              <Popup>
                <div>
                  <strong>{item.type}: {item.Описание}</strong>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;