const crypto = require('crypto');
const User = require('../model/model.js')('mlmngusers', 'user');
const validators = require('../lib/validators.js');

const fn = {};

// 如果DB裡沒有帳號的話(一開始 or 不小心被砍)，新增一個admin
fn.checkUserNumber = () => {
  User.findOne({ role: 'admin', active: 'active' }).exec((err, d) => {
    if (err) global.logger.error(err);
    if (!d) {
      global.logger.warn('沒有管理者帳號，新增一個');
      const md5 = crypto.createHash('md5');
      const newuser = new User({
        username: 'admin',
        userpwd: md5.update('medialand').digest('hex'),
        role: 'admin',
        active: 'active',
      });
      newuser.save((err2) => {
        if (err2) global.logger.error(err2);
      });
    }
  });
};
fn.checkUserNumber();

fn.adduser = (req, res, next) => {
  // 驗證帳號
  const username = validators.toStr(req.body.uname, { min: 5, max: 50 });
  if (username === '') return next('E002001');
  if (validators.test(username, '([^a-zA-Z0-9_@.])')) return next('E002004');

  // 驗證密碼
  let userpwd = validators.toStr(req.body.upwd, { min: 5, max: 20 });
  if (userpwd === '') return next('E002002');
  if (validators.test(userpwd, '([^a-zA-Z0-9_@.])')) return next('E002004');

  // 驗證身份
  let role = validators.toNormalStr(req.body.role);
  if (role !== 'admin') role = 'user';

  // 驗證帳號狀態
  let active = validators.toNormalStr(req.body.active);
  if (active !== 'active') active = 'stop';

  const md5 = crypto.createHash('md5');
  userpwd = md5.update(userpwd).digest('hex');

  const newUser = new User({
    username,
    userpwd,
    role,
    active,
  });
  return newUser.save((err, d) => {
    if (err) {
      if (err.code.toString() === '11000') {
        next('E002008');
      } else {
        next(err);
      }
    } else {
      res.json({
        status: 'OK',
        data: { userid: d._id },
      });
    }
  });
};

/**
 * @api {get} /auth/api/user/:id 取得某個user的資料
 * @apiGroup User
 * @apiName InfoUser
 * @apiVersion 0.0.2
 *
 * @apiUse AuthHeader
 *
 * @apiParam {String} id 使用者的id
 *
 * @apiSuccess {String} status api回傳狀態，成功時回傳'OK'
 * @apiSuccess {Array} data 使用者的資料物件
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    'status': 'OK',
 *    'data': {},
 *  }
 *
 * @apiUse CustomError
 *
 * @apiSampleRequest /auth/api/user
 */
fn.getuser = (req, res, next) => {
  const _id = validators.toNormalStr(req.params.id);
  if (!_id) {
    next('E004001');
  } else {
    User.findOne({ _id }).exec((err, d) => {
      if (err) return next(err);
      return res.json({ status: 'OK', data: d });
    });
  }
};

/**
 * @api {put} /auth/api/user/:id 修改使用者
 * @apiGroup User
 * @apiName ModUser
 * @apiVersion 0.0.2
 *
 * @apiUse AuthHeader
 *
 * @apiParam {String} id 使用者的id
 * @apiParam {String{5..20}} [upwd] 使用者密碼，5-20個英文、數字的組合(規則與Email相同，可使用@_與.)
 * @apiParam {String} role 使用者權限
 * @apiParam {Number} active 使用者帳號狀態
 * @apiParamExample Request-Example:
 *  {
 *    'upwd': 'mypassword',
 *    'role': 'admin',
 *    'active': 1
 *  }
 *
 * @apiSuccess {String} status api回傳狀態，成功時回傳'OK'
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    'status': 'OK'
 *  }
 *
 * @apiUse CustomError
 *
 * @apiSampleRequest /auth/api/user
 */
fn.setuser = (req, res, next) => {
  const _id = validators.toNormalStr(req.params.id);
  if (_id === '') return next('E004001');

  if (res.locals._payload.i !== _id) {
    // 權限不足，不能修改別人的帳號
    if (res.locals._user.role !== 'admin') return next('E002007');
  }

  const data = { _id };
  // 驗證帳號
  const username = validators.toStr(req.body.uname, { min: 5, max: 50 });
  if (username === '') return next('E002001');
  if (validators.test(username, '([^a-zA-Z0-9_@.])')) return next('E002004');
  data.username = username;

  if (req.body.upwd) {
    let userpwd = validators.toStr(req.body.upwd, { min: 5, max: 20 });
    if (userpwd === '') return next('E002002');
    if (validators.test(userpwd, '([^a-zA-Z0-9_@.])')) return next('E002004');
    const md5 = crypto.createHash('md5');
    userpwd = md5.update(userpwd).digest('hex');
    data.userpwd = userpwd;
  }

  let role = validators.toNormalStr(req.body.role);
  let active = validators.toNormalStr(req.body.active);
  // 只有admin才可以修改使用者的權限及狀態
  if (res.locals._user.role === 'admin') {
    if (role !== 'admin') role = 'user';
    data.role = role;
    if (active !== 'active') active = 'stop';
    data.active = active;
  }

  // 先確認帳號是否有衝到
  return User.findOne({ username, _id: { $ne: _id } }).lean().exec((cherr, chd) => {
    if (cherr) return next(cherr);
    if (chd) return next('E002008');
    return User.update({ _id }, data).exec((err) => {
      if (err) {
        next(err);
      } else {
        res.json({ status: 'OK' });
      }
    });
  });
};
/**
 * @api {delete} /auth/api/user/:id 刪除使用者
 * @apiGroup User
 * @apiName DeleteUser
 * @apiVersion 0.0.2
 *
 * @apiUse AuthHeader
 *
 * @apiParam {String} id 使用者id
 *
 * @apiSuccess {String} status api回傳狀態，成功時回傳'OK'
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "status": "OK"
 *  }
 *
 * @apiUse CustomError
 *
 * @apiSampleRequest /auth/api/user
 */
fn.deluser = (req, res, next) => {
  const _id = validators.toNormalStr(req.params.id);
  if (!_id) {
    next('E004001');
  } else {
    User.find({ _id }).remove((err) => {
      if (err) return next(err);
      fn.checkUserNumber();
      return res.json({ status: 'OK' });
    });
  }
  return '';
};
/**
 * @api {get} /auth/api/users 取得user列表
 * @apiGroup User
 * @apiName ListUser
 * @apiVersion 0.0.2
 *
 * @apiUse AuthHeader
 *
 * @apiSuccess {String} status api回傳狀態，成功時回傳'OK'
 * @apiSuccess {Array} data 使用者的資料陣列
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    'status': 'OK',
 *    'data': [],
 *  }
 *
 * @apiUse CustomError
 *
 * @apiSampleRequest /auth/api/users
 */
fn.list = (req, res, next) => {
  User.find().exec((err, d) => {
    if (err) return next(err);
    return res.json({
      status: 'OK',
      data: d,
    });
  });
};
module.exports = fn;
