import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function Profile() {
  const { user, logout } = useAuth();
  const [userAnnouncements, setUserAnnouncements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetchUserAnnouncements();
  }, []);

  const fetchUserAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/announcements');
      const userAds = response.data.announcements.filter((announcement: any) => announcement.user_id === user?.id);
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
      <div className="d-flex justify-content-center align-items-center" style={{height: '200px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Профиль пользователя</h1>

      {/* Информация о пользователе */}
      <div className="card mb-4" style={{maxWidth: '500px', margin: '0 auto'}}>
        <div className="card-body">
          <h5 className="card-title">Информация о профиле</h5>
          <div className="mb-2"><strong>Имя пользователя:</strong> {user?.username}</div>
          <div className="mb-2"><strong>Email:</strong> {user?.email}</div>
          <div className="mb-2"><strong>Роль:</strong> {user?.role}</div>
        </div>
      </div>

      {/* Мои объявления */}
      <div className="mb-4">
        <h3>Мои объявления</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {userAnnouncements.length === 0 ? (
          <div className="alert alert-info">
            У вас пока нет объявлений. <a href="/post">Создать первое объявление</a>
          </div>
        ) : (
          <div className="row">
            {userAnnouncements.map((announcement: any) => (
              <div key={announcement.id} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">
                      <span className="badge bg-primary">{announcement.type}</span>
                      {announcement.Категория}
                    </h6>
                    <p className="card-text">{announcement.Описание}</p>
                    <small className="text-muted">
                      Создано: {new Date(announcement.created_at).toLocaleDateString('ru-RU')}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Настройки конфиденциальности */}
      <div className="card" style={{maxWidth: '500px', margin: '0 auto'}}>
        <div className="card-body">
          <h5 className="card-title">Настройки конфиденциальности</h5>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="photoIndexing" />
            <label className="form-check-label" htmlFor="photoIndexing">
              Включить индексацию фото
            </label>
          </div>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="dataProcessing" defaultChecked />
            <label className="form-check-label" htmlFor="dataProcessing">
              Согласие на обработку данных
            </label>
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-warning"
              onClick={() => alert('Настройки сохранены')}
            >
              Сохранить настройки
            </button>

            <button
              className="btn btn-danger"
              onClick={handleDeleteAccount}
            >
              Удалить аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;