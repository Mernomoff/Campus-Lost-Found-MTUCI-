import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

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

function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [userAnnouncements, setUserAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUserAnnouncements();
  }, []);

  const fetchUserAnnouncements = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Используем эндпоинт /announcements/my
      const response = await axios.get('http://127.0.0.1:8002/api/announcements/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('User announcements:', response.data);
      setUserAnnouncements(response.data);
    } catch (err: any) {
      console.error('Error loading user announcements:', err);
      setError('Ошибка при загрузке объявлений');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8002/api/announcements/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Объявление успешно удалено');
      // Обновляем список
      setUserAnnouncements(prev => prev.filter(ann => ann.id !== id));
    } catch (err: any) {
      alert('Ошибка при удалении объявления: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('⚠️ ВЫ УВЕРЕНЫ?\n\nЭто действие НЕЛЬЗЯ отменить!\n\n- Ваш аккаунт будет удалён навсегда\n- Все ваши объявления будут удалены\n- Все ваши сообщения будут удалены\n\nВы точно хотите продолжить?')) {
      return;
    }

    // Двойное подтверждение
    const confirmation = window.prompt('Введите "УДАЛИТЬ" чтобы подтвердить удаление аккаунта:');
    if (confirmation !== 'УДАЛИТЬ') {
      alert('Удаление отменено');
      return;
    }

    setDeleting(true);

    try {
      await axios.delete('http://127.0.0.1:8002/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      logout();
      alert('✅ Аккаунт успешно удалён');
      navigate('/');
    } catch (err: any) {
      alert('Ошибка при удалении аккаунта: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="alert alert-warning">
          Пожалуйста, <Link to="/login">войдите</Link>, чтобы просмотреть профиль
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h1 className="page-title">Мой профиль</h1>
      </div>

      {/* Карточка профиля */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">👤 Информация о пользователе</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <strong>Имя пользователя:</strong>
              <p className="mb-0 text-muted">{user.username}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Email:</strong>
              <p className="mb-0 text-muted">{user.email}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Роль:</strong>
              <p className="mb-0">
                {user.role === 'admin' ? (
                  <span className="badge bg-warning text-dark">👑 Администратор</span>
                ) : (
                  <span className="badge bg-primary">👤 Пользователь</span>
                )}
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Объявлений:</strong>
              <p className="mb-0 text-muted">{userAnnouncements.length}</p>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button onClick={logout} className="btn btn-outline-secondary">
              🚪 Выйти
            </button>
            <button 
              onClick={handleDeleteAccount} 
              className="btn btn-danger"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Удаление...
                </>
              ) : (
                <>
                  🗑️ Удалить аккаунт
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Мои объявления */}
      <div className="card shadow-sm">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📋 Мои объявления</h5>
            <Link to="/post" className="btn btn-primary btn-sm">
              ➕ Добавить
            </Link>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : userAnnouncements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p className="empty-state-title">У вас пока нет объявлений</p>
              <Link to="/post" className="btn btn-primary mt-3">
                Создать первое объявление
              </Link>
            </div>
          ) : (
            <div className="row">
              {userAnnouncements.map(announcement => {
                const imagePath = announcement.processed_image_path || announcement.image_path;
                const imageUrl = imagePath ? `http://127.0.0.1:8002/static/${imagePath}` : null;

                return (
                  <div key={announcement.id} className="col-12 col-md-6 mb-3">
                    <div className="card announcement-card">
                      {imageUrl && (
                        <img 
                          src={imageUrl}
                          alt={announcement.category}
                          className="card-img-top"
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className={`badge ${announcement.type === 'Пропал' ? 'badge-lost' : 'badge-found'}`}>
                            {announcement.type.toUpperCase()}
                          </span>
                          <span className="announcement-category">
                            {announcement.category}
                          </span>
                        </div>

                        <p className="announcement-description">
                          {announcement.description}
                        </p>

                        <small className="announcement-date d-block mb-3">
                          📅 {new Date(announcement.created_at).toLocaleDateString('ru-RU')}
                        </small>

                        <div className="d-flex gap-2">
                          <Link 
                            to={`/announcement/${announcement.id}`}
                            className="btn btn-outline-primary btn-sm flex-grow-1"
                          >
                            👁️ Просмотр
                          </Link>
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
