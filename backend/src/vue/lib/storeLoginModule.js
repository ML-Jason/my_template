import * as config from '../../config/config';

const storemodule = {
  state: {
    lState: true,
    myinfo: {},
  },
  getters: {
    loginState(state) {
      return state.lState;
    },
    me(state) {
      return state.myinfo;
    },
  },
  mutations: {
    setloginState(state, param) {
      state.lState = param;
    },
  },
  actions: {
    verifylogin({ state, rootState }, param) {
      // let data = { _id: '', email: '', login: '', role: '' };
      let rs = { status: 'ERROR' };
      return new Promise((resolve) => {
        $.ajax({
          url: `${config.AjaxUrl}/mlmng/api/verifylogin`,
          method: 'GET',
          datatype: 'jsonp',
          headers: {
            Authorization: `Bearer ${param}`,
          },
        }).done((d) => {
          rs = d;
          if (d.status === 'OK') {
            // data = {
            //   _id: d.data.userid,
            //   username: d.data.username,
            //   role: d.data.role,
            //   exp: d.data.exp,
            // };
            state.myinfo = d.data;
            rootState.token = param;
          }
        }).always(() => {
          resolve(rs);
        });
      });
    },
    updatetoken({ state, rootState }, param) {
      let data = { token: '' };
      return new Promise((resolve) => {
        $.ajax({
          url: `${config.AjaxUrl}/mlmng/api/updatetoken`,
          method: 'GET',
          datatype: 'json',
          headers: {
            Authorization: `Bearer ${param}`,
          },
        }).done((d) => {
          if (d.status === 'OK') {
            data = {
              token: d.data.token,
            };
          }
        }).always(() => {
          rootState.token = data.token;
          // if (data.token === '') {
          //   state.lState = false;
          // }
          resolve(data);
        });
      });
    },
    logout({ state, rootState }) {
      $.ajax({
        url: `${config.AjaxUrl}/mlmng/api/logout`,
        method: 'GET',
        datatype: 'json',
        headers: {
          Authorization: `Bearer ${rootState.token}`,
        },
      }).always(() => {
        state.lState = false;
      });
    },
  },
};

module.exports = storemodule;
