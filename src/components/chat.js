import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const Chat = ({ token, recipientId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const ENCRYPTION_KEY = 'your_encryption_key'; // Should be stored securely

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on('receive_message', ({ senderId, content, createdAt }) => {
      const bytes = CryptoJS.AES.decrypt(content, ENCRYPTION_KEY);
      const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
      setChat((prev) => [...prev, { senderId, message: decryptedMessage, createdAt }]);
    });

    return () => newSocket.close();
  }, [token]);

  const sendMessage = () => {
    const encryptedMessage = CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
    socket.emit('send_message', { recipientId, content: encryptedMessage });
    setChat((prev) => [...prev, { senderId: 'You', message, createdAt: new Date() }]);
    setMessage('');
  };

  return (
    <div>
      <div>
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
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
