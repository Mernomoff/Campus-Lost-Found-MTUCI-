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
      const response = await axios.get('http://127.0.0.1:8002/api/announcements');
      console.log('Announcements data:', response.data.announcements);
      setAnnouncements(response.data.announcements);
    } catch (err) {
      console.error('Error loading announcements:', err);
      setError('Ошибка при загрузке объявлений');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Последние объявления</h1>
        <p className="page-subtitle">Найдено: {announcements.length}</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!isAuthenticated && (
        <div className="alert alert-info mb-4">
          Войдите в систему, чтобы добавлять объявления и общаться с пользователями.
          <div className="mt-3 d-flex gap-2">
            <Link to="/login" className="btn btn-primary btn-sm">
              Войти
            </Link>
            <Link to="/register" className="btn btn-outline-primary btn-sm">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="alert alert-success mb-4">
          Добро пожаловать! Вы можете добавить объявление или посмотреть свой профиль.
        </div>
      )}

      <div className="row">
        {announcements.map(item => {
          // Получаем изображение
          const imagePath = item.processed_image_path || item.image_path;
          const imageUrl = imagePath ? `http://127.0.0.1:8002/static/${imagePath}` : null;

          return (
            <div key={item.id} className="col-12 col-md-6 mb-4">
              <div className="card announcement-card">
                {/* Изображение */}
                {imageUrl ? (
                  <img 
                    src={imageUrl}
                    alt={item.category}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div 
                    className="card-img-top"
                    style={{ 
                      height: '200px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}
                  >
                    📦
                  </div>
                )}

                <div className="card-body">
                  {/* Badge */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className={`badge ${item.type === 'Пропал' ? 'badge-lost' : 'badge-found'}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="announcement-category">
                      {item.category}
                    </span>
                  </div>

                  {/* Описание */}
                  <p className="announcement-description">
                    {item.description}
                  </p>

                  {/* Дата и кнопка */}
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="announcement-date">
                      📅 {new Date(item.created_at).toLocaleDateString('ru-RU')}
                    </small>
                    <Link 
                      to={`/announcement/${item.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Подробнее →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {announcements.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p className="empty-state-title">Объявлений не найдено. Будьте первым!</p>
          {isAuthenticated && (
            <Link to="/post" className="btn btn-primary mt-3">
              ➕ Добавить объявление
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
