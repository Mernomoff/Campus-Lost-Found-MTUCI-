import React from 'react';

function Profile() {
  return (
    <div>
      <h1>Профиль и конфиденциальность</h1>
      <label><input type="checkbox" className="form-check-input" /> Включить индексацию фото</label><br />
      <label><input type="checkbox" className="form-check-input" /> Согласие на обработку данных</label><br />
      <button className="btn btn-secondary" onClick={() => alert('Запрос на удаление данных отправлен (тест)')}>Запросить удаление данных</button>
    </div>
  );
}

export default Profile;