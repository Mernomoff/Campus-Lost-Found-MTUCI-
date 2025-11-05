import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Announcement {
  id: number;
  type: string;
  Категория: string;
  Описание: string;
  Локация: [number, number];
  created_at: string;
  user_id: number;
}

function Search() {
  const [query, setQuery] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('');
  const [type, setType] = React.useState<string>('');
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
    <div>
      <h1>Поиск объявлений</h1>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                name="q"
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
                <option value="Пропал">Потеряно</option>
                <option value="Найден">Найдено</option>
              </select>
            </div>

            <div className="col-md-2">
              <button
                onClick={performSearch}
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Поиск...' : 'Найти'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row mt-3">
        {results.length === 0 && !loading ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              {query || category || type ? 'По вашему запросу ничего не найдено' : 'Введите критерии поиска'}
            </div>
          </div>
        ) : (
          results.map(item => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    <span className={`badge ${item.type === 'Пропал' ? 'bg-danger' : 'bg-success'}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="ms-2">{item.Категория}</span>
                  </h5>
                  <p className="card-text flex-grow-1">{item.Описание}</p>
                  <div className="mt-auto">
                    <small className="text-muted">
                      {new Date(item.created_at).toLocaleDateString('ru-RU')}
                    </small>
                    <br />
                    <Link to={`/details/${item.id}`} className="btn btn-primary btn-sm mt-2">Посмотреть</Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Search;