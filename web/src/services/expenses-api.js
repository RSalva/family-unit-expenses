import http from './api-service';

export const createExpense = (unitId, expense) => {
  console.log("Creating expense for unitId:", unitId);
  console.log("Expense data:", expense);
  return http.post(`/users/me/units/${unitId}/expenses`, expense);
};

export const getExpenses = (unitId) => {+
  console.log("Getting expenses for unitId:", unitId);
  return http.get(`/users/me/units/${unitId}/expenses`);
}

export const getExpenseById = (unitId, expenseId) => {
  return http.get(`/users/me/units/${unitId}/expenses/${expenseId}`);
}

export const updateExpense = (unitId, expenseId, expense) => {
  return http.patch(`/users/me/units/${unitId}/expenses/${expenseId}`, expense);
}

export const deleteExpense = (unitId, expenseId) => {
  return http.delete(`/users/me/units/${unitId}/expenses/${expenseId}`);
}