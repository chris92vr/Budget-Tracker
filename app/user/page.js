"use client";
import { useState, useEffect } from 'react';
import cookie from 'cookie';


export default function YourPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cookies = typeof window !== 'undefined' ? document.cookie : '';
      const { token } = cookie.parse(cookies);
      console.log('token: ', token);

      if (!token) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return;
      }

 
      const res = await fetch('http://localhost:1337/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('res: ', res);

      const userData = await res.json();
      console.log('userData: ', userData);

      setUser(userData);
    };

    fetchData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}