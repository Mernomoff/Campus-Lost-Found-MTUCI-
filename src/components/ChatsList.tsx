import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

interface ChatPreview {
  announcement_id: number;
  announcement_description: string;
  other_user_id: number;
  other_user_username: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const ChatsList: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8002/api/chats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setChats(data);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    
    return () => clearInterval(interval);
  }, [token, navigate]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} мин назад`;
    }
    if (hours < 24) {
      return `${hours} ч назад`;
    }
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">💬 Мои чаты</h1>
        <p className="page-subtitle">Переписки по объявлениям</p>
      </div>

      {chats.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <h3 className="empty-state-title">Нет активных чатов</h3>
          <p className="text-muted">
            Когда вам напишут или вы напишете кому-то по объявлению, чаты появятся здесь
          </p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/')}
          >
            Посмотреть объявления
          </button>
        </div>
      ) : (
        <div>
          {chats.map((chat) => (
            <div 
              key={`${chat.announcement_id}-${chat.other_user_id}`}
              className="card mb-3"
              onClick={() => navigate(`/chat/${chat.announcement_id}/${chat.other_user_id}`)}
              style={{ 
                cursor: 'pointer', 
                transition: 'all 0.3s',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="flex-grow-1">
                    <h5 className="mb-1">
                      {chat.other_user_username}
                      {chat.unread_count > 0 && (
                        <span className="badge bg-danger ms-2">
                          {chat.unread_count}
                        </span>
                      )}
                    </h5>
                    <small className="text-muted">
                      📢 {chat.announcement_description}
                    </small>
                  </div>
                  <small className="text-muted">
                    {formatTime(chat.last_message_time)}
                  </small>
                </div>
                
                <p 
                  className={`mb-0 ${chat.unread_count > 0 ? 'fw-bold' : 'text-muted'}`}
                  style={{ fontSize: '0.95rem' }}
                >
                  {chat.last_message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatsList;
