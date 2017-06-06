const ratelimit = require('../model/model.js')('temp_ratelimit', 'ratelimit');

class RateLimit {
  constructor(param = { max: 60, time: 60 }) {
    this.max = param.max || 60;
    this.time = param.time || 60;
    this.rate = this.rate.bind(this);
  }

  rate(req, res, next) {
    const ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    ratelimit.findOneAndUpdate({ ip }, { $inc: { hits: 1 } }, { upsert: true, new: true })
      .lean()
      .exec((err, d) => {
        let ttl = new Date().getTime() - new Date(d.createdAt).getTime();
        let hits = d.hits;
        let toomany = false;
        if (ttl <= this.time * 1000) {
          if (this.max < hits) {
            toomany = true;
          }
        }
        console.log(ttl);
        console.log(this.time * 1000);
        if (ttl > this.time * 1000) {
          hits = 1;
          ratelimit.findOneAndUpdate({ ip }, { createdAt: Date.now(), hits }, { new: true }).exec((err2, d2) => {
            console.log(d2);
            console.log(err2);
          });
          ttl = 0;
        }
        res.set('X-Rate-Limit-Limit', this.max);
        res.set('X-Rate-Limit-Remaining', this.max - hits);
        res.set('X-Rate-Limit-Reset', (this.time * 1000) - ttl);
        if (toomany) return next('E001002');
        return next();
      });
  }
}

module.exports = RateLimit;
