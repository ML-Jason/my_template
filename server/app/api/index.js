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
      .command('composite')
      .in('-page', '+0+0')
      .in('./server/public/image/caption.png')
      .in('-page', '+0+0')
      .in('./server/public/image/FB_share_1200x630.jpg')
      .toBuffer('PNG', (err, buffer) => {
        gm(buffer)
          .font('./server/public/fonts/msjh.ttf')
          .fontSize(36)
          .fill('black')
          .drawText(10, 36, '中文TEST!!', 'NorthWest')
          .write('./server/public/image/out.jpg', (err2) => {
            global.logger.log('error', err2);
            res.send('/image/out.jpg');
          });
      });
  });
  return router;
};
