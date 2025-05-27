// frontend/src/components/Login.js

import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // ✅ sending correct fields
      });

      const data = await res.json();
      if (res.ok) {
        alert('Login Successful! Token: ' + data.token);
        localStorage.setItem('token', data.token);
        // You can redirect here as well
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (err) {
      console.error('Error logging in:', err);
      alert('Login failed: server error');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
console.log('API URL:', process.env.REACT_APP_API_URL);
