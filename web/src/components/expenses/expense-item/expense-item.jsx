import React, { useEffect, useState } from "react";
import * as ExpensesApi from "../../../services/expenses-api";
import { ClipLoader } from "react-spinners";

function ExpenseItem({ expense, unitId }) {
  const [detailedExpense, setDetailedExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const fetchedExpense = await ExpensesApi.getExpenseById(unitId, expense.id);
        setDetailedExpense(fetchedExpense);
      } catch (err) {
        setError("Failed to load expense details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseDetails();
  }, [unitId, expense.id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50px" }}>
        <ClipLoader color="#007bff" size={20} />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title">{detailedExpense.description}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Cost: {detailedExpense.cost.toFixed(2)}€</h6>
          <p className="card-text">
            <strong>Created By:</strong> {detailedExpense.createdBy.username}<br />
            <strong>Paid By:</strong> {detailedExpense.paidBy.username}<br />
            <strong>Users:</strong> {detailedExpense.users.map(user => user.username).join(", ")}<br />
            <strong>Created At:</strong> {new Date(detailedExpense.createdAt).toLocaleDateString()}<br />
          </p>
        </div>
        <button
          className="btn btn-danger btn-sm"
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete this expense?")) {
              try {
                await ExpensesApi.deleteExpense(unitId, expense.id);
                alert("Expense deleted successfully!");
                window.location.reload();
              } catch (error) {
                console.error("Error deleting expense:", error);
                alert("Failed to delete expense. Please try again.");
              }
            }
          }}
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

export default ExpenseItem;