import React from 'react';
import { Link } from 'react-router-dom';

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

function Home() {
  return (
    <div>
      <div className="home-bg-3d">
        <img src="/3d-campus.png" alt="3D Campus" />
      </div>
      <h1 id="ann-title" className="text-center">Последние объявления</h1>
      <div className="row">
        {announcements.map(item => (
          <div key={item.id} className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <span className="ann-type">{item.type.toUpperCase()}</span>: <span className="ann-category">{item.Категория}</span>
                </h5>
                <p className="card-text ann-desc">{item.Описание}</p>
                <Link to={`/details/${item.id}`} className="btn btn-primary ann-details">Подробнее</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;