const express = require('express');
const validators = require('../lib/validators.js');
const User = require('../model/model.js')('mlmngusers', 'user');

module.exports = (app) => {
  const router = express.Router();
  router.all('/login', (req, res) => {
    res.render('server/public/mlmng/login');
  });
  router.all('/*', (req, res) => {
    // 檢查是否已經有登入
    let payload = null;
    if (req.cookies.t) {
      payload = validators.parseToken(req.cookies.t, global.config.JWT_SECRET);
    }
    if (!payload) {
      res.redirect('/mlmng/login');
    } else {
      User.findOne({ _id: payload.i, token: req.cookies.t }, '_id role active', (err, d) => {
        if (err) return res.redirect('/mlmng/login');
        if (d) {
          // 帳號是否被停止
          if (d.active !== 'active') return res.redirect('/mlmng/login');
          return res.render('server/public/mlmng/main');
        }
        // 查無此人，或是token跟user對不起來
        return res.redirect('/mlmng/login');
      });
    }
  });

  app.use('/mlmng', router);
};
