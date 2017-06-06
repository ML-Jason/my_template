const express = require('express');
const middles = require('../middles.js');

module.exports = () => {
  const router = express.Router();
  router.use(middles.allowAll);
  router.use(middles.parseToken);
  require('./login.js')(router);
  require('./user.js')(router);
  require('./gm.js')(router);

  return router;
};
