const createError = require("http-errors");
const Expense = require('../models/expense.model');

const ExpenseNotFound = createError(409, {
  message: "Expense validation failed: expense: Expense does not exists",
  errors: { expense: "Expense does not exists" },
});

const ExpenseAlreadyExists = createError(409, {
  message: "Expense validation failed: expense: Expense already exists",
  errors: { expense: "Expense already exists" },
});

const ForbiddenAction = createError(403, {
  message: "Forbidden action: expense: Does not have the permission to do that",
  errors: { expense: "Does not have the permission to do that" },
});

const expenseBelongsToUnit = createError(400, {
  message: "Expense validation failed: expense: Expense does not belong to the specified unit",
  errors: { expense: "Expense does not belong to the specified unit" },
});

module.exports.create = async (req, res, next) => { 
  const { description, cost, paidBy, unitId, users } = req.body;

  const existingExpense = await Expense.findOne({ description, unit });
  if (existingExpense) throw ExpenseAlreadyExists;

  const expense = await Expense.create({
    description,
    cost,
    createdBy: req.sessionUser.id,
    paidBy,
    unit,
    users,
  });

  res.status(201).json(expense);
};

module.exports.list = async (req, res, next) => {
  const expenses = await Expense.find({ unit: req.params.unitId });
  res.status(200).json(expenses);
};

module.exports.detail = async (req, res, next) => {
  const id = req.params.id;

  const expense = await Expense.findById(id);
  if (!expense) throw ExpenseNotFound;

  if (doesExpenseBelongsToUnit(id, req.params.unitId)) throw expenseBelongsToUnit;

  res.status(200).json(expense);
};

module.exports.update = async (req, res, next) => {
  const id = req.params.id;
  const { description, cost, paidBy, users } = req.body;

  const expense = await Expense.findById(id);
  if (!expense) throw ExpenseNotFound;

  if (doesExpenseBelongsToUnit(id, req.params.unitId)) throw expenseBelongsToUnit;

  if (expense.createdBy !== req.sessionUser.id) throw ForbiddenAction;

  const updatedExpense = await Expense.findByIdAndUpdate(
    id,
    { description, cost, paidBy, users },
    { new: true, runValidators: true }
  );

  res.status(200).json(expense);
};

module.exports.delete = async (req, res, next) => {
  const id = req.params.id;

  const expense = await Expense.findById(id);
  if (!expense) throw ExpenseNotFound;

  if (doesExpenseBelongsToUnit(id, req.params.unitId)) throw expenseBelongsToUnit;

  if (expense.createdBy !== req.sessionUser.id) throw ForbiddenAction;

  await Expense.findByIdAndDelete(id);

  res.status(204).send();
};

const doesExpenseBelongsToUnit = async (id, unitId) => {
  const expense = await Expense.findById(id);
  if (!expense) throw ExpenseNotFound;

  return (expense.unit !== unitId);
};