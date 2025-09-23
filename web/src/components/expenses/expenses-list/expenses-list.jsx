import React from "react";
import { useNavigate } from "react-router-dom";
import ExpenseItem from "../expense-item/expense-item";

function ExpensesList({ expenses, unitId }) {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary fw-bold">
          <i className="fa fa-money-bill-wave me-2"></i>Expenses
        </h3>
        <button
          className="btn btn-primary shadow-sm"
          onClick={() =>
            navigate(`/expenses/create`, { state: { unitId } })
          }
        >
          <i className="fa fa-plus me-2"></i>Create Expense
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center p-4 bg-light rounded shadow-sm">
          <i className="fa fa-folder-open text-muted fa-3x mb-3"></i>
          <p className="text-muted">No expenses have been added yet.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {expenses.map((expense) => (
            <div className="col" key={expense.id}>
              <ExpenseItem expense={expense} unitId={unitId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpensesList;