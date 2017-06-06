import 'es6-promise/auto';
import Vue from 'vue';
import * as config from './config/config';

window.swal.setDefaults({ allowOutsideClick: false });

const app = new Vue({
  el: '#login-app',
  data: {
    uname: '',
    upwd: '',
    codes: '',
    codeimg: '',
  },
  methods: {
    submit() {
      if (this.uname === '' || this.upwd === '') {
        return swal('Oops...', '請輸入登入帳號及密碼', 'error');
      }
      if (this.codes === '') {
        return swal('Oops...', '請輸入驗證碼', 'error');
      }
      swal({
        title: '',
        text: '登入中',
        type: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      return $.ajax({
        url: `${config.AjaxUrl}/api/login`,
        data: {
          uname: this.uname,
          upwd: this.upwd,
          codes: this.codes,
        },
        method: 'POST',
        datatype: 'jsonp',
        /* headers: {
          Authorization: 'Basic',
        },*/
      }).done((d) => {
        if (d.status === 'OK') {
          Cookies.set('t', d.data.token);
          Cookies.set('uid', d.data.userid);
          Cookies.set('uname', d.data.username);
          Cookies.set('r', d.data.role);
          swal.close();
          window.location.href = '/mng/';
        } else {
          this.reloadCodeImg();
          swal('Oops...', d.err.message, 'error');
        }
      }).fail(() => {
        this.reloadCodeImg();
        swal('Oops...', '其實我不知道發生什麼事', 'error');
      });
    },
    reloadCodeImg() {
      const imgurl = `${config.AjaxUrl}/api/captcha?size=150x40&num=4&color=0`;
      const codekey = `rand${Math.floor(Math.random() * 10000)}`;
      this.codeimg = `${imgurl}&key=${codekey}`;
    },
  },
  created() {
    this.reloadCodeImg();
    setTimeout(() => {
      $('input').eq(0).focus();
    }, 100);
  },
});

window.app = app;
