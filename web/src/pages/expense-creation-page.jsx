import { PageLayout } from "../components/layouts";
import { Link, useNavigate, useLocation } from "react-router";
import { ExpenseCreateForm } from "../components/expenses";
import { useAuth } from "../contexts/auth";
import { useEffect, useState } from "react";
import * as UnitsApi from "../services/units-api";
import * as ExpensesApi from "../services/expenses-api";

function ExpenseCreationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const unitId = location.state?.unitId;

  useEffect(() => {
    async function fetchUnit() {
      const unit = await UnitsApi.getUnitById(unitId);
      setUsers(unit.users.map((user) => user.user));
    }
    fetchUnit();
  }, [unitId]);

  const handleExpenseSubmit = async (expenseData) => {
    try {
      console.log("Submitting expense data:", expenseData);
      console.log("For unitId:", unitId);
      await ExpensesApi.createExpense(
        unitId,
        expenseData,
      );
      alert("Expense created successfully!");
      navigate(`/units/${unitId}`);
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Failed to create expense. Please try again.");
    }
  };

  return (
    <PageLayout>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h3 className="fw-light">Create Expense</h3>
          <ExpenseCreateForm unitId={unitId} users={users} onSubmit={handleExpenseSubmit} />
          <hr className="my-2" />
          <button
            className="btn btn-secondary fw-light w-100 btn-sm"
            onClick={() => navigate(`/units/${unitId}`)}
          >
            BACK TO UNIT
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

export default ExpenseCreationPage;
