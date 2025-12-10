import React from 'react';
import { Link } from 'react-router-dom';
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

function Search() {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [type, setType] = React.useState('');
  const [results, setResults] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const performSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);
      if (type) params.append('type', type);
      
      const response = await axios.get(`http://127.0.0.1:8002/api/search?${params}`);
      console.log('Search results:', response.data);
      setResults(response.data);
    } catch (err) {
      console.error('Ошибка при поиске:', err);
      setError('Ошибка при поиске');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    performSearch();
  }, [query, category, type]);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Поиск объявлений</h1>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-control"
                placeholder="Поиск по описанию"
              />
            </div>
            
            <div className="col-12 col-md-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                <option value="">Все категории</option>
                <option value="Электроника">Электроника</option>
                <option value="Ключи">Ключи</option>
                <option value="Документы">Документы</option>
                <option value="Одежда">Одежда</option>
                <option value="Другое">Другое</option>
              </select>
            </div>
            
            <div className="col-12 col-md-3">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-select"
              >
                <option value="">Все типы</option>
                <option value="Пропал">Потеряно</option>
                <option value="Найден">Найдено</option>
              </select>
            </div>
            
            <div className="col-12 col-md-2">
              <button 
                onClick={performSearch} 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Поиск...
                  </>
                ) : (
                  'Найти'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {results.length === 0 && !loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p className="empty-state-title">
            {query || category || type ? 'По вашему запросу ничего не найдено' : 'Введите критерии поиска'}
          </p>
        </div>
      ) : (
        <div className="row">
          {results.map(item => {
            // Получаем изображение
            const imagePath = item.processed_image_path || item.image_path;
            const imageUrl = imagePath ? `http://127.0.0.1:8002/static/${imagePath}` : null;

            return (
              <div key={item.id} className="col-12 col-md-6 mb-3">
                <div className="card announcement-card">
                  {/* Изображение */}
                  {imageUrl ? (
                    <img 
                      src={imageUrl}
                      alt={item.category}
                      className="card-img-top"
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div 
                      className="card-img-top"
                      style={{ 
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
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className={`badge ${item.type === 'Пропал' ? 'badge-lost' : 'badge-found'}`}>
                        {item.type === 'Пропал' ? 'ПРОПАЛ' : 'НАЙДЕН'}
                      </span>
                      <span className="announcement-category">
                        {item.category}
                      </span>
                    </div>
                    
                    <p className="announcement-description">
                      {item.description}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="announcement-date">
                        📅 {new Date(item.created_at).toLocaleDateString('ru-RU')}
                      </small>
                      <Link 
                        to={`/announcement/${item.id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Посмотреть
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Search;
