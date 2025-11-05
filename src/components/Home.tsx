import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Announcement {
  id: number;
  type: string;
  Категория: string;
  Описание: string;
  Локация: [number, number];
  created_at: string;
  user_id: number;
}

function Home() {
  const { isAuthenticated } = useAuth();
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/announcements');
      setAnnouncements(response.data.announcements);
    } catch (err) {
      setError('Ошибка при загрузке объявлений');
      setAnnouncements([
        {'id': 1, 'type': 'Пропал', 'Категория': 'Электроника', 'Описание': 'Чёрный ноутбук', 'Локация': [55.7557, 37.71174], 'created_at': '2024-01-01T10:00:00Z', 'user_id': 1},
        {'id': 2, 'type': 'Найден', 'Категория': 'Ключи', 'Описание': 'Серебряный брелок', 'Локация': [55.75566, 37.71494], 'created_at': '2024-01-02T11:00:00Z', 'user_id': 1},
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="home-bg-3d">
        <img src="/3d-campus.png" alt="3D Campus" />
      </div>
      <h1 id="ann-title" className="text-center">Последние объявления</h1>

      {error && (
        <div className="alert alert-warning text-center" role="alert">
          {error}
        </div>
      )}

      {!isAuthenticated && (
        <div className="alert alert-info text-center" role="alert">
          <strong>Войдите в систему</strong>, чтобы добавлять объявления и общаться с пользователями.
          <br />
          <Link to="/login" className="btn btn-primary mt-2">Войти</Link>
          <Link to="/register" className="btn btn-outline-primary mt-2 ms-2">Зарегистрироваться</Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="alert alert-success text-center" role="alert">
          <strong>Добро пожаловать!</strong> Вы можете <Link to="/post" className="alert-link">добавить объявление</Link> или <Link to="/profile" className="alert-link">посмотреть свой профиль</Link>.
        </div>
      )}

      <div className="row">
        {announcements.map(item => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  <span className={`badge ${item.type === 'Пропал' ? 'bg-danger' : 'bg-success'}`}>
                    {item.type.toUpperCase()}
                  </span>
                  <span className="ms-2">{item.Категория}</span>
                </h5>
                <p className="card-text flex-grow-1">{item.Описание}</p>
                <div className="mt-auto">
                  <small className="text-muted">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </small>
                  <br />
                  <Link to={`/details/${item.id}`} className="btn btn-primary btn-sm mt-2">Подробнее</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;