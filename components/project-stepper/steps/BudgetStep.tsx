
import React from 'react'

interface BudgetStepProps {
  budget: number | undefined
  setBudget: (newBudget: number) => void
}

const BudgetStep: React.FC<BudgetStepProps> = ({ budget, setBudget }) => {
  const budgetOptions = []
  for (let i = 0; i <= 500; i += 50) {
    budgetOptions.push(i)
  }
  for (let i = 500; i <= 25000; i += 500) {
    budgetOptions.push(i)
  }

  return (
    <div>
      <h3>Please select your room budget</h3>
      <select value={budget} onChange={e => setBudget(Number(e.target.value))}>
        <option value="">Select Budget</option>
        {budgetOptions.map(value => (
          <option key={value} value={value}>
            ${value.toLocaleString()}
          </option>
        ))}
      </select>
    </div>
  )
}

export default BudgetStep
