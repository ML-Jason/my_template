const middles = require('./middles.js');

// 處理HTTP 500
function http500(err, req, res, next) {
  return res.status(500).send('HTTP 500...');
}

// 處理HTTP 404
function http404(req, res) {
  global.logger.log('warn', 'http 404 - ', req.path);
  res.status(404).send('HTTP 404...');
}

module.exports = (app) => {
  app.use('/api', require('./api')());
  app.all('/', (req, res) => {
    res.send('index');
  });

  app.use(middles.errorHandler);
  if (process.env.NODE_ENV !== 'dev') app.use(http500);
  app.use(http404);
};
