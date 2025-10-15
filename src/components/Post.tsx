import React from 'react';

interface FormData {
  type: string;
  category: string;
  description: string;
  location: string;
}

function Post() {
  const [formData, setFormData] = React.useState<FormData>({
    type: 'lost',
    category: '',
    description: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('New announcement:', formData);
    alert('Anonymization applied (simulated: faces blurred)!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h1>Добавить объявление</h1>
      <form onSubmit={handleSubmit} style={{maxWidth: '520px', margin: '0 auto', background: 'linear-gradient(135deg, #23263a 60%, #181a20 100%)', borderRadius: '18px', boxShadow: '0 8px 32px rgba(59,130,246,0.18)', padding: '32px 36px', color: '#f3f4f6'}}>
        <div className="mb-4">
          <label htmlFor="type" className="form-label" style={{fontWeight: '700'}}>Тип объявления</label>
          <select name="type" id="type" value={formData.type} onChange={handleChange} className="form-select">
            <option value="lost">Потеряно</option>
            <option value="found">Найдено</option>
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
          <label className="form-label" style={{fontWeight: '700'}}>Местоположение</label>
          <div className="d-flex flex-column gap-2">
            <input
              type="text"
              id="location-manual"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              placeholder="Ввести координаты вручную (например, 55.7557, 37.71174)"
            />
            <button type="button" className="btn btn-secondary" style={{width: '100%'}} disabled>Отправить моё местоположение</button>
          </div>
          <small className="form-text text-muted">(Поля не работают, только для визуализации)</small>
        </div>
        <button type="submit" className="btn btn-success w-100" onClick={() => alert('Anonymization applied (simulated: faces blurred)!')}>Отправить (с анонимизацией)</button>
      </form>
    </div>
  );
}

export default Post;