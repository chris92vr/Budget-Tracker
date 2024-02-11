'use client';

import { Form, Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function AddExpenseButtonById({ handleClose, budgetId }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      // get the data from the api
      const user = await fetch(
        'http://localhost:1337/api/budgets/' + budgetId,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // convert the data to json
      const userJson = await user.json();
      // set the data to the state
      setBudgets(userJson);
      console.log('userJson: ', userJson);
    };
    // call the async function
    fetchData();
  }, [budgetId]); // Include 'budgets' in the dependency array

  const submit = async (e) => {
    e.preventDefault();
    console.log('budasddfsaf', budgetId);

    const response = await fetch('http://localhost:1337/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          description,
          amount,
          budget_id: budgetId,
        },
      }),
    });

    if (response.ok) {
      // Fetch the current budget
      const budgetResponse = await fetch(
        `http://localhost:1337/api/budgets/${budgetId}`,
        {
          method: 'GET',
        }
      );

      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json();
        const currentTotal = budgetData.data.attributes.total;
        console.log('currentTotal: ', currentTotal);
        console.log('budgets: ', budgetData);

        // Update the budget total
        const updateResponse = await fetch(
          `http://localhost:1337/api/budgets/${budgetId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: {
                total: currentTotal + parseFloat(amount), // Assuming 'total' is a number
              },
            }),
          }
        );

        if (updateResponse.ok) {
          console.log('Budget updated successfully');
        } else {
          console.log('Failed to update budget');
        }
      } else {
        console.log('Failed to fetch budget');
      }

      window.location.reload(false);
      handleClose();
      // ...
    } else {
      console.error('Server response was not ok');
      const text = await response.text(); // Get the response text
      console.error('Response text:', text);
    }
  };

  return (
    <Modal show={budgetId} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Amount </Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Budget</Form.Label>
            <Form.Control as="select">
              <option value={budgetId}>
                {budgets.data && budgets.data.attributes.name}
              </option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={submit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
