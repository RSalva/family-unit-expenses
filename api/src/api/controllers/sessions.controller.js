const createError = require('http-errors');
const User = require("../../lib/models/user.model");

const UserUnAuthorized = createError(
  401, 
  { 
    message: 'Invalid username or password', 
    errors: { password: 'Invalid username or password'}
  }
);

module.exports.create = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) next(UserUnAuthorized)
  else {
    const passwordMatch = await user.checkPassword(password);
    if (passwordMatch) {
      req.session.userId = user.id;
      res.status(201).json(user);
    } else next(UserUnAuthorized);
  }
}

module.exports.delete = async (req, res, next) => {
  await req.session.destroy();
  res.clearCookie('connect.sid');
  res.status(204).send();
}