const cors = require('cors');
const config = require('../../lib/config');

module.exports = cors({
  origin: config.get('corsOrigins'),
  credentials: true
});
