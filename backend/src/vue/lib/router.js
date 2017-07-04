import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

Vue.use(VueRouter);
const routes = [
  {
    path: '/', redirect: '/users',
  },
  // {
  //   path: '/repos',
  //   component: (resolve) => { require(['../repolist.vue'], resolve); },
  //   name: 'repolist',
  // },
  // {
  //   path: '/repo/:type',
  //   component: (resolve) => { require(['../repo_add.vue'], resolve); },
  //   name: 'repo_add',
  // },
  {
    path: '/form',
    component: (resolve) => { require(['../form.vue'], resolve); },
    name: 'form',
  },
  {
    path: '/upload',
    component: (resolve) => { require(['../upload.vue'], resolve); },
    name: 'upload',
  },
  {
    path: '/users',
    component: (resolve) => { require(['../users.vue'], resolve); },
    name: 'users',
  },
  {
    path: '/user/:type',
    component: (resolve) => { require(['../user_add.vue'], resolve); },
    name: 'user_add',
  },
];
const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'current-page', // 'router-active',
  base: '/mlmng',
});

let verifyTimer = 0;
let firsttime = true;

const fn = {};
fn.doVerifyLogin = (next) => {
  // 確認是否有登入
  if (Cookies.get('t') !== undefined && Cookies.get('t') !== 'undefined') {
    store.commit('token', Cookies.get('t'));
    store.dispatch('verifylogin', Cookies.get('t')).then((d) => {
      // 如果沒登入，阻止導向
      if (d.status !== 'OK') {
        store.dispatch('confirmTokenError', d).then((c) => {
          // 如果不是因為token的錯誤，繼續timer
          if (!c) {
            swal('Oops', d.err.message, 'error');
            fn.startVerifyTimer();
          }
        });
        if (next) return next(false);
        return false;
      }

      fn.startVerifyTimer();

      // 判斷token的時效，低於一小時就自動更新token
      if ((Number(d.data.exp) * 1000) - Date.now() <= 60 * 10 * 1000) {
        return store.dispatch('updatetoken', Cookies.get('t')).then((d2) => {
          if (d2.token === '') {
            store.commit('setloginState', false);
            if (next) return next(false);
            return false;
          }
          return Cookies.set('t', d2.token);
        });
      }
      if (next) return next();
      return false;
    });
  } else {
    store.commit('setloginState', false);
    if (next) next(false);
  }
};

fn.startVerifyTimer = () => {
  clearTimeout(verifyTimer);
  // 每五分鐘自動跟Server確定一次登入狀態
  verifyTimer = setTimeout(fn.doVerifyLogin, 5 * 60 * 1000);
};

router.beforeEach((to, from, next) => {
  window.closeMenu();
  // 每次route改變，就確認一次登入狀態
  // *現在如果在每個api call都判斷，就不需要在route改變時多送一次request
  // fn.doVerifyLogin(next);

  // 每次route改變，重新啟動timer
  fn.startVerifyTimer();

  if (firsttime) {
    // 載入時先確定一次登入狀態
    setTimeout(() => {
      fn.doVerifyLogin(next);
    }, 100);
    firsttime = false;
  } else {
    next();
  }
});

module.exports = router;
