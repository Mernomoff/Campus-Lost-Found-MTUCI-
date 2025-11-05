import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8002/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: formData.username,
        email: formData.email,
        role: 'user'
      }));

      window.location.href = '/';
    } catch (err: any) {
      if (err.response?.data?.details) {
        setError(err.response.data.details.join(', '));
      } else {
        setError(err.response?.data?.error || 'Ошибка регистрации');
      }
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
      <h1>Регистрация</h1>
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
          <label htmlFor="email" className="form-label" style={{fontWeight: '700'}}>Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Введите email"
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

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label" style={{fontWeight: '700'}}>Подтверждение пароля</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control"
            placeholder="Повторите пароль"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <div className="text-center mt-3">
          <Link to="/login" style={{color: '#3b82f6'}}>Уже есть аккаунт? Войти</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;