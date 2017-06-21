const express = require('express');
const middles = require('../lib/middles.js');
const RateLimit = require('../lib/ratelimit.js');
const user = require('../control/user.js');
const login = require('../control/login.js');
const upload = require('../control/upload.js');
const cors = require('cors');


module.exports = (app) => {
  const router = express.Router();

  // 針對/api開啟CORS，如果要對所有網站開啟，則將origin設為true
  const corsOption = {
    origin: global.config.ALLOW_DOMAIN,
    optionsSuccessStatus: 200,
  };
  // 對所有路徑Enable CORS Pre-flight
  router.options('*', cors(corsOption));
  // 套用CORS
  router.use(cors(corsOption));

  // api都需要先parse token
  router.use(middles.parseToken);

  // 設定api的ratelimit
  const ratelimit = new RateLimit({ name: 'api', max: '120', time: '60' });
  router.use(ratelimit.rate);

  // 登入相關
  router.post('/login', login.login);
  router.all('/logout', login.logout);
  router.get('/verifylogin', middles.verifyToken, login.verifytoken);
  router.get('/updatetoken', login.updatetoken);
  router.get('/captcha', login.captcha);

  // 後台使用者相關
  router.post('/user', middles.verifyToken, middles.needAdmin, user.adduser);
  router.get('/user/:id', middles.verifyToken, user.getuser);
  router.put('/user/:id', middles.verifyToken, user.setuser);
  router.delete('/user/:id', middles.verifyToken, middles.needAdmin, user.deluser);
  router.get('/users', middles.verifyToken, user.list);

  // 上傳檔案
  router.post('/upload', upload.upload);
  router.post('/uploadBase64', upload.uploadBase64);

  app.use('/api', router);
};
