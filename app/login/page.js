'use client';

import { useState } from 'react';
import cookie from 'cookie';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = fetch(process.env.NEXT_PUBLIC_API_URL + 'api/auth/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: username,
        password,
      }),
    });
    response
      .then((res) => res.json())
      .then((data) => {
        console.log('response: ', data);
        if (data.jwt) {
          alert('Login successful');
          //Set header Set-Cookie with jwt token
          document.cookie = cookie.serialize('token', data.jwt, {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
          });

          console.log('cookie: ', document.cookie);

          console.log('token: ', data.jwt);
          window.location.href = '/user';
        } else {
          alert('Invalid username or password');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="form-signin">
      <form
        className="border border-primary m-5 p-3 border-2 rounded-end"
        onSubmit={handleSubmit}
      >
        <h1 className="h3 mb-3 fw-normal">Login</h1>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control mb-3"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control mb-3"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}
