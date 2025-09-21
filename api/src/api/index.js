const express = require("express");
const router = express.Router();
const { storage } = require("../lib/storage");

const {
  findUserById,
  session: { loadSessionUser, session },
  secure: { isAuthenticated, isAdmin },
  cors,
  errors
} = require("./middlewares");

const users = require("./controllers/users.controller");
const sessions = require("./controllers/sessions.controller");
const units = require("./controllers/units.controller");
const expenses = require("./controllers/expenses.controller");

router.use(cors);
router.use(session);
router.use(loadSessionUser);

// SESSIONS CRUD
router.post("/sessions", sessions.create);
router.delete("/sessions/me", sessions.delete);

// USERS CRUD
router.post("/users", storage.single("avatar"), users.create);
router.get("/users", isAuthenticated, users.list);
router.get("/users/:id", isAuthenticated, users.detail);
router.patch(
  "/users/:id",
  isAuthenticated,
  storage.single("avatar"),
  users.update
);
router.delete("/users/:id", isAuthenticated, isAdmin, users.delete);

//UNIT CRUD
router.post("/users/me/units", isAuthenticated, units.create);
router.get("/users/me/units", isAuthenticated, units.list);
router.get("/users/me/units/:id", isAuthenticated, units.detail);
router.patch("/users/me/units/:id", isAuthenticated, units.update)
router.delete("/users/me/units/:id", isAuthenticated, units.delete);

// UNITUSERS CRUD  
router.post("/users/me/units/:id/users/", isAuthenticated, units.addUsers);
router.delete("/users/me/units/:id/users/:userId", isAuthenticated, units.removeUser);

// EXPENSES CRUD
router.post("/users/me/units/:unitId/expenses", isAuthenticated, expenses.create);
router.get("/users/me/units/:unitId/expenses", isAuthenticated, expenses.list);
router.get("/users/me/units/:unitId/expenses/:id", isAuthenticated, expenses.detail);
router.patch("/users/me/units/:unitId/expenses/:id", isAuthenticated, expenses.update);
router.delete("/users/me/units/:unitId/expenses/:id", isAuthenticated, expenses.delete);

router.use(errors.routeNotFound);
router.use(errors.globalErrorHandler);

module.exports = router;
