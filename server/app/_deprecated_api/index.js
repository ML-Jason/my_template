const express = require('express');
const middles = require('../lib/middles.js');
const RateLimit = require('../lib/ratelimit.js');

module.exports = () => {
  const router = express.Router();
  router.use(middles.allowAll);
  router.use(middles.parseToken);
  const ratelimit = new RateLimit({ name: 'api', max: '60', time: '60' });
  router.use(ratelimit.rate);

  require('./login.js')(router);
  require('./user.js')(router);
  require('./gm.js')(router);

  return router;
};
