import React, { useState, useEffect, useRef } from "react";
import * as UnitsApi from "../../../services/units-api";
import { useForm } from "react-hook-form";

function ExpenseCreateForm({ unitId, onSubmit }) {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      description: "",
      cost: "",
      createdAt: "",
      paidBy: "",
      users: [],
    },
  });

  const [users, setUsers] = useState([]);
  const previousPaidBy = useRef(null);

  useEffect(() => {
    async function fetchUnitUsers() {
      console.log("Fetching users for unitId:", unitId);
      const unit = await UnitsApi.getUnitById(unitId);
      console.log("Fetched unit:", unit);
      setUsers(unit.users.map((user) => user.user));
    }
    fetchUnitUsers();
  }, [unitId]);

  const selectedUsers = watch("users");
  const selectedPaidBy = watch("paidBy");

  useEffect(() => {
    if (selectedPaidBy) {
      setValue("users", Array.from(new Set([...watch("users"), selectedPaidBy])));

      previousPaidBy.current = selectedPaidBy;
    }
  }, [selectedPaidBy, setValue, watch]);

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      cost: parseFloat(data.cost),
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
    };
    onSubmit(formattedData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-3 border rounded shadow-sm">
      <h5 className="text-primary mb-3">Create Expense</h5>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <input
          type="text"
          className="form-control"
          {...register("description", { required: "Description is required" })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Cost</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          {...register("cost", { required: "Cost is required" })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Created At (Optional)</label>
        <input
          type="datetime-local"
          className="form-control"
          {...register("createdAt")}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Paid By</label>
        <select className="form-select" {...register("paidBy", { required: "Paid by is required" })}>
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Add Users</label>
        <div className="form-check">
          {users.map((user) => (
            <div key={user.id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                value={user.id}
                {...register("users")}
                checked={watch("users").includes(user.id)}
              />
              <label className="form-check-label">{user.username}</label>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Create Expense
      </button>
    </form>
  );
}

export default ExpenseCreateForm;