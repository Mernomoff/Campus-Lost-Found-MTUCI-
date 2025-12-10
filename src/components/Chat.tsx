import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

interface Message {
  id: number;
  announcement_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_username: string;
  receiver_username: string;
}

interface Announcement {
  id: number;
  description: string;
  type: string;
  category: string;
  author: {
    username: string;
  };
}

const Chat: React.FC = () => {
  const { announcementId, userId } = useParams<{ announcementId: string; userId: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [otherUserUsername, setOtherUserUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8002/api/announcements/${announcementId}`);
        const data = await response.json();
        setAnnouncement(data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    };

    if (announcementId) {
      fetchAnnouncement();
    }
  }, [announcementId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token || !announcementId || !userId) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8002/api/messages/announcement/${announcementId}/user/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          
          if (data.length > 0) {
            const firstMessage = data[0];
            const otherUsername = firstMessage.sender_id === user?.id 
              ? firstMessage.receiver_username 
              : firstMessage.sender_username;
            setOtherUserUsername(otherUsername);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    
    return () => clearInterval(interval);
  }, [token, announcementId, userId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !token || !announcementId || !userId) return;

    setSending(true);

    try {
      const response = await fetch('http://127.0.0.1:8002/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          announcement_id: parseInt(announcementId),
          receiver_id: parseInt(userId),
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages([...messages, sentMessage]);
        setNewMessage('');
      } else {
        const error = await response.json();
        alert(error.detail || 'Ошибка при отправке сообщения');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка при отправке сообщения');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
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
    <div className="container" style={{ maxWidth: '900px', padding: '1rem' }}>
      <div className="card shadow-lg border-0 mb-3">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <button 
            className="btn btn-light btn-sm me-3"
            onClick={() => navigate('/chats')}
          >
            ← Назад
          </button>
          <div className="flex-grow-1">
            <h5 className="mb-0">
              {otherUserUsername || `Пользователь #${userId}`}
            </h5>
            {announcement && (
              <small className="text-white-50">
                {announcement.type} • {announcement.category}
              </small>
            )}
          </div>
        </div>

        {announcement && (
          <div className="card-body bg-light border-bottom">
            <small className="text-muted d-block mb-1">
              <strong>Объявление от {announcement.author.username}:</strong>
            </small>
            <p className="mb-0">{announcement.description}</p>
          </div>
        )}

        <div 
          className="card-body" 
          style={{ 
            height: '500px', 
            overflowY: 'auto',
            backgroundColor: '#f8f9fa'
          }}
        >
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <p className="empty-state-title">Нет сообщений</p>
              <p className="text-muted">Начните переписку!</p>
            </div>
          ) : (
            <div>
              {messages.map((message) => {
                const isMine = message.sender_id === user?.id;
                
                return (
                  <div 
                    key={message.id}
                    className={`d-flex mb-3 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div style={{ maxWidth: '70%' }}>
                      <div
                        className={`p-3 rounded-lg ${
                          isMine 
                            ? 'bg-primary text-white' 
                            : 'bg-white border'
                        }`}
                        style={{
                          borderRadius: isMine ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div className={`small mb-1 ${isMine ? 'text-white-50' : 'text-muted'}`}>
                          <strong>{isMine ? 'Вы' : message.sender_username}</strong>
                        </div>
                        <p className="mb-0" style={{ wordBreak: 'break-word' }}>
                          {message.content}
                        </p>
                        <div 
                          className={`small mt-1 text-end ${isMine ? 'text-white-50' : 'text-muted'}`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="card-footer bg-white">
          <form onSubmit={handleSendMessage}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Напишите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
                style={{ 
                  borderRadius: '2rem 0 0 2rem',
                  padding: '0.75rem 1.25rem'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!newMessage.trim() || sending}
                style={{ 
                  borderRadius: '0 2rem 2rem 0',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem'
                }}
              >
                {sending ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  '📤 Отправить'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
