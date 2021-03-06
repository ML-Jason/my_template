import 'es6-promise/auto';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Vue from 'vue';

const router = require('./vue/lib/router.js');
const store = require('./vue/lib/store.js');

const sidemenu = require('./vue/menu.vue');
const topnav = require('./vue/topnav.vue');
const coverloading = require('./vue/coverloading.vue');

const components = {
  sidemenu,
  topnav,
  coverloading,
};

window.swal.setDefaults({
  allowOutsideClick: false,
});
moment.locale('zh-TW');

const app = new Vue({
  el: '#appwrapper',
  data: {
  },
  components,
  watch: {
    loginState(val) {
      if (!val) {
        Cookies.remove('t');
        window.location.href = '/mlmng/login';
      }
    },
  },
  computed: {
    ...mapGetters(['loginState']),
  },
  methods: {
    ...mapMutations(['setCoverloading', 'token', 'setloginState']),
    ...mapActions(['verifylogin']),
  },
  store,
  router,
  created() {
  },
  mounted() {
    setTimeout(() => {
      window.initUtils();
    }, 100);
  },
});

window.app = app;
