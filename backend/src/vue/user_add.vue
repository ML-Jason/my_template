<template lang="pug">
  div
    .row
      .col-md-12
        .x_panel
          .x_title
            h3 {{title}}
            .clearfix
          .x_content
            form.form-horizontal.form-label-left
              .form-group
                label.control-label.col-sm-3.col-xs-12
                  | Username
                  span.required *
                .col-sm-6.col-xs-12
                  input.form-control.col-md-7.col-xs-12(type="text" v-model.trim="uname" @keyup.enter="onSubmit")
                  small
                    |使用者帳號(長度5-50，英文與數字組合，可使用@、.以及_)
              .form-group
                label.control-label.col-sm-3.col-xs-12
                  | Password
                  span.required *
                .col-sm-6.col-xs-12
                  input.form-control.col-md-7.col-xs-12(type="password" v-model.trim="upwd" @keyup.enter="onSubmit")
                  small
                    |使用者密碼(長度5-20，英文與數字組合，可使用@、.以及_)
              .form-group
                label.control-label.col-sm-3.col-xs-12
                  | Password再一次
                  span.required *
                .col-sm-6.col-xs-12
                  input.form-control.col-md-7.col-xs-12(type="password" v-model.trim="upwd2" @keyup.enter="onSubmit")
                  small
                    |請再輸入一次相同的密碼
              .form-group
                label.control-label.col-sm-3.col-xs-12
                  | 自動產生密碼
                .col-sm-6.col-xs-12
                  .row
                    .col-xs-12
                      .form-inline
                        button.btn.btn-info(type="button" @click="autopwd") 產生密碼並貼到密碼欄
                        .input-group
                          input.form-control#apwd(type="text" readonly v-bind:value="apwd")
                          .input-group-addon.cppwd(data-clipboard-target="#apwd" data-toggle="tooltip" data-placement="top" title="複製密碼")
                            i.fa.fa-clipboard
                    .col-xs-12
                      small
                        |你也可以使用系統自動產生的密碼
              .form-group
                label.control-label.col-sm-3.col-xs-12
                  | 權限
                  span.required *
                .col-sm-6.col-xs-12
                  label.radio-inline
                    input(type="radio" value="admin" name="role" v-model.trim="role" v-bind:disabled="me.role!=='admin'?true:false")
                    | 管理者
                  label.radio-inline
                    input(type="radio" value="user" name="role" checked v-model.trim="role" v-bind:disabled="me.role!=='admin'?true:false")
                    | 一般使用者
                  div
                    small
                      |【管理者】擁有最高權限，【一般使用者】只能觀看列表，無法修改檔案(除了自己的密碼以外)
              .form-group
                label.control-label.col-sm-3.col-xs-12
                  | 帳號狀態
                  span.required *
                .col-sm-6.col-xs-12
                  label.radio-inline
                    input(type="radio" value="active" name="act" checked v-model.trim="active" v-bind:disabled="me.role!=='admin'?true:false")
                    | 正常
                  label.radio-inline
                    input(type="radio" value="stop" name="act" v-model.trim="active" v-bind:disabled="me.role!=='admin'?true:false")
                    | 停用
                  div
                    small
                      |如果有帳號使用者暫時不會使用時，可以選擇停用
              .ln_solid
              .col-xs-12.flex-cc
                button.btn.btn-default(type="button" @click="onCancel") 取消
                button.btn.btn-success(type="button" @click="onSubmit") 送出
          .inloading(v-if="!dataDone")
            i.fa.fa-circle-o-notch.fa-spin
</template>
<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      uname: '',
      upwd: '',
      upwd2: '',
      role: 'user',
      active: 'active',
      useauto: false,
      apwd: '',
      clipboard: '',
      dataDone: true,
    };
  },
  watch: {
    useauto(val) {
      if (val) {
        this.upwd = this.autopwd;
        this.upwd2 = this.autopwd;
      } else {
        this.upwd = '';
        this.upwd2 = '';
      }
    },
  },
  computed: {
    ...mapGetters(['me']),
    title() {
      if (this.$route.params.type === 'add') {
        return '新增使用者';
      }
      return '使用者資料';
    },
    subtitle() {
      return '';
    },
  },
  methods: {
    ...mapMutations(['setCoverloading']),
    ...mapActions(['getuserinfo', 'adduser', 'updateuser', 'logout']),
    autopwd() {
      let allowstr = '';
      for (let i = 0; i < 26; i++) {
        allowstr += String.fromCharCode(97 + i);
        allowstr += String.fromCharCode(65 + i);
      }
      allowstr += '._@0123456789';
      let newpwd = '';
      while (newpwd.length < 8) {
        const ra = Math.floor(Math.random() * allowstr.length);
        newpwd += allowstr.substr(ra, 1);
      }
      this.apwd = newpwd;
      this.upwd = newpwd;
      this.upwd2 = newpwd;
    },
    onCancel() {
      this.$router.push('/users');
    },
    onSubmit() {
      const data = {};
      let method = 'updateuser';
      if (this.$route.params.type === 'add') {
        method = 'adduser';
      } else {
        data.id = this.$route.params.type;
      }
      if (this.uname.length < 5 || this.uname.length > 50) {
        return swal('Oops...', '使用者帳號需為5-50個英文與數字的組合', 'error');
      }
      if (method === 'adduser' || this.upwd !== '') {
        if (this.upwd.length < 5 || this.upwd.length > 20) {
          return swal('Oops...', '使用者密碼需為5-20個英文與數字的組合', 'error');
        }
        if (this.upwd !== this.upwd2) {
          return swal('Oops...', '兩次輸入的密碼不一樣ㄟ', 'error');
        }
        data.upwd = this.upwd;
      }
      data.uname = this.uname;
      data.role = this.role;
      data.active = this.active;
      swal({
        title: '',
        text: '送出中',
        type: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      this.dataDone = false;
      return this[method](data).then((d) => {
        this.dataDone = true;
        swal.close();
        if (d.status === 'OK') {
          this.$router.push('/users');
        } else {
          swal('Oops', d.err.message, 'error');
        }
      });
    },
  },
  created() {
    setTimeout(() => {
      if (this.$route.params.type !== 'add') {
        this.dataDone = false;
        this.getuserinfo(this.$route.params.type).then((d) => {
          if (d.status === 'OK') {
            this.uname = d.data.username;
            this.role = d.data.role;
            this.active = d.data.active;
          } else {
            swal('Oops', d.err.message, 'error');
          }
          this.dataDone = true;
        });
      }
      $(this.$el).find('input').eq(0).focus();
      this.clipboard = new Clipboard('.cppwd');
      $(this.$el).find('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    }, 30);
  },
  beforeDestroy() {
    this.clipboard.destroy();
  },
};
</script>
<style scoped lang="stylus">
.form-group small
  color #9e9e9e;
.x_title h3
  margin: 5px 0 6px
  float: left
  display: block
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap
button, .input-group
  margin-bottom 0
.cppwd
  cursor pointer
</style>
