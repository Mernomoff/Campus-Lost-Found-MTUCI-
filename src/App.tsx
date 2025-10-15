import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './components/Home';
import Search from './components/Search';
import Details from './components/Details';
import Map from './components/Map';
import Chat from './components/Chat';
import Post from './components/Post';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/" style={{color: '#fff'}}>Кампус: Потеряно/Найдено</a>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">Главная</Link>
              <Link className="nav-link" to="/post">Добавить</Link>
              <Link className="nav-link" to="/search">Поиск</Link>
              <Link className="nav-link" to="/map">Карта</Link>
              <Link className="nav-link" to="/profile">Профиль</Link>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/map" element={<Map />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/post" element={<Post />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
