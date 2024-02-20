'use client';
import { useState, useEffect } from 'react';
import cookie from 'cookie';
import { Container } from 'react-bootstrap';

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

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + 'api/users/me',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    <Container className="mt-5 text-center">
      <h1>Your Page</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>
        Date is created: {new Date(user.createdAt).toLocaleDateString('en-GB')}
      </p>
    </Container>
  );
}
