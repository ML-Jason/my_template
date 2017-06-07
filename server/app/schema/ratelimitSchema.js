const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: { type: String, index: true },
  ip: { type: String, index: true },
  hits: { type: Number, default: 1 },
  cdate: { type: Date, index: true, default: Date.now, expires: 60 * 2 },
});

module.exports = schema;
