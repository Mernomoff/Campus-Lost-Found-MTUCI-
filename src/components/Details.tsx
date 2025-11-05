import React from 'react';
import { Link, useParams } from 'react-router-dom';

interface Announcement {
  id: number;
  type: string;
  Категория: string;
  Описание: string;
  Локация: [number, number];
  created_at: string;
  user_id: number;
}

function Details() {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] = React.useState<Announcement | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`http://localhost:8002/api/announcements/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAnnouncement(data);
        } else {
          setError('Объявление не найдено');
        }
      } catch (error) {
        console.error('Error fetching announcement:', error);
        setError('Ошибка при загрузке объявления');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '200px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div>
        <h1>Объявление не найдено</h1>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{marginBottom: '30px'}}>Детали объявления</h1>
      <div className="card" style={{maxWidth: '500px', margin: '0 auto', boxShadow: '0 0 30px #2228', borderRadius: '20px'}}>
        <div className="card-body">
          <h4 className="card-title" style={{marginBottom: '20px'}}>
            <span className={`badge ${announcement.type === 'Пропал' ? 'bg-danger' : 'bg-success'}`}>
              {announcement.type.toUpperCase()}
            </span>
          </h4>
          <div className="mb-3"><strong>Категория:</strong> {announcement.Категория}</div>
          <div className="mb-3"><strong>Описание:</strong> {announcement.Описание}</div>
          <div className="mb-3"><strong>Местоположение:</strong> {announcement.Локация.join(', ')}</div>
          <div className="mb-3"><strong>Дата создания:</strong> {new Date(announcement.created_at).toLocaleDateString('ru-RU')}</div>
          <Link to={`/chat/${announcement.id}`} className="btn btn-primary">Начать чат</Link>
        </div>
      </div>
    </div>
  );
}

export default Details;