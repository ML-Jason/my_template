const gm = require('gm');

module.exports = (router) => {
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
            if (err2) {
              global.logger.log('error', err2);
            }
            res.send('/image/out.jpg');
          });
      });
  });

  router.get('/gif', (req, res) => {
    gm('./server/public/image/s01.jpg')
      .in('-delay', '90')
      .in('-loop', '90')
      .in('./server/public/image/p*.jpg')
      .write('./server/public/image/out.gif', (err2) => {
        if (err2) {
          global.logger.log('error', err2);
        }
        res.send('/image/out.gif');
      });
  });
};
