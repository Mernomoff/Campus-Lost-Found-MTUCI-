import React from 'react';
import { Link, useParams } from 'react-router-dom';

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

function Details() {
  const { id } = useParams<{ id: string }>();
  const item = announcements.find(a => a.id === parseInt(id || '0'));

  if (!item) {
    return <div><h1>Объявление не найдено</h1></div>;
  }

  return (
    <div>
      <h1 style={{marginBottom: '30px'}}>Детали объявления</h1>
      <div className="card" style={{maxWidth: '500px', margin: '0 auto', boxShadow: '0 0 30px #2228', borderRadius: '20px'}}>
        <div className="card-body">
          <h4 className="card-title" style={{marginBottom: '20px'}}>{item.type.toUpperCase()}</h4>
          <div className="mb-3"><strong>Категория:</strong> {item.Категория}</div>
          <div className="mb-3"><strong>Описание:</strong> {item.Описание}</div>
          <div className="mb-3"><strong>Местоположение:</strong> {item.Локация.join(', ')}</div>
          <Link to={`/chat/${item.id}`} className="btn btn-primary">Начать чат</Link>
        </div>
      </div>
    </div>
  );
}

export default Details;