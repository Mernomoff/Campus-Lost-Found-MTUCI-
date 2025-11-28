import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Announcement {
  id: number;
  type: string;
  category: string;
  description: string;
  location: [number, number];
  created_at: string;
  user_id: number;
}

function Map() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:8002/api/announcements');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || 'Request failed');
        }
        setAnnouncements(data.announcements || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setAnnouncements([
          {'id': 1, 'type': 'Пропал', 'category': 'Электроника', 'description': 'Чёрный ноутбук', 'location': [55.7557, 37.71174], 'created_at': '2024-01-01T10:00:00Z', 'user_id': 1},
          {'id': 2, 'type': 'Найден', 'category': 'Ключи', 'description': 'Серебряный брелок', 'location': [55.75566, 37.71494], 'created_at': '2024-01-02T11:00:00Z', 'user_id': 1},
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);
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
          {announcements?.map(item => {
            const loc = item.location;
            if (!loc || !Array.isArray(loc) || loc.length < 2) return null;
            const lat = Number(loc[0]);
            const lng = Number(loc[1]);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
            return (
              <Marker key={item.id} position={[lat, lng]}>
                <Popup>
                  <div>
                    <strong>{item.type}: {item.description}</strong>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;