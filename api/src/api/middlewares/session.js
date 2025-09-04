const config = require('../../lib/config');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('../../lib/models/user.model');

const session = expressSession({
  secret: config.get('session.secret'),
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: config.get('session.cookie.secure'),
    httpOnly: config.get('session.cookie.httpOnly'),
    maxAge: 60 * 60 * 24 * config.get('session.cookie.maxDays') * 1000
  },
  store: MongoStore.create({
    mongoUrl: config.get('db'),
    ttl: 60 * 60 * 24 * config.get('session.cookie.maxDays')
  })
});

const loadSessionUser = async (req, res, next) => {
  const { userId } = req.session;
  if (!userId) next();
  else {
    const user = await User.findById(userId);
    if (user) req.sessionUser = user;
    next();
  }
}

module.exports = {
  session,
  loadSessionUser
}