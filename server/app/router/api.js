const express = require('express');
const middles = require('../lib/middles.js');
const RateLimit = require('../lib/ratelimit.js');
const user = require('../control/user.js');
const login = require('../control/login.js');

module.exports = (app) => {
  const router = express.Router();
  router.use(middles.allowAll);
  router.use(middles.parseToken);
  const ratelimit = new RateLimit({ name: 'api', max: '60', time: '60' });
  router.use(ratelimit.rate);

  // require('./gm.js')(router);
  router.post('/login', login.login);
  router.all('/logout', login.logout);
  router.get('/verifylogin', middles.verifyToken, login.verifytoken);
  router.get('/updatetoken', login.updatetoken);
  router.get('/captcha', login.captcha);

  router.post('/user', middles.verifyToken, middles.needAdmin, user.adduser);
  router.get('/user/:id', middles.verifyToken, user.getuser);
  router.put('/user/:id', middles.verifyToken, user.setuser);
  router.delete('/user/:id', middles.verifyToken, middles.needAdmin, user.deluser);
  router.get('/users', middles.verifyToken, user.list);

  app.use('/api', router);
};
