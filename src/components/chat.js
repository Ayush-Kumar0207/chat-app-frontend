import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';

const Chat = ({ token, recipientId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY; // 🔒 Replace with env var in production

  useEffect(() => {
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_API_URI, {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on('receive_message', ({ senderId, content, createdAt }) => {
      try {
        const bytes = CryptoJS.AES.decrypt(content, ENCRYPTION_KEY);
        const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
        setChat((prev) => [...prev, { senderId, message: decryptedMessage, createdAt }]);
      } catch (err) {
        console.error('❌ Decryption failed:', err);
      }
    });

    return () => {
      newSocket.disconnect(); // 👈 Use disconnect instead of close
    };
  }, [token]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const encryptedMessage = CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();

    socket.emit('send_message', {
      recipientId,
      content: encryptedMessage,
    });

    setChat((prev) => [...prev, { senderId: 'You', message, createdAt: new Date() }]);
    setMessage('');
  };

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {chat.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.senderId}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
        style={{ width: '80%', padding: '8px' }}
      />
      <button onClick={sendMessage} style={{ padding: '8px 12px' }}>
        Send
      </button>
    </div>
  );
};

export default Chat;
