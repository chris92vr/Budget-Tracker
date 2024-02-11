import React, { useEffect, useState } from 'react';

import { Modal, Button, Stack } from 'react-bootstrap';
import { currencyFormatter, formatDate } from 'app/utils';

function deleteBudget(budgetId) {
  fetch('http://localhost:1337/api/budgets/' + budgetId, {
    method: 'DELETE',

    body: JSON.stringify({
      budget_id: budgetId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // reload the page
      window.location.reload(false);
    })
    .catch((err) => console.log(err));
  window.location.reload(false);
}

async function deleteExpense(expenseId, budgetId) {
  const response = await fetch(
    'http://localhost:1337/api/expenses/' + expenseId,
    {
      method: 'DELETE',
      body: JSON.stringify({
        expense_id: expenseId,
      }),
    }
  );

  if (!response.ok) {
    console.log('Failed to delete expense');
    return;
  }

  const expenseData = await response.json();
  const amount = parseFloat(expenseData.data.attributes.amount);

  const budgetResponse = await fetch(
    `http://localhost:1337/api/budgets/${budgetId}`,
    { method: 'GET' }
  );

  if (!budgetResponse.ok) {
    console.log('Failed to fetch budget');
    return;
  }

  const budgetData = await budgetResponse.json();
  const currentTotal = parseFloat(budgetData.data.attributes.total);
  console.log('currentTotal: ', currentTotal);
  console.log('amount: ', amount);
  console.log('budgets: ', budgetData);
  const total = currentTotal - amount;
  console.log('total: ', total);

  const updateResponse = await fetch(
    `http://localhost:1337/api/budgets/${budgetId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          total: total,
        },
      }),
    }
  );

  if (updateResponse.ok) {
    console.log('Budget updated successfully');
    window.location.reload(false);
  } else {
    console.log('Failed to update budget');
    console.log(total);
  }
}

function ViewExpenses({ budgetId, handleClose }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetch(
        'http://localhost:1337/api/expenses/?budget_id=' + budgetId,
        {
          method: 'GET',
        }
      );
      if (user.status === 200 && user != null) {
        const json = await user.json();

        setExpenses(json);
      }
    };
    fetchData();
  }, [budgetId]);
  console.log('expenses: ', expenses);
  console.log('budgetId: ', budgetId);
  return (
    <Modal show={budgetId != null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap="2">
            <div>Expenses </div>

            <Button
              onClick={() => {
                deleteBudget(budgetId);
                handleClose();
              }}
              variant="outline-danger"
            >
              Delete
            </Button>
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical" gap="3">
          {Array.isArray(expenses.data) && expenses.data.length > 0
            ? expenses.data.map((expense) => (
                <Stack direction="horizontal" gap="2" key={expense.id}>
                  <div className="me-auto fs-4">
                    {expense.attributes.description} -{' '}
                    {formatDate(expense.attributes.createdAt)}
                  </div>
                  <div className="fs-5">
                    <p>budget id{expense.attributes.budget_id}</p>
                    {currencyFormatter.format(expense.attributes.amount)}
                  </div>
                  <Button
                    onClick={() => deleteExpense(expense.id, budgetId)}
                    size="sm"
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Stack>
              ))
            : null}
        </Stack>
      </Modal.Body>
    </Modal>
  );
}

export default ViewExpenses;
