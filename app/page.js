'use client';
import { useState, useEffect } from 'react';
import cookie from 'cookie';
import { Button } from 'react-bootstrap';
import BudgetCard from '../components/BudgetCard';
import { useRef } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(null);
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
      setLoading(false);

      const resBudget = await fetch('http://localhost:1337/api/budgets', {
        method: 'GET',
      });

      console.log('resBudget: ', resBudget);

      const budgetData = await resBudget.json();
      console.log('budgetData: ', budgetData);
      setBudget(budgetData);

    

  
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
  } else if (!budget) {
    return (
      <div>
        <h1>Home</h1>
        <p>Welcome {user.username}</p>
        <p>You have no budgets</p>
        <Button href="/budgets/new">Create Budget</Button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Home</h1>
        <p>Welcome {user.username}</p>
        <Button href="/budgets/new">Create Budget</Button>
        {budget &&
          Array.isArray(budget.data) &&
          budget.data.map((item) => (
            <BudgetCard
              key={item.id}
              name={item.attributes.name}
              amount={item.attributes.total}
              max={item.attributes.max}
              onAddExpenseClick={() => {
                console.log('add expense clicked');
              }}
              onViewExpensesClick={() => {
                console.log('view expenses clicked');
              }}
              onDeleteClick={() => {
                console.log('delete clicked');
              }}
            />
          ))}
          <BudgetCard
           name='Total'
            amount={totalAmount}
            max={totalMax}
            gray
            hideButtons
          />
      </div>
    );
  }
}
