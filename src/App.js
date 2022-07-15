import Container from 'react-bootstrap/Container';
import {Button, Stack} from "react-bootstrap"
import BudgetCard from './components/BudgetCard';
import {useState} from 'react'
import AddBudgetModal from './components/addBudgetModal';
import AddExpenseModal from './components/addExpenseModal';
import { useBudgets } from './contexts/BudgetsContexts';

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [ addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState(null);
  const {budgets, getBudgetExpenses} = useBudgets();

  function openAddExpenseModal(budgetId){
    setShowAddBudgetModal(true);
    setAddExpenseModalBudgetId(budgetId);
  }
  return (
    <>
    <Container className='my-4'>
      <Stack direction='horizontal' gap="2" className="mb-4">
        <h1 className="me-auto">Budget Tracker</h1>
        <Button variant='primary' onClick={() => setShowAddBudgetModal(true)}>Add Budget</Button>
        <Button variant='outline-primary' onClick={openAddExpenseModal}>Add Expense</Button>
        </Stack>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', alignItems:'flex-start' }}></div>
        {budgets.map(budget => {
          const amount = getBudgetExpenses(budget.id).reduce((total, expense) => total + expense.amount, 0)
          return <BudgetCard  key= {budget.id} 
          name={budget.name} 
          amount={amount}
           max={budget.max}/>
           
          } ) }

        <BudgetCard  name="Food" amount={100} max={200}/>
    </Container>
    <AddBudgetModal show={showAddBudgetModal} handleClose={() => setShowAddBudgetModal(false)}/>
    <AddExpenseModal defaultBudgetId={addExpenseModalBudgetId} show={showAddExpenseModal} handleClose={() => setShowAddExpenseModal(false)}/>
    </>
   

  );
 
}

export default App;
