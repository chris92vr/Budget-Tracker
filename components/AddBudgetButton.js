'use client';

import { Form, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function AddBudgetButton({ show, handleClose }) {
  const [name, setName] = useState('');
  const [max, setMax] = useState('');

  const submit = (e) => {
    e.preventDefault();

    const response = fetch('http://localhost:1337/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          name,
          max,
        },
      }),
    });
    if (response != null) {
      response
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              console.log(data);
            });
            window.location.reload(false);
            handleClose();
          } else {
            console.log('status not 200', res.status);
          }
        })
        .catch((err) => {
          console.log('status not 200', err);
        });
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
