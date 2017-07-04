const middles = require('./lib/middles.js');

// 處理HTTP 500
function http500(err, req, res, next) {
  global.logger.error(err);
  global.logger.error(`http 500 - ${req.path} - ${new Date().toString()}`);
  if (res.headersSent) {
    // 如果標頭已經傳送，則委派給Express預設的error handler處理(通常不會跑到這裡)
    return next(err);
  }
  // 如果是開發階段，就顯示所有錯誤
  if (process.env.NODE_ENV === 'dev') {
    return res.status(500).send(err);
  }
  // 如果是production階段，就只顯示HTTP 500
  return res.status(500).send('HTTP 500');
}

// 處理HTTP 404
function http404(req, res) {
  global.logger.warn(`http 404 - ${req.path}`);
  res.status(404).send('HTTP 404...');
}

module.exports = (app) => {
  // 掛載Router
  require('./router/api.js')(app);
  require('./router/mlmng_api.js')(app);
  require('./router/mlmng.js')(app);

  // app.get('/socket', (req, res) => {
  //   res.render('server/public/socket');
  // });


  // 根目錄不管怎樣都要有，否則Goolge LoadBalancer那邊會有點麻煩
  app.all('/', (req, res) => {
    res.send(' ');
  });

  app.use(http404);
  app.use(middles.errorHandler);
  app.use(http500);
};
