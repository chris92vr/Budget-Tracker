'use client';
import { useState, useEffect } from 'react';
import cookie from 'cookie';
import { Button, Spinner, Modal, Stack, Container } from 'react-bootstrap';
import BudgetCard from '../components/BudgetCard';
import AddBudgetButton from '@/components/AddBudgetButton';
import AddExpenseButton from '@/components/AddExpensesButton';
import AddExpenseButtonById from '@/components/AddExpenseButtonById';
import ViewExpenses from '@/components/ViewExpensesButton';
import { deleteBudget } from '@/components/ViewExpensesButton';
import CurrentDate from '@/components/CurrentDate';

export default function Home() {
  console.log('API_URL: ', process.env.NEXT_PUBLIC_API_URL);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(null);
  const [showAddBudgetButton, setShowAddBudgetButton] = useState(false);
  const [showAddExpenseButton, setShowAddExpenseButton] = useState(false);
  const [showAddExpenseButtonById, setShowAddExpenseButtonById] =
    useState(false);
  const [addExpenseButtonByBudgetId, setAddExpenseButtonByBudgetId] =
    useState();
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState();

  // calculate total amount
  let totalAmount = 0;
  let totalMax = 0;

  if (budget && Array.isArray(budget.data)) {
    budget.data.forEach((item) => {
      totalAmount += item.attributes.total;
      totalMax += item.attributes.max;
    });
  }

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const cookies = typeof window !== 'undefined' ? document.cookie : '';
      const { token } = cookie.parse(cookies);

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

      if (!res.ok) {
        console.error('API request failed with status ' + res.status);
        return;
      }

      const userData = await res.json();

      setUser(userData);
      console.log('userData: ', userData);
      setLoading(false);

      const resBudget = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          'api/budgets?filters[user_id]=' +
          userData.id,
        {
          method: 'GET',
        }
      );

      console.log('resBudget: ', resBudget);

      const budgetData = await resBudget.json();
      console.log('budgetData: ', budgetData);
      setBudget(budgetData);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="overlay">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!budget || !Array.isArray(budget.data) || budget.data.length === 0) {
    return (
      <Container className="my-4">
        <Stack direction="horizontal" className="mt-4 mb-4">
          <h1 className=" me-auto">Budget Tracker © </h1>
          <CurrentDate />
        </Stack>

        <Stack direction="horizontal" gap="2" className="mt-4 mb-4">
          <Button
            variant="primary"
            onClick={() => setShowAddBudgetButton(true)}
          >
            Add Budget
          </Button>

          <h3 className=" me-auto">
            No Budgets Yet. Add a Budget to get started.
          </h3>
        </Stack>
        <AddBudgetButton
          show={showAddBudgetButton}
          handleClose={() => setShowAddBudgetButton(false)}
        />
      </Container>
    );
  } else {
    return (
      <Container className="my-4">
        <Stack direction="horizontal" className="mt-4 mb-4">
          <h1 className=" me-auto">Budget Tracker © </h1>
          <CurrentDate />
        </Stack>

        <Stack direction="horizontal" gap="2" className="mt-4 mb-4">
          <Button
            variant="primary"
            onClick={() => setShowAddBudgetButton(true)}
          >
            Add Budget
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowAddExpenseButton(true)}
          >
            Add Expense
          </Button>
        </Stack>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {budget &&
            Array.isArray(budget.data) &&
            budget.data.map((item) => (
              <BudgetCard
                key={item.id}
                name={item.attributes.name}
                amount={item.attributes.total}
                max={item.attributes.max}
                onAddExpenseClick={() => setAddExpenseButtonByBudgetId(item.id)}
                onViewExpensesClick={() => {
                  setViewExpensesModalBudgetId(item.id);
                }}
                onDeleteClick={() => {
                  if (confirm('Are you sure you want to delete this budget?'))
                    deleteBudget(item.id);
                }}
              />
            ))}
          <BudgetCard
            name="Total"
            amount={totalAmount}
            max={totalMax}
            gray
            hideButtons
          />
        </div>
        <AddBudgetButton
          show={showAddBudgetButton}
          handleClose={() => setShowAddBudgetButton(false)}
        />
        <AddExpenseButton
          show={showAddExpenseButton}
          handleClose={() => setShowAddExpenseButton(false)}
        />
        <AddExpenseButtonById
          budgetId={addExpenseButtonByBudgetId}
          show={addExpenseButtonByBudgetId}
          handleClose={() => setAddExpenseButtonByBudgetId(false)}
        />
        <ViewExpenses
          budgetId={viewExpensesModalBudgetId}
          handleClose={() => setViewExpensesModalBudgetId()}
        />
      </Container>
    );
  }
}
