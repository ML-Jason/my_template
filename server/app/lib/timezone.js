const moment = require('moment-timezone');

class TimeZone {
  constructor(dateobj = null, timezone = 'Asia/Taipei') {
    this.tz = timezone;
    if (dateobj) {
      let datein = dateobj;
      if (typeof dateobj === 'string') {
        datein = dateobj.split('/').join('-');
      }
      this.date = moment(datein).tz(this.tz).format();
    } else {
      this.date = moment().tz(this.tz).format();
    }
  }

  getYear() {
    return Number(this.date.split('-')[0]);
  }
  getMonth() {
    return Number(this.date.split('-')[1]);
  }
  getDate() {
    return Number(this.date.split('-')[2].split('T')[0]);
  }
  toDate() {
    return new Date(this.date.toString());
  }
}

module.exports = TimeZone;
