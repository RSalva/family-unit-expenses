const createError = require("http-errors");
const Expense = require('../../lib/models/expense.model');
const Unit = require('../../lib/models/unit.model');
const UnitUser = require('../../lib/models/unitUser.model');
const mongoose = require("mongoose");

const ExpenseNotFound = createError(409, {
  message: "Expense validation failed: expense: Expense does not exists",
  errors: { expense: "Expense does not exists" },
});

/*
const ExpenseAlreadyExists = createError(409, {
  message: "Expense validation failed: expense: Expense already exists",
  errors: { expense: "Expense already exists" },
});
*/

const ForbiddenAction = createError(403, {
  message: "Forbidden action: expense: Does not have the permission to do that",
  errors: { expense: "Does not have the permission to do that" },
});

const ExpenseDoesNotBelongToUnit = createError(401, {
  message: "Expense validation failed: expense: Expense does not belong to the specified unit",
  errors: { expense: "Expense does not belong to the specified unit" },
});

const ExpensePaidByUserOutsideUnit = createError(401, {
  message: "Expense validation failed: expense: The user that paid the expense is not part of the unit",
  errors: { expense: "The user that paid the expense is not part of the unit" },
});

const UserDoesNotBelongToUnit = createError(401, {
  message: "Expense validation failed: expense: The user does not belong to the unit",
  errors: { expense: "The user does not belong to the unit" },
});

module.exports.create = async (req, res, next) => { 
  const { description, cost, paidBy, users } = req.body;
  const unitId = req.params.unitId;

  if (!users.includes(paidBy)) throw ExpensePaidByUserOutsideUnit;

  const unitUsers = await UnitUser.find({ unit: unitId }).select("user");
  const unitUserIds = unitUsers.map((unitUser) => unitUser.user.toString());

  const invalidUsers = users.filter((user) => !unitUserIds.includes(user));
  if (invalidUsers.length > 0) throw UserDoesNotBelongToUnit;

  const usersObjectIds = users.map((user) => new mongoose.Types.ObjectId(`${user}`));

  const expense = await Expense.create({
    description,
    cost,
    createdBy: new mongoose.Types.ObjectId(`${req.sessionUser.id}`),
    paidBy: new mongoose.Types.ObjectId(`${paidBy}`),
    unit: new mongoose.Types.ObjectId(`${unitId}`),
    users: usersObjectIds,
    createdAt: Date.now()
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

  if (! await doesExpenseBelongsToUnit(expense, req.params.unitId)) throw ExpenseDoesNotBelongToUnit;

  res.status(200).json(expense);
};

module.exports.update = async (req, res, next) => {
  const permittedParams = ["description", "cost", "paidBy", "users"];

  // never trust input data. whitelist params!!!
  Object.keys(req.body).forEach((key) => {
    if (!permittedParams.includes(key)) {
      delete req.body[key];
    }
  });

  const id = req.params.id;
  const { description, cost, paidBy, users } = req.body;

  const expense = await Expense.findById(id);
  if (!expense) throw ExpenseNotFound;

  if (! await doesExpenseBelongsToUnit(expense, req.params.unitId)) throw ExpenseDoesNotBelongToUnit;

  if (expense.createdBy.toString() !== req.sessionUser.id) throw ForbiddenAction;

  const updatedExpense = await Expense.findByIdAndUpdate(
    id,
    { 
      description: description || expense.description, 
      cost: cost || expense.cost, 
      paidBy: paidBy ? new mongoose.Types.ObjectId(`${paidBy}`) : expense.paidBy, 
      users: users ? users.map((user) => new mongoose.Types.ObjectId(`${user}`)) : expense.users
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedExpense);
};

module.exports.delete = async (req, res, next) => {
  const id = req.params.id;

  const expense = await Expense.findById(id);
  if (!expense) throw ExpenseNotFound;

  if (! await doesExpenseBelongsToUnit(expense, req.params.unitId)) throw ExpenseBelongsToUnit;

  if (expense.createdBy.toString() !== req.sessionUser.id) throw ForbiddenAction;

  await Expense.findByIdAndDelete(id);

  res.status(204).send();
};

const doesExpenseBelongsToUnit = async (expense, unitId) => {
  return (expense.unit.toString() === unitId);
};