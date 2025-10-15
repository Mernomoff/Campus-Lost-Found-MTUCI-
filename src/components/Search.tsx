import React from 'react';
import { Link } from 'react-router-dom';

interface Announcement {
  id: number;
  type: string;
  Категория: string;
  Описание: string;
  Локация: [number, number];
}

const announcements: Announcement[] = [
  {'id': 1, 'type': 'Пропал', 'Категория': 'Электроника', 'Описание': 'Чёрный ноутбук', 'Локация': [55.7557, 37.71174]},
  {'id': 2, 'type': 'Найден', 'Категория': 'Ключи', 'Описание': 'Серебряный брелок', 'Локация': [55.75566, 37.71494]},
];

function Search() {
  const [query, setQuery] = React.useState<string>('');
  const [results, setResults] = React.useState<Announcement[]>(announcements);

  React.useEffect(() => {
    const filtered = announcements.filter(a =>
      a.Описание.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  return (
    <div>
      <h1>Поиск</h1>
      <form>
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
          placeholder="Поиск по описанию"
        />
      </form>
      <div className="row mt-3">
        {results.map(item => (
          <div key={item.id} className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <span className="ann-type">{item.type.toUpperCase()}</span>: <span className="ann-category">{item.Категория}</span>
                </h5>
                <p className="card-text ann-desc">{item.Описание}</p>
                <Link to={`/details/${item.id}`} className="btn btn-primary">Посмотреть</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;