import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Фикс иконок Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Компонент для клика по карте
function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

const Post: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState('Пропал');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  // Получить текущее местоположение
  const getCurrentLocation = () => {
    setGettingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        setGettingLocation(false);
        console.log('Location obtained:', latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Вы запретили доступ к геолокации. Разрешите доступ в настройках браузера.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Информация о местоположении недоступна.');
            break;
          case error.TIMEOUT:
            setError('Превышено время ожидания запроса местоположения.');
            break;
          default:
            setError('Произошла неизвестная ошибка при получении местоположения.');
        }
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!category.trim()) {
      setError('Категория обязательна');
      setLoading(false);
      return;
    }

    if (!description.trim()) {
      setError('Описание обязательно');
      setLoading(false);
      return;
    }

    if (!location) {
      setError('Выберите местоположение на карте или нажмите "Моё местоположение"');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('category', category.trim());
      formData.append('description', description.trim());
      formData.append('location', JSON.stringify(location));
      
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('http://127.0.0.1:8002/api/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Объявление успешно создано!');
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Ошибка при создании объявления');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError('Ошибка при создании объявления');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container">
        <div className="alert alert-warning">
          Пожалуйста, <a href="/login">войдите</a>, чтобы создать объявление
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">Создать объявление</h1>
        <p className="page-subtitle">Заполните форму, чтобы добавить новое объявление</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Основная информация</h5>
          </div>
          <div className="card-body">
            {/* Тип */}
            <div className="mb-3">
              <label className="form-label">Тип объявления *</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="Пропал">Потеряно</option>
                <option value="Найден">Найдено</option>
              </select>
            </div>

            {/* Категория */}
            <div className="mb-3">
              <label className="form-label">Категория *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Выберите категорию</option>
                <option value="Электроника">Электроника</option>
                <option value="Ключи">Ключи</option>
                <option value="Документы">Документы</option>
                <option value="Одежда">Одежда</option>
                <option value="Другое">Другое</option>
              </select>
            </div>

            {/* Описание */}
            <div className="mb-3">
              <label className="form-label">Описание *</label>
              <textarea
                className="form-control"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите предмет подробно..."
                maxLength={500}
                required
              />
              <small className="text-muted">
                {description.length}/500 символов
              </small>
            </div>

            {/* Изображение */}
            <div className="mb-3">
              <label className="form-label">Фотография (опционально)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <small className="text-muted d-block mt-2">
                💡 Лица на фотографии будут автоматически размыты для защиты конфиденциальности
              </small>
            </div>
          </div>
        </div>

        {/* Карта */}
        <div className="card mb-4">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Местоположение *</h5>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Определяем...
                  </>
                ) : (
                  <>
                    📍 Моё местоположение
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="card-body">
            <p className="text-muted mb-3">
              {location 
                ? `✅ Выбрано: ${location[0].toFixed(6)}, ${location[1].toFixed(6)}`
                : '👆 Кликните на карту или нажмите "Моё местоположение"'
              }
            </p>
            <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
              <MapContainer
                center={location || [55.751244, 37.618423]} // Москва по умолчанию
                zoom={location ? 16 : 13}
                style={{ height: '100%', width: '100%' }}
                key={location ? `${location[0]}-${location[1]}` : 'default'}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationMarker position={location} setPosition={setLocation} />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="d-flex gap-3 mb-4">
          <button
            type="button"
            className="btn btn-secondary flex-grow-1"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-grow-1"
            disabled={loading || !category || !description || !location}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Создание...
              </>
            ) : (
              <>
                ✨ Создать объявление
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Post;
