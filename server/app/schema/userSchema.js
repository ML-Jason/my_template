const mongoose = require('mongoose');

const schema = mongoose.Schema({
  username: { type: String, index: true, unique: true },
  userpwd: String,
  role: String,
  active: { type: String, default: 'active' }, // stop=停權, active=正常
  logindate: { type: Date, default: Date.now },
  loginip: { type: String },
  pwddate: { type: Date, default: Date.now }, // 上次修改密碼的時間
  oldpwds: [String], // 以往設定過的密碼
  token: { type: String, index: true },
});

module.exports = schema;
