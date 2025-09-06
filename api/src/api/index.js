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

router.use(errors.routeNotFound);
router.use(errors.globalErrorHandler);

module.exports = router;
