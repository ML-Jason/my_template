const express = require('express');
const middles = require('../middles.js');

module.exports = () => {
  const router = express.Router();
  router.use(middles.allowAll);
  require('./login.js')(router);
  // require('./router/repo.js')(router);
  return router;
};
