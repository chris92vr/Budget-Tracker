'use client';

import { Form, Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getToken } from 'app/utils';
export default function AddExpenseButton({
  show,
  handleClose,
  defaultBudgetId,
}) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [budget_id, setBudget_id] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [userData, setUserData] = useState([]);
  const token = getToken();

  const submit = async (e) => {
    e.preventDefault();

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          description,
          amount,
          budget_id,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data: ', data);

      // Fetch the current budget
      const budgetResponse = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `api/budgets/${budget_id}`,
        {
          method: 'GET',
        }
      );

      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json();
        const currentTotal = budgetData.data.attributes.total;
        console.log('currentTotal: ', currentTotal);

        // Update the budget total
        const updateResponse = await fetch(
          process.env.NEXT_PUBLIC_API_URL + `api/budgets/${budget_id}`,
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
    } else {
      console.log('Failed to create expense');
    }
  };

  useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await res.json();
      setUserData(userData);
      console.log('userData: ', userData);

      // get the data from the api
      const resBudget = await fetch(
        process.env.NEXT_PUBLIC_API_URL + 'api/budgets?filters[user_id]=' + userData.id,
        {
          method: 'GET',
        }
      );

      const budgetData = await resBudget.json();

      setBudgets(budgetData.data);
    };
    // set state with the result

    // call the async function
    fetchData();
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              onChange={(e) => setAmount(e.target.value)}
              type="int"
              required
              min={0}
              step={0.01}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="budget_id">
            <Form.Label>Budget</Form.Label>
            <Form.Select
              defaultValue={defaultBudgetId}
              onChange={(e) => setBudget_id(e.target.value)}
              required
            >
              <option value="">Select a budget</option>
              {Array.isArray(budgets)
                ? budgets.map((budget) => (
                    <option key={budget.id} value={budget.id}>
                      {budget.attributes.name}
                    </option>
                  ))
                : null}
            </Form.Select>
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
