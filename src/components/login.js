import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      let data;

      try {
        data = await res.json(); // Parse JSON if response is valid
      } catch (err) {
        const text = await res.text(); // Fallback to reading text
        console.error('Non-JSON response:', text);
        alert('Login failed: Unexpected server response');
        return;
      }

      if (res.ok) {
        alert('Login Successful! Token: ' + data.token);
        localStorage.setItem('token', data.token);
        // Optional: redirect to home/chat page
        // window.location.href = '/chat';
      } else {
        alert('Login failed: ' + (data.error || 'Unknown error'));
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
