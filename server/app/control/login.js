const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
const User = require('../model/model.js')('mlmngusers', 'user');
const Captcha = require('../model/model.js')('captchas', 'captcha');
const validators = require('../lib/validators.js');

const fn = {};

/**
 * @api {post} /auth/api/login 登入
 * @apiGroup Login
 * @apiName LoginUser
 * @apiVersion 0.0.2
 *
 * @apiDescription
 *  登入成功後系統會給予一個token，之後的其他api都會用這個token來當作身份驗證。<br>
 *  login時並不需要加入Http header:Authorization，除非是要使用secret進行server之間的登入驗證。
 *
 * @apiParam {String{5..20}} uname 使用者名稱，5-50個英文、數字的組合(規則與Email相同，可使用@_與.)
 * @apiParam {String{5..20}} upwd 使用者密碼，5-20個英文、數字的組合(規則與Email相同，可使用@_與.)
 * @apiParam {String} codes 驗證碼
 * @apiParamExample Request-Example:
 *  {
 *    'uname': 'jason',
 *    'upwd': 'mypassword',
 *    'codes': '3Q3r',
 *  }
 *
 * @apiSuccess {String} status api回傳狀態，成功時回傳'OK'
 * @apiSuccess {Object} data
 *  登入的帳號資訊，是一個Object：{ 'username':'使用者名稱', 'token':'Access-token' }
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  'status': 'OK',
 *  'data': {
 *    'username': '使用者名稱‘,
 *    'userid': '使用者id',
 *    'token': 'Access-token',
 *    'role': '使用者的role'
 *  }
 * }
 *
 * @apiUse CustomError
 *
 * @apiSampleRequest /auth/api/login
 */
fn.login = (req, res, next) => {
  // 驗證帳號
  const username = validators.toNormalStr(req.body.uname, { min: 5, max: 50 });
  if (username === '') return next('E002003');

  // 驗證密碼
  const userpwd = validators.toNormalStr(req.body.upwd, { min: 5, max: 20 });
  if (userpwd === '') return next('E002003');

  // 驗證驗證碼
  const codes = validators.toAlphanumeric(req.body.codes);
  if (codes === '') return next('E002005');

  // 看是否有符合key的captcha
  return Captcha.findOne({ captcha: codes.toLowerCase() }).lean().exec((err, d) => {
    if (err) return next(err);
    if (!d) return next('E002005');
    Captcha.remove({ _id: d._id }).exec();
    // 如果驗證碼通過，就驗證是登入帳密
    return User.findOne({ username }).lean().exec((err2, d2) => {
      if (err2) return next(err2);
      if (d2) {
        // 帳號被停權的情況
        if (d2.active === 'stop') return next('E002006');
        const md5 = crypto.createHash('md5');
        if (d2.userpwd === md5.update(userpwd).digest('hex')) {
          const payload = { i: d2._id };
          // 產生token
          const token = jwt.sign(payload, global.config.JWT_SECRET, { expiresIn: '1d' });
          return User.update({ _id: d2._id }, { token, logindate: Date.now() }).exec(() => {
            res.json({
              status: 'OK',
              data: { username, userid: d2._id, role: d2.role, token },
            });
          });
        }
      }
      // 帳號或密碼不對
      return next('E002003');
    });
  });
};

/**
 * @api {all} /auth/api/logout 登出
 * @apiGroup Login
 * @apiName LogoutUser
 * @apiVersion 0.0.2
 *
 * @apiDescription
 *  登出的帳號是以Http header裡所帶的token帳號為主。<br>
 *  登出後，原本的token將會失效。
 *
 * @apiUse AuthHeader
 *
 * @apiSuccess {String} status api回傳狀態，成功時回傳'OK'
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  'status': 'OK',
 * }
 *
 * @apiSampleRequest /auth/api/logout
 */
fn.logout = (req, res) => {
  if (req._payload) {
    if (req._payload.i) {
      const _id = req._payload.i;
      User.update({ _id }, { token: '' }, () => {
      });
    }
  }
  res.json({ status: 'OK' });
};

/**
 * @api {get} /auth/api/verifylogin 驗證使用者token
 * @apiGroup Login
 * @apiName VerifyUser
 * @apiVersion 0.0.2
 *
 * @apiDescription
 *  帶入token，驗證token是否合法。<br>
 *  如果合法，會回傳使用者的資訊(_id，username，role)
 *
 * @apiUse AuthHeader
 *
 * @apiSuccess {String} status api回傳狀態，成功時回傳'OK'
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  'status': 'OK',
 *  'data': {
 *    'username': '使用者名稱',
 *    'userid': '使用者id',
 *    'token': 'Access-token',
 *    'role': '使用者的role'
 *  }
 * }
 *
 * @apiUse CustomError
 *
 * @apiSampleRequest /auth/api/verifylogin
 */
fn.verifytoken = (req, res) => {
  res.json({
    status: 'OK',
    data: res.locals._user,
  });
};

fn.updatetoken = (req, res, next) => {
  if (res.locals._payload) {
    User.findOne({ _id: res.locals._payload.i, token: res.locals._token })
      .select('_id username role active')
      .lean()
      .exec((err, d) => {
        if (err) return next(err);
        // 該token不屬於該user
        if (!d) return next('E003001');
        // 帳號停權
        if (d.active === 0) return next('E002006');
        const payload = { i: res.locals._payload.i };
        // 產生token
        const token = jwt.sign(payload, global.config.JWT_SECRET, { expiresIn: '1d' });
        return User.update({ _id: res.locals._payload.i }, { token }).exec((uerr) => {
          if (uerr) return next(uerr);
          return res.json({
            status: 'OK',
            data: { token },
          });
        });
      });
  } else {
    // token不存在(或失效、錯誤) (E3001001 or E3001002)
    next(res.locals._err);
  }
};

/**
 * @api {get} /auth/api/captcha 取得驗證碼圖片
 * @apiGroup Login
 * @apiName CaptchaUser
 * @apiVersion 0.0.2
 *
 * @apiDescription
 *  取得驗證碼的圖片，會直接回傳圖片<br>
 *  使用時請直接用img標籤
 *
 * @apiParam {String} [size=200x50] 指定圖片的寬高，格式為"寬度x高度"
 * @apiParam {Number} [num=4] 指定驗證碼的字元數
 * @apiParam {Number} [color=1] 指定驗證碼是否要是彩色的
 *
 * @apiSuccess {String} status 成功時會回傳一張圖片
 *
 */
fn.captcha = (req, res) => {
  const size = req.query.size;
  const num = Number(req.query.num, 10);
  let w = 200;
  let h = 50;
  if (size) {
    w = Number(size.split('x')[0], 10);
    h = Number(size.split('x')[1], 10);
  }
  if (isNaN(w)) w = 200;
  if (isNaN(h)) h = 50;
  let s = 4;
  if (!isNaN(num)) s = num;
  let color = true;
  if (req.query.color === '0') color = false;
  const capt = svgCaptcha.create({
    size: s, // size of random string
    ignoreChars: '0o1Il',
    noise: 3,
    width: w,
    height: h,
    color,
  });
  const newcaptcha = new Captcha({ captcha: capt.text.toLowerCase() });
  return newcaptcha.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.set('Content-Type', 'image/svg+xml');
      res.send(capt.data);
    }
  });
};

module.exports = fn;
