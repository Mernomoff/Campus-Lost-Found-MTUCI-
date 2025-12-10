import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <BSNavbar bg="white" expand="lg" className="navbar shadow-sm">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="navbar-brand">
          🎓 Campus Lost/Found
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              🏠 Главная
            </Nav.Link>
            <Nav.Link as={Link} to="/search">
              🔍 Поиск
            </Nav.Link>
            <Nav.Link as={Link} to="/map">
              🗺️ Карта
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/chats">
                  💬 Чаты
                </Nav.Link>
                <Nav.Link as={Link} to="/post">
                  ➕ Добавить
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  👤 Профиль
                </Nav.Link>
                <Nav.Link onClick={logout} style={{ cursor: 'pointer' }}>
                  🚪 Выход
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  🔑 Вход
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  📝 Регистрация
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
