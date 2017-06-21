const ratelimit = require('../model/model.js')('ratelimits', 'ratelimit');

class RateLimit {
  constructor({ name = 'api', max = 120, time = 60 } = {}) {
    this.max = max;
    this.time = time;
    this.name = name;
    this.rate = this.rate.bind(this);
  }

  rate(req, res, next) {
    const ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    const name = this.name;
    ratelimit.findOneAndUpdate({ ip, name }, { $inc: { hits: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true })
      .lean()
      .exec((err, d) => {
        let ttl = (new Date().getTime()) - (new Date(d.cdate).getTime());
        let hits = d.hits;
        let toomany = false;
        if (ttl <= this.time * 1000) {
          if (this.max < hits) {
            toomany = true;
          }
        }
        if (ttl > this.time * 1000) {
          hits = 1;
          ratelimit.findOneAndUpdate({ ip }, { cdate: Date.now(), hits }, { new: true }).exec((err2) => {
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
