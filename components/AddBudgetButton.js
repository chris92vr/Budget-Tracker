'use client';

import { Form, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import cookie from 'cookie';

export default function AddBudgetButton({ show, handleClose }) {
  const [name, setName] = useState('');
  const [max, setMax] = useState('');
  const [user, setUser] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    const cookies = typeof window !== 'undefined' ? document.cookie : '';
    const { token } = cookie.parse(cookies);

    const res = await fetch('http://localhost:1337/api/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await res.json();

    setUser(userData);

    const response = await fetch('http://localhost:1337/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          name,
          max,
          user_id: userData.id,
        },
      }),
    });

    if (response.ok) {
      // Check if response status was 200
      const data = await response.json();
      console.log(data);
      window.location.reload(false);
      handleClose();
    } else {
      console.log('status not 200', response.status);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>New Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control
              onChange={(e) => setMax(e.target.value)}
              type="number"
              required
              min={0}
              step={0.01}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
