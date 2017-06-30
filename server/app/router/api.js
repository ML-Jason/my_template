const express = require('express');
const RateLimit = require('../lib/ratelimit.js');
// const login = require('../control/login.js');
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

  // 設定api的ratelimit
  const ratelimit = new RateLimit({ name: 'api', max: '120', time: '60' });
  router.use(ratelimit.rate);

  // 上傳檔案
  router.post('/upload', upload.upload);
  router.post('/uploadBase64', upload.uploadBase64);

  app.use('/api', router);
};
