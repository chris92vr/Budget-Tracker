'use client';
import { useState, useEffect } from 'react';
import cookie from 'cookie';
import { Button, Spinner, Modal } from 'react-bootstrap';
import BudgetCard from '../components/BudgetCard';
import AddBudgetButton from '@/components/AddBudgetButton';
import AddExpenseButton from '@/components/AddExpensesButton';
import AddExpenseButtonById from '@/components/AddExpenseButtonById';
import ViewExpenses from '@/components/ViewExpensesButton';
import { deleteBudget } from '@/components/ViewExpensesButton';

export default function Home() {
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

      const res = await fetch('http://localhost:1337/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await res.json();

      setUser(userData);
      setLoading(false);

      const resBudget = await fetch('http://localhost:1337/api/budgets', {
        method: 'GET',
      });

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

  if (!user) {
    return (
      <div>
        <h1>Home</h1>
        <p>You are not logged in</p>
        <Button href="/login">Login</Button>
        <Button href="/register">Register</Button>
      </div>
    );
  } else if (
    !budget ||
    !Array.isArray(budget.data) ||
    budget.data.length === 0
  ) {
    return (
      <div>
        <h1>Home</h1>
        <p>Welcome {user.username}</p>
        <p>You have no budgets</p>
        <Button variant="primary" onClick={() => setShowAddBudgetButton(true)}>
          Add Budget
        </Button>
        <AddBudgetButton
          show={showAddBudgetButton}
          handleClose={() => setShowAddBudgetButton(false)}
        />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Home</h1>
        <p>Welcome {user.username}</p>
        <Button variant="primary" onClick={() => setShowAddBudgetButton(true)}>
          Add Budget
        </Button>
        <Button variant="primary" onClick={() => setShowAddExpenseButton(true)}>
          Add Expense
        </Button>

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
      </div>
    );
  }
}
