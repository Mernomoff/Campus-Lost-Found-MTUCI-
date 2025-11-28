import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  type: string;
  category: string;
  description: string;
  location: string;
  image?: File | null;
}

function Post() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = React.useState<FormData>({
    type: 'Пропал',
    category: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let locationArray: [number, number] | [] = [];
      if (formData.location.trim()) {
        const coords = formData.location.split(',').map(coord => parseFloat(coord.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          locationArray = [coords[0], coords[1]];
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', JSON.stringify(locationArray));
      if (formData.image) {
        formDataToSend.append('file', formData.image);
      }

      const response = await axios.post('http://localhost:8002/api/announcements', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Объявление успешно добавлено!');
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.details) {
        setError(err.response.data.details.join(', '));
      } else {
        setError(err.response?.data?.error || 'Ошибка при добавлении объявления');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      image: file
    });
  };

  return (
    <div>
      <h1>Добавить объявление</h1>
      <form onSubmit={handleSubmit} style={{maxWidth: '520px', margin: '0 auto', background: 'linear-gradient(135deg, #23263a 60%, #181a20 100%)', borderRadius: '18px', boxShadow: '0 8px 32px rgba(59,130,246,0.18)', padding: '32px 36px', color: '#f3f4f6'}}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="type" className="form-label" style={{fontWeight: '700'}}>Тип объявления</label>
          <select name="type" id="type" value={formData.type} onChange={handleChange} className="form-select">
            <option value="Пропал">Потеряно</option>
            <option value="Найден">Найдено</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="form-label" style={{fontWeight: '700'}}>Категория</label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            placeholder="Например: Ключи, Электроника"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="form-label" style={{fontWeight: '700'}}>Описание</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Кратко опишите предмет..."
            rows={3}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="form-label" style={{fontWeight: '700'}}>Изображение</label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            className="form-control"
            accept="image/*"
          />
          <small className="form-text text-muted">Лица на изображении будут автоматически размыты для защиты приватности.</small>
        </div>

        <div className="mb-4">
          <label className="form-label" style={{fontWeight: '700'}}>Местоположение</label>
          <div className="d-flex flex-column gap-2">
            <input
              type="text"
              id="location-manual"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              placeholder="Координаты (например, 55.7557, 37.71174)"
            />
            <button type="button" className="btn btn-secondary" style={{width: '100%'}} disabled>
              Отправить моё местоположение
            </button>
          </div>
          <small className="form-text text-muted">
            Формат: широта, долгота (например: 55.7557, 37.71174)
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
}

export default Post;