import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Announcement {
  id: number;
  type: string;
  category: string;
  description: string;
  location: [number, number];
  created_at: string;
  user_id: number;
}

function Profile() {
  const { user, logout } = useAuth();
  const [userAnnouncements, setUserAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetchUserAnnouncements();
  }, []);

  const fetchUserAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/announcements');
      const userAds = response.data.announcements.filter(
        (announcement: any) => announcement.user_id === user?.id
      );
      setUserAnnouncements(userAds);
    } catch (err) {
      setError('Ошибка при загрузке объявлений');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить. Все ваши объявления также будут удалены.')) {
      return;
    }
    
    try {
      await axios.delete('http://localhost:8002/api/auth/profile');
      logout();
      alert('Аккаунт успешно удален');
      window.location.href = '/';
    } catch (err: any) {
      alert('Ошибка при удалении аккаунта: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
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
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Профиль</h5>
              <p className="card-text"><strong>Имя:</strong> {user?.username}</p>
              <p className="card-text"><strong>Email:</strong> {user?.email}</p>
              <p className="card-text"><strong>Роль:</strong> {user?.role}</p>
              <button onClick={logout} className="btn btn-secondary w-100 mb-2">
                Выйти
              </button>
              <button onClick={handleDeleteAccount} className="btn btn-danger w-100">
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <h3>Мои объявления</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          
          {userAnnouncements.length === 0 ? (
            <p className="text-muted">У вас пока нет объявлений</p>
          ) : (
            <div className="row">
              {userAnnouncements.map(announcement => (
                <div key={announcement.id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <span className={`badge ${announcement.type === 'найдено' ? 'bg-success' : 'bg-danger'} mb-2`}>
                        {announcement.type.toUpperCase()}
                      </span>
                      <h5 className="card-title">{announcement.category}</h5>
                      <p className="card-text">{announcement.description}</p>
                      <p className="text-muted small">
                        Создано: {new Date(announcement.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
