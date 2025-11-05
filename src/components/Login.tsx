import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginForm {
  username: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<LoginForm>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8002/api/auth/login', formData);

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: formData.username,
        email: '',
        role: 'user'
      }));

      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h1>Вход в систему</h1>
      <form onSubmit={handleSubmit} style={{maxWidth: '400px', margin: '0 auto', background: 'linear-gradient(135deg, #23263a 60%, #181a20 100%)', borderRadius: '18px', boxShadow: '0 8px 32px rgba(59,130,246,0.18)', padding: '32px 36px', color: '#f3f4f6'}}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="username" className="form-label" style={{fontWeight: '700'}}>Имя пользователя</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            placeholder="Введите имя пользователя"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label" style={{fontWeight: '700'}}>Пароль</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Введите пароль"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>

        <div className="text-center mt-3">
          <Link to="/register" style={{color: '#3b82f6'}}>Нет аккаунта? Зарегистрироваться</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;