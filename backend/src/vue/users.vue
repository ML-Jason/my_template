<template lang="pug">
  div
    .page-title
      .title_left
        h3
          |使用者列表
          small  所有的使用者就對了
    .clearfix
    .row
      .col-md-12
        .x_panel
          .x_title
            h2 使用者列表
            ul.nav.navbar-right.panel_toolbox
              li
                a.collapse-link
                  i.fa.fa-chevron-up
            .clearfix
          .x_content
            table.table.table-hover.table-striped
              thead
                tr
                  th(style="width:30px") #
                  th 帳號
                  th 權限
                  th 狀態
                  th.hidden-sm.hidden-xs 上次登入
                  th(style="width:100px")
                    router-link.btn.btn-info.btn-xs.btn-block(type="button" tag="button" to="/user/add") 新增
              tbody
                tr(v-for="(item, index) in userlist" v-bind:key="item._id")
                  th {{index+1}}
                  td
                    | {{item.username}}
                  td
                    span.label(v-bind:class="item.role==='admin'?'label-warning':'label-success'") {{item.role}}
                  td {{userState(item.active)}}
                  td.hidden-sm.hidden-xs {{dateformat(item.logindate)}}
                  td
                    .btn-group.btn-group-justified
                      .btn-group
                        button.btn.btn-success.btn-xs(type="button" @click="modUser(item._id)") 修改
                      .btn-group
                        button.btn.btn-warning.btn-xs(type="button" @click="delUser(item._id)") 刪除
          .inloading(v-if="!listDone")
            i.fa.fa-circle-o-notch.fa-spin
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      listDone: false,
    };
  },
  computed: {
    ...mapGetters(['userlist', 'me']),
  },
  methods: {
    ...mapActions(['getuserlist', 'deluser', 'confirmTokenError']),
    ...mapMutations([]),
    modUser(id) {
      this.$router.push(`/user/${id}`);
    },
    delUser(id) {
      swal({
        title: '確定?',
        text: '刪錯了不要哭喔',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '不要囉嗦',
        cancelButtonText: '對不起我錯了',
      }).then(() => {
        this.listDone = false;
        this.deluser(id).then((d) => {
          this.listDone = true;
          if (d.status !== 'OK') {
            // 確認是否是登入狀態改變，否的話就顯示錯誤訊息
            // 是的話，confirmTokenError會自動導向到登入頁
            this.confirmTokenError(d).then((c) => {
              if (!c) swal('Oops', d.err.message, 'error');
            });
          }
        });
      }, () => {});
    },
    dateformat(d) {
      return moment(d).format('DD-MM-YYYY HH:mm:ss');
    },
    userState(d) {
      if (d === 'stop') return '停止中';
      return '正常';
    },
  },
  created() {
    setTimeout(() => {
      window.initUtils();
      this.getuserlist().then(() => {
        this.listDone = true;
      });
    }, 30);
  },
};
</script>
<style scoped lang="stylus">
th .btn
  margin-bottom 0
</style>
