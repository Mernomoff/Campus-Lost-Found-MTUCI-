import React from 'react';
import { Link } from 'react-router-dom';
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
      
      const response = await axios.get(`http://localhost:8002/api/search?${params}`);
      setResults(response.data);
    } catch (err) {
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
    <div className="container mt-4">
      <h1>Поиск объявлений</h1>
      
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control"
            placeholder="Поиск по описанию"
          />
        </div>
        
        <div className="col-md-3">
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
        
        <div className="col-md-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-select"
          >
            <option value="">Все типы</option>
            <option value="потеряно">Потеряно</option>
            <option value="найдено">Найдено</option>
          </select>
        </div>
        
        <div className="col-md-2">
          <button onClick={performSearch} className="btn btn-primary w-100">
            {loading ? 'Поиск...' : 'Найти'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {results.length === 0 && !loading ? (
        <p className="text-center text-muted">
          {query || category || type ? 'По вашему запросу ничего не найдено' : 'Введите критерии поиска'}
        </p>
      ) : (
        <div className="row">
          {results.map(item => (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <span className={`badge ${item.type === 'найдено' ? 'bg-success' : 'bg-danger'} mb-2`}>
                    {item.type.toUpperCase()}
                  </span>
                  <h5 className="card-title">{item.category}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="text-muted small">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </p>
                  <Link to={`/details/${item.id}`} className="btn btn-primary btn-sm">
                    Посмотреть
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
