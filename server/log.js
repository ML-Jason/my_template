/*
負責處理log的設定
*/
const path = require('path');
const fs = require('fs');
const log4js = require('log4js');

module.exports = (app) => {
  // 設定log的目錄
  const logDirectory = path.join(__dirname, 'log');
  if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

  // log4js的输出级别6个: trace, debug, info, warn, error, fatal
  log4js.configure({
    appenders: [
      { type: 'console' },
      {
        type: 'dateFile',
        filename: 'server/log/log4js',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
      },
    ],
    replaceConsole: true,
  });
  const log4 = log4js.getLogger('normal');
  // 設定為info之後的log才顯示
  log4.setLevel('INFO');
  app.use(log4js.connectLogger(log4));

  global.logger = log4;
};
