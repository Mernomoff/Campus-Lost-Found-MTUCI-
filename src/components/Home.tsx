import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Announcement {
  id: number;
  type: string;
  category: string;
  description: string;
  location: [number, number];
  image_path?: string;
  processed_image_path?: string;
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
      console.log('Announcements data:', response.data.announcements); // Для отладки
      setAnnouncements(response.data.announcements);
    } catch (err) {
      setError('Ошибка при загрузке объявлений');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5">Последние объявления</h2>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!isAuthenticated && (
        <div className="alert alert-info text-center mb-4">
          Войдите в систему, чтобы добавлять объявления и общаться с пользователями.
          <br />
          <Link to="/login" className="btn btn-primary btn-sm mt-2 me-2">
            Войти
          </Link>
          <Link to="/register" className="btn btn-success btn-sm mt-2">
            Зарегистрироваться
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="alert alert-success text-center mb-4">
          Добро пожаловать! Вы можете добавить объявление или посмотреть свой профиль.
        </div>
      )}

      <div className="row">
        {announcements.map(item => {
          // Получаем изображение - может быть либо processed_image_path, либо image_path
          const imagePath = item.processed_image_path || item.image_path;
          const imageUrl = imagePath ? `http://localhost:8002/static/${imagePath}` : null;
          
          return (
            <div key={item.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card announcement-card h-100">
                {/* Изображение */}
                {imageUrl ? (
                  <div className="announcement-image-container">
                    <img
                      src={imageUrl}
                      alt={item.category}
                      className="card-img-top announcement-image"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="announcement-image-container" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(0, 242, 254, 0.2))' }}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <span style={{ color: '#a0aec0', fontSize: '2rem' }}>📷</span>
                    </div>
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  {/* Тип объявления */}
                  <span className={`badge ${item.type === 'Найдено' ? 'bg-success' : 'bg-danger'} mb-3 align-self-start`}>
                    {item.type.toUpperCase()}
                  </span>

                  {/* Категория */}
                  <h5 className="card-title announcement-title">{item.category}</h5>

                  {/* Описание - БЕЛЫЙ ТЕКСТ */}
                  <p className="card-text announcement-description text-white">
                    {item.description}
                  </p>

                  {/* Дата */}
                  <p className="card-text text-muted small mt-auto mb-3">
                    📅 {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </p>

                  {/* Кнопка */}
                  <Link to={`/details/${item.id}`} className="btn btn-primary btn-sm w-100">
                    Подробнее →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {announcements.length === 0 && !loading && (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Объявлений не найдено. Будьте первым!</p>
        </div>
      )}
    </div>
  );
}

export default Home;
