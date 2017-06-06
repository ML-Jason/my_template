const mongoose = require('mongoose');

const schema = mongoose.Schema({
  ip: { type: String, index: true },
  hits: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = schema;
