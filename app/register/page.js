'use client';

import { useState } from 'react';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = fetch(
      'http://localhost:1337/api/auth/local/register',
        {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            username,
            email,
            password,
            }),
        }

      
    );
    response
      .then((res) => {
        console.log('response status: ' + res.status);
        if (res.status === 200) {
            alert('Registration successful');
            //redirect to login page
            window.location.href = '/login';
          
        } else {
          console.log('response status: ' + res.status);
          alert('Username or email already exists');
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
        <h1 className="h3 mb-3 fw-normal">Register</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};



// The RegisterPage component is a form that allows users to register. It uses the useState hook to manage the form state and the fetch API to send a POST request to the Strapi API. The getServerSideProps function is used to ensure that the page is pre-rendered on the server.
// 

