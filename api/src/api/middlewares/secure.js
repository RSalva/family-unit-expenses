const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
  if (req.sessionUser) next();
  else next(createError(401, 'Missing credentials'));
}

module.exports.isAdmin = (req, res, next) => {
  if (req.sessionUser.role === 'admin') next();
  else next(createError(403, 'Forbidden access'));
}

