const express = require('express');
const middles = require('../middles.js');
const gm = require('gm');

module.exports = () => {
  const router = express.Router();
  router.use(middles.allowAll);
  require('./login.js')(router);
  // require('./router/repo.js')(router);

  router.get('/gm', (req, res) => {
    gm()
      .in('-page', '+0+0')
      .in('../../public/image/FB_share_1200x630.jpg')
      .in('-page', '+500+200')
      .in('../../public/image/caption.png')
      .drawText(100, 100, '這是測試')
      .write('../../public/image/out.jpg', () => {
        res.send('/image/out.jpg');
      });
  });
  return router;
};
