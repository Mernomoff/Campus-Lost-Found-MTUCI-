import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Announcement {
  id: number;
  type: string;
  category: string;
  description: string;
  location: number[];
  image_path: string | null;
  processed_image_path: string | null;
  created_at: string;
  user_id: number;
  author: {
    id: number;
    username: string;
    role: string;
  };
}

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8002/api/announcements/${id}`);
        const data = await response.json();
        console.log('Loaded announcement:', data);
        setAnnouncement(data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim() || !token || !announcement) return;

    setSending(true);

    try {
      const response = await fetch('http://127.0.0.1:8002/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          announcement_id: announcement.id,
          receiver_id: announcement.author.id,
          content: message.trim()
        })
      });

      if (response.ok) {
        alert('Сообщение отправлено!');
        setShowMessageModal(false);
        setMessage('');
        navigate(`/chat/${announcement.id}/${announcement.author.id}`);
      } else {
        const error = await response.json();
        alert(error.detail || 'Ошибка при отправке сообщения');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка при отправке сообщения');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!announcement) {
    return (
      <div className="container">
        <div className="alert alert-danger">Объявление не найдено</div>
      </div>
    );
  }

  const isOwner = user && user.id === announcement.user_id;

  // Используем только обработанное фото, если есть, иначе оригинальное
  const displayImage = announcement.processed_image_path || announcement.image_path;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <button className="btn btn-outline-primary mb-3" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="card shadow-lg border-0">
        <div className="card-header bg-white border-0 pt-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <span className={`badge ${announcement.type === 'Пропал' ? 'badge-lost' : 'badge-found'} mb-2`}>
                {announcement.type}
              </span>
              <h2 className="mb-2">{announcement.category}</h2>
              <small className="text-muted">
                Автор: <strong>{announcement.author.username}</strong>
                {announcement.author.role === 'admin' && (
                  <span className="badge bg-warning text-dark ms-2">Администратор</span>
                )}
              </small>
              <br />
              <small className="text-muted">
                Опубликовано: {formatDate(announcement.created_at)}
              </small>
            </div>
          </div>
        </div>

        {/* ТОЛЬКО ОДНО ФОТО - обработанное или оригинальное */}
        {displayImage && (
          <div>
            <img
              src={`http://127.0.0.1:8002/static/${displayImage}`}
              alt={announcement.category}
              className="img-fluid w-100"
              style={{ 
                maxHeight: '500px', 
                objectFit: 'cover',
                borderBottom: '1px solid var(--border-color)'
              }}
            />
            {announcement.processed_image_path && (
              <div className="text-center p-2 bg-light border-bottom">
                <small className="text-muted">
                  🔒 Лица размыты для защиты конфиденциальности
                </small>
              </div>
            )}
          </div>
        )}

        <div className="card-body">
          <h5 className="mb-3">Описание</h5>
          <p className="lead">{announcement.description}</p>

          {announcement.location && announcement.location.length === 2 && (
            <div className="mt-4">
              <h5 className="mb-3">📍 Местоположение</h5>
              <div style={{ height: '300px', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <MapContainer
                  center={[Number(announcement.location[0]), Number(announcement.location[1])]}
                  zoom={16}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[Number(announcement.location[0]), Number(announcement.location[1])]}>
                    <Popup>{announcement.category}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        {/* КНОПКА НАПИСАТЬ ВСЕГДА ВИДНА ВНИЗУ */}
        <div className="card-footer bg-white border-top">
          {!user ? (
            <div className="alert alert-info mb-0">
              <a href="/login">Войдите</a>, чтобы написать автору
            </div>
          ) : isOwner ? (
            <div className="alert alert-secondary mb-0">
              Это ваше объявление
            </div>
          ) : (
            <button 
              className="btn btn-primary btn-lg w-100"
              onClick={() => setShowMessageModal(true)}
            >
              ✉️ Написать автору ({announcement.author.username})
            </button>
          )}
        </div>
      </div>

      {/* Модальное окно для отправки сообщения */}
      {showMessageModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowMessageModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Написать {announcement.author.username}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowMessageModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Сообщение</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Напишите ваше сообщение..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={sending}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowMessageModal(false)}
                  disabled={sending}
                >
                  Отмена
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                >
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Отправка...
                    </>
                  ) : (
                    '📤 Отправить'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
