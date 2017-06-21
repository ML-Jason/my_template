const errCodes = require('../errorCodes.js');
const jwt = require('jsonwebtoken');
const User = require('../model/model.js')('mlmngusers', 'user');

const middles = {};

// 開放來自任何網域的api call
// middles.allowAll = (req, res, next) => {
//   if (process.env.NODE_ENV === 'dev') {
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Authorization');
//     res.header('Access-Control-Allow-Origin', '*');
//   }
//   next();
// };

// 解析token
middles.parseToken = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const t = req.headers.authorization.split(' ')[1];
    jwt.verify(t, global.config.JWT_SECRET, (err, d) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') res.locals._err = 'E003001';
        if (err.name === 'TokenExpiredError') res.locals._err = 'E003002';
      } else {
        res.locals._payload = d;
        res.locals._token = t;
      }
      next();
    });
  } else {
    res.locals._err = 'E003001';
    next();
  }
};

middles.needAdmin = (req, res, next) => {
  if (res.locals._user.role !== 'admin') {
    next('E002007');
  } else {
    next();
  }
};

// 從DB驗證token是否真的合法
middles.verifyToken = (req, res, next) => {
  // 先確定token是否有parse成功
  if (res.locals._err) {
    next(res.locals._err);
  } else {
    User.findOne({ _id: res.locals._payload.i, token: res.locals._token }, '_id username role active', (err, d) => {
      if (err) return next(err);
      if (d) {
        // 帳號被停止
        if (d.active === 'stop') return next('E002006');
        res.locals._user = {
          userid: d._id,
          username: d.username,
          role: d.role || '',
          token: res.locals._token,
          exp: res.locals._payload.exp,
        };
        return next();
      }
      // 查無此人，或是token跟user對不起來
      return next('E003001');
    });
  }
};

// 處理error
middles.errorHandler = (err, req, res, next) => {
  global.logger.log('error', 'errorHandler');
  if (err) {
    if (typeof err === 'string') {
      global.logger.log('error', err);
      if (err.substr(0, 1) === 'E') {
        res.json({ status: 'ERROR', err: errCodes.get(err) });
      } else {
        res.json({ status: 'ERROR', err: { message: err } });
      }
    } else next(err);
  }
};

module.exports = middles;
