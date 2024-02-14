import React, { useEffect, useState } from 'react';

import { Modal, Button, Stack } from 'react-bootstrap';
import { currencyFormatter, formatDate } from 'app/utils';

async function deleteBudget(budgetId) {
  // First, fetch all expenses related to this budget
  const expensesResponse = await fetch(
    `http://localhost:1337/api/expenses?filters[budget_id]=${budgetId}`,
    {
      method: 'GET',
    }
  );

  if (!expensesResponse.ok) {
    console.log('Failed to fetch expenses');
    return;
  }

  const expensesData = await expensesResponse.json();

  // Delete each expense related to this budget
  for (let expense of expensesData.data) {
    const deleteExpenseResponse = await fetch(
      'http://localhost:1337/api/expenses/' + expense.id,
      {
        method: 'DELETE',
      }
    );

    if (!deleteExpenseResponse.ok) {
      console.log('Failed to delete expense with id ' + expense.id);
      return;
    }
  }

  // Then, delete the budget
  const response = await fetch(
    'http://localhost:1337/api/budgets/' + budgetId,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    console.log('Failed to delete budget');
    return;
  }

  console.log('Budget and related expenses deleted successfully');
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
  const [page, setPage] = useState(1); // Add a state for the current page
  const [currentPage, setCurrentPage] = useState(1); // Add a state for the current page
  const [totalPages, setTotalPages] = useState(0); // Add a state for the total number of pages
  const [totalExpenses, setTotalExpenses] = useState(0);
  const limit = 10;
  useEffect(() => {
    const fetchData = async () => {
      const limit = 10; // Number of records per page
      const start = (currentPage - 1) * limit; // Calculate the start index
      const total = await fetch(
        `http://localhost:1337/api/expenses/count/view?budget_id=${budgetId}`,
        {
          method: 'GET',
        }
      );
      const totalData = await total.json();
      const totalExpenses = totalData;
      setTotalExpenses(totalExpenses);
      const totalPages = Math.ceil(totalData / limit); // Calculate the total number of pages
      setTotalPages(totalPages); // Set the total number of pages
      const lastPage = currentPage === totalPages; // Check if it's the last page

      const response = await fetch(
        `http://localhost:1337/api/expenses?filters[budget_id]=${budgetId}&pagination[start]=${start}&pagination[limit]=${limit}`,
        {
          method: 'GET',
        }
      );

      if (response.status === 200) {
        const json = await response.json();
        setExpenses(json);
      }
    };

    fetchData();
  }, [budgetId, currentPage]);
  console.log('expenses: ', expenses);
  console.log('budgetId: ', budgetId);
  console.log('page: ', page);
  // Function to go to the next page
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Function to go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Modal show={budgetId != null} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Stack direction="horizontal" gap="2">
              <div>Expenses - Total element: {totalExpenses} </div>

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
            {totalExpenses > limit && currentPage > 1 && (
              <Button variant="primary" onClick={prevPage}>
                Previous
              </Button>
            )}
            {totalExpenses > limit && currentPage < totalPages && (
              <Button variant="primary" onClick={nextPage}>
                Next
              </Button>
            )}
          </Stack>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewExpenses;
export { deleteBudget };
