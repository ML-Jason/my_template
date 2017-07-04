import Vue from 'vue';
import Vuex from 'vuex';
import * as userModule from './storeUserModule';
import * as loginModule from './storeLoginModule';
import * as formModule from './storeFormModule';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    coverloadingState: false,
    token: '',
  },
  getters: {
    token(state) {
      return state.token;
    },
  },
  mutations: {
    token(state, t) {
      state.token = t;
    },
    setCoverloading(state, val) {
      state.coverloadingState = val;
    },
  },
  actions: {
    // 確認是否屬於Token的錯誤，true為是，false為否
    confirmTokenError({ commit }, rs) {
      return new Promise((resolve) => {
        if (rs.err) {
          if (rs.err.code === 'E003001' || rs.err.code === 'E003002') {
            swal('帳號已被登出', '可能是太久沒動作，或是有其他裝置登入這個帳號。<br>點擊後回到登入畫面。', 'warning')
              .then(() => {
                // 改變loginState，會自動導回登入頁
                commit('setloginState', false);
              });
            return resolve(true);
          }
        }
        return resolve(false);
      });
    },
  },
  modules: {
    login: loginModule,
    users: userModule,
    repo: formModule,
    // receipt: receiptModule,
    // draw: drawModule,
  },
});

module.exports = store;
