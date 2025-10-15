import React from 'react';
import { useParams } from 'react-router-dom';

interface Message {
  text: string;
  sender: string;
}

function Chat() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState<string>('');

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'Вы' }]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Чат для объявления {id}</h1>
      <form id="chatForm" onSubmit={sendMessage}>
        <ul className="list-group">
          {messages.map((msg, index) => (
            <li key={index} className="list-group-item">{msg.sender}: {msg.text}</li>
          ))}
        </ul>
        <input
          type="text"
          id="message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="form-control mt-2"
          placeholder="Сообщение"
        />
        <button type="submit" className="btn btn-primary mt-1">Отправить</button>
      </form>
    </div>
  );
}

export default Chat;