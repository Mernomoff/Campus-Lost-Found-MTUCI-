import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './components/Home';
import Search from './components/Search';
import Details from './components/Details';
import Map from './components/Map';
import Chat from './components/Chat';
import ChatsList from './components/ChatsList';
import Post from './components/Post';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';

function AppContent() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <Router>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            CAMPUS LOST/FOUND
          </Link>
          <div className="navbar-nav ms-auto d-flex flex-row gap-2">
            <Link className="nav-link" to="/">🏠 Главная</Link>
            <Link className="nav-link" to="/search">🔍 Поиск</Link>
            <Link className="nav-link" to="/map">🗺️ Карта</Link>
            {isAuthenticated && (
              <>
                <Link className="nav-link" to="/chats">💬 Чаты</Link>
                <Link className="nav-link" to="/post">➕ Добавить</Link>
                <Link className="nav-link" to="/profile">👤 Профиль</Link>
                <button onClick={logout} className="btn btn-sm btn-outline-primary">
                  🚪 Выход
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link className="nav-link" to="/login">🔑 Вход</Link>
                <Link className="nav-link" to="/register">📝 Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/announcement/:id" element={<Details />} />
        <Route path="/map" element={<Map />} />
        <Route path="/chats" element={<ChatsList />} />
        <Route path="/chat/:announcementId/:userId" element={<Chat />} />
        <Route path="/post" element={<Post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
