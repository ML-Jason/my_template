<template lang="pug">
div
  .row
    .col-xs-4
      h3 參與者資料
    .col-xs-8
      form.form-inline.pull-right
        span  時間區間
        .form-group
          .input-group.input-group-sm
            .input-group-addon
              i.fa.fa-calendar
            input.form-control.datepick#startdate(type="text" v-model="sdate")  
        span  到 
        .form-group
          .input-group.input-group-sm
            .input-group-addon
              i.fa.fa-calendar
            input.form-control.datepick#enddate(type="text" v-model="edate")
        button.btn.btn-default.btn-sm(type="button" @click="dateChange") 確定
  .row
    .col-xs-12
      .x_panel
        .x_title
          h2 列表
          .clearfix
        .x_content
          .col-sm-6
            .form-inline
              span  一次顯示 
              select.form-control.input-sm(v-model='pagesize' @change='pagesizeChange')
                option(value="10") 10
                option(value="20") 20
                option(value="30") 30
                option(value="40") 40
                option(value="50") 50
              span  筆資料 
          .col-sm-6
            form.form-inline.pull-right
              .form-group.top_search
                .input-group
                  input.form-control(type="text" v-model='q')
                  span.input-group-btn
                    button.btn.btn-default(@click.prevent='doSearch')
                      i.fa.fa-search
              button.btn.btn-default.btn-sm(type="button" @click="doSearch") 搜尋
          .col-sm-6
            button.btn.btn-danger.btn-xs(type="button" tag="button" @click="delSelected") 刪除選取的
          table.table.table-hover.table-striped
            thead
              tr
                th(style="width:30px")
                  label.checkbox-inline
                    input(type="checkbox" v-model="allcheck")
                    |#
                th 姓名
                th email
                th 電話
                th 輸入時間
            tbody
              tr(v-for='(item, index) in list' v-bind:key='item._id')
                td 
                  label.checkbox-inline
                    input(type="checkbox" v-bind:value="item._id" v-model="schecked" v-bind:key='item._id')
                    |{{(index+1)+pagesize*(page-1)}}
                td {{item.name}}
                td {{item.email}}
                td {{item.phone}}
                td {{dateformat(item.cdate)}}
          .col-xs-12.center
            ul.pagination
              li(v-bind:class="page<=1 ? 'disabled': ''")
                template(v-if="page>1")
                  a(href='' @click.prevent='prevPage') Previous
                template(v-else)
                  a Previous
              template(v-for='(item, index) in pagenations')
                li(v-bind:class="page===item ? 'active': ''" v-bind:key="index+'_'+item+'_'+Math.floor(Math.random()*100000)")
                  a(href='' @click.prevent='gotoPage(item)') {{item}}
              li(v-bind:class="page>=totalpage ? 'disabled': ''")
                template(v-if="page<totalpage")
                  a(href='' @click.prevent='nextPage') Next
                template(v-else)
                  a Next
        .inloading(v-if="!listDone")
          i.fa.fa-circle-o-notch.fa-spin
</template>
<script>
import { mapMutations, mapActions } from 'vuex';
// import TimeZone from './lib/timezone';

export default {
  data() {
    return {
      listDone: false,
      list: {},
      pagesize: 50,
      page: 1,
      totalpage: 1,
      q: '',
      pagenations: [],
      // sdate: this.querydateformat(new TimeZone().toDate()),
      // edate: this.querydateformat(new TimeZone(moment().add(1, 'month')).toDate()),
      sdate: this.querydateformat(new Date()),
      edate: this.querydateformat(moment().add(1, 'month')),
      schecked: [],
      allcheck: '',
    };
  },
  computed: {
  },
  watch: {
    allcheck(val) {
      if (val) {
        this.schecked = [];
        for (let i = 0; i < this.list.length; i++) {
          this.schecked.push(this.list[i]._id);
        }
      } else {
        this.schecked = [];
      }
    },
  },
  methods: {
    ...mapMutations([]),
    ...mapActions(['loadForm', 'delFormData']),
    fetchData() {
      // this.listDone = false;
      // this.schecked = [];
      // this.allcheck = false;
      // this.loadForm({
      //   page: this.page,
      //   pagesize: this.pagesize,
      //   q: this.q,
      //   sdate: this.sdate,
      //   edate: this.edate,
      // }).then((d) => {
      //   if (d.status === 'OK') {
      //     this.totalpage = d.totalpage;
      //     this.page = d.page;
      //     this.pagesize = d.pagesize;
      //     this.list = d.data;
      //     this.calPagenation();
      //   } else {
      //     swal('Oops', d.err.message, 'error');
      //   }
      //   this.listDone = true;
      // });
    },
    delSelected() {
      if (this.schecked.length === 0) {
        swal('Oops..', '至少選一個要刪的吧', 'error');
      } else {
        swal({
          title: '確定?',
          text: '刪錯了不要哭喔',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: '不要囉嗦',
          cancelButtonText: '對不起我錯了',
        }).then(() => {
          this.listDone = false;
          this.delFormData({ ids: this.schecked }).then((d) => {
            if (d.status === 'OK') {
              this.fetchData();
            } else {
              swal('Oops', d.err.message, 'error');
            }
            this.listDone = true;
          });
        }, () => {});
      }
    },
    dateChange() {
      this.resetUrl();
    },
    doSearch() {
      this.resetUrl();
    },
    pagesizeChange() {
      this.resetUrl();
    },
    gotoPage(p) {
      if (p === this.page) return;
      this.page = p;
      this.resetUrl();
    },
    prevPage() {
      this.page -= 1;
      this.resetUrl();
    },
    nextPage() {
      this.page += 1;
      this.resetUrl();
    },
    resetUrl() {
      this.$router.push(`${this.$route.path}?page=${this.page}&pagesize=${this.pagesize}&q=${this.q}&s=${this.sdate}&e=${this.edate}`);
    },
    calPagenation() {
      this.pagenations = [];
      let s = this.page - 4;
      if (s < 1) s = 1;
      for (let i = s; i <= s + 9 && i <= this.totalpage; i++) {
        this.pagenations.push(i);
      }
    },
    querydateformat(d) {
      return moment(d).format('YYYY-MM-DD');
    },
    dateformat(d) {
      return moment(d).format('YYYY/MM/DD HH:mm:ss');
    },
    initUI() {
      $('#startdate').daterangepicker({
        singleDatePicker: true,
        locale: {
          format: 'YYYY-MM-DD',
        },
      }, (s) => {
        this.sdate = this.querydateformat(s);
      });
      $('#enddate').daterangepicker({
        singleDatePicker: true,
        locale: {
          format: 'YYYY-MM-DD',
        },
      }, (s) => {
        this.edate = this.querydateformat(s);
      });
    },
    getQuery(route) {
      const r = route || this.$route;
      this.page = r.query.page || 1;
      this.pagesize = r.query.pagesize || 50;
      this.q = r.query.q || '';
      let sd = new Date(r.query.s);
      let ed = new Date(r.query.e);
      if (sd.toString() === 'Invalid Date') {
        sd = this.sdate;
      }
      if (ed.toString() === 'Invalid Date') {
        ed = this.edate;
      }
      // this.sdate = this.querydateformat(new TimeZone(sd).toDate());
      // this.edate = this.querydateformat(new TimeZone(ed).toDate());
      this.sdate = this.querydateformat(new Date(sd));
      this.edate = this.querydateformat(new Date(ed));
      this.fetchData();
    },
  },
  created() {
    this.getQuery();
    setTimeout(() => {
      this.initUI();
    }, 300);
  },
  beforeRouteUpdate(to, from, next) {
    this.getQuery(to);
    next();
  },
  beforeDestroy() {

  },
};

</script>

<style scoped lang="stylus">
.tile_count
  margin-bottom 0
.input-group
  margin-bottom 0
.form-inline > button
  margin-bottom 0
.center
  text-align center
.countnumber
  font-size 20px
  font-weight 400
.x_content > span
  margin-left 5px;
</style>

