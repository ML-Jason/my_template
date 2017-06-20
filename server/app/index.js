const middles = require('./lib/middles.js');

// 處理HTTP 500
function http500(err, req, res, next) {
  global.logger.log('error', 'http 500 - ', req.path);
  if (res.headersSent) {
    // 如果標頭已經傳送，則委派給Express預設的error handler處理
    return next(err);
  }
  // 如果是開發階段，就顯示所有錯誤
  if (process.env.NODE_ENV === 'dev') {
    return res.status(500).send(err);
  }
  return res.status(500).send('HTTP 500');
}

// 處理HTTP 404
function http404(req, res) {
  global.logger.log('warn', 'http 404 - ', req.path);
  res.status(404).send('HTTP 404...');
}

module.exports = (app) => {
  require('./router/api.js')(app);
  require('./router/mlmng.js')(app);
  // app.get('/socket', (req, res) => {
  //   res.render('server/public/socket');
  // });
  // app.all('/', (req, res) => {
  //   res.send('index');
  // });

  app.use(http404);
  app.use(middles.errorHandler);
  app.use(http500);
};
