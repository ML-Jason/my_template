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

router.beforeEach((to, from, next) => {
  window.closeMenu();

  // 確認是否有登入
  store.dispatch('verifylogin', Cookies.get('t')).then((d) => {
    // 如果沒登入，導向
    if (d.token === '') {
      window.location.href = '/mlmng/login';
      return next(false);
    }
    // 判斷token的時效，低於一小時就自動更新token
    if ((d.exp * 1000) - Date.now() <= 60 * 10 * 1000) {
      return store.dispatch('updatetoken', Cookies.get('t')).then((d2) => {
        if (d2.token === '') {
          window.location.href = '/mlmng/login';
          return next(false);
        }
        return Cookies.set('t', d2.token);
      });
    }
    return next();
  });
});

module.exports = router;
