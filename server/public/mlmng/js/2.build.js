webpackJsonp([2],{38:function(t,e,a){a(53);var s=a(6)(a(43),a(49),"data-v-025c748a",null);t.exports=s.exports},43:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var s in a)Object.prototype.hasOwnProperty.call(a,s)&&(t[s]=a[s])}return t},i=a(1);e.default={data:function(){return{uname:"",upwd:"",upwd2:"",role:"user",active:"active",useauto:!1,apwd:"",clipboard:"",dataDone:!0}},watch:{useauto:function(t){t?(this.upwd=this.autopwd,this.upwd2=this.autopwd):(this.upwd="",this.upwd2="")}},computed:s({},(0,i.mapGetters)(["me"]),{title:function(){return"add"===this.$route.params.type?"新增使用者":"使用者資料"},subtitle:function(){return""}}),methods:s({},(0,i.mapMutations)([]),(0,i.mapActions)(["getuserinfo","adduser","updateuser","confirmTokenError"]),{autopwd:function(){for(var t="",e=0;e<26;e++)t+=String.fromCharCode(97+e),t+=String.fromCharCode(65+e);t+="._@0123456789";for(var a="";a.length<8;){var s=Math.floor(Math.random()*t.length);a+=t.substr(s,1)}this.apwd=a,this.upwd=a,this.upwd2=a},onCancel:function(){this.$router.go(-1)},onSubmit:function(){var t=this,e={},a="updateuser";if("add"===this.$route.params.type?a="adduser":e.id=this.$route.params.type,this.uname.length<5||this.uname.length>50)return swal("Oops...","使用者帳號需為5-50個英文與數字的組合","error");if("adduser"===a||""!==this.upwd){if(this.upwd.length<5||this.upwd.length>20)return swal("Oops...","使用者密碼需為5-20個英文與數字的組合","error");if(this.upwd!==this.upwd2)return swal("Oops...","兩次輸入的密碼不一樣ㄟ","error");e.upwd=this.upwd}return e.uname=this.uname,e.role=this.role,e.active=this.active,swal({title:"",text:"送出中",type:"info",allowOutsideClick:!1,showConfirmButton:!1}),this.dataDone=!1,this[a](e).then(function(e){t.dataDone=!0,swal.close(),"OK"===e.status?t.$router.push("/users"):t.confirmTokenError(e).then(function(t){t||swal("Oops",e.err.message,"error")})})}}),created:function(){var t=this;setTimeout(function(){"add"!==t.$route.params.type&&(t.dataDone=!1,t.getuserinfo(t.$route.params.type).then(function(e){"OK"===e.status?(t.uname=e.data.username,t.role=e.data.role,t.active=e.data.active):t.confirmTokenError(e).then(function(t){t||swal("Oops",e.err.message,"error")}),t.dataDone=!0})),$(t.$el).find("input").eq(0).focus(),t.clipboard=new Clipboard(".cppwd"),$(t.$el).find('[data-toggle="tooltip"]').tooltip({container:"body"})},30)},beforeDestroy:function(){this.clipboard.destroy()}}},45:function(t,e,a){e=t.exports=a(5)(),e.push([t.i,".form-group small[data-v-025c748a]{color:#9e9e9e}.x_title h3[data-v-025c748a]{margin:5px 0 6px;float:left;display:block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.input-group[data-v-025c748a],button[data-v-025c748a]{margin-bottom:0}.cppwd[data-v-025c748a]{cursor:pointer}",""])},49:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-12"},[a("div",{staticClass:"x_panel"},[a("div",{staticClass:"x_title"},[a("h3",[t._v(t._s(t.title))]),a("div",{staticClass:"clearfix"})]),a("div",{staticClass:"x_content"},[a("form",{staticClass:"form-horizontal form-label-left"},[a("div",{staticClass:"form-group"},[t._m(0),a("div",{staticClass:"col-sm-6 col-xs-12"},[a("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.uname,expression:"uname",modifiers:{trim:!0}}],staticClass:"form-control col-md-7 col-xs-12",attrs:{type:"text"},domProps:{value:t.uname},on:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;t.onSubmit(e)},input:function(e){e.target.composing||(t.uname=e.target.value.trim())},blur:function(e){t.$forceUpdate()}}}),a("small",[t._v("使用者帳號(長度5-50，英文與數字組合，可使用@、.以及_)")])])]),a("div",{staticClass:"form-group"},[t._m(1),a("div",{staticClass:"col-sm-6 col-xs-12"},[a("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.upwd,expression:"upwd",modifiers:{trim:!0}}],staticClass:"form-control col-md-7 col-xs-12",attrs:{type:"password"},domProps:{value:t.upwd},on:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;t.onSubmit(e)},input:function(e){e.target.composing||(t.upwd=e.target.value.trim())},blur:function(e){t.$forceUpdate()}}}),a("small",[t._v("使用者密碼(長度5-20，英文與數字組合，可使用@、.以及_)")])])]),a("div",{staticClass:"form-group"},[t._m(2),a("div",{staticClass:"col-sm-6 col-xs-12"},[a("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.upwd2,expression:"upwd2",modifiers:{trim:!0}}],staticClass:"form-control col-md-7 col-xs-12",attrs:{type:"password"},domProps:{value:t.upwd2},on:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13))return null;t.onSubmit(e)},input:function(e){e.target.composing||(t.upwd2=e.target.value.trim())},blur:function(e){t.$forceUpdate()}}}),a("small",[t._v("請再輸入一次相同的密碼")])])]),a("div",{staticClass:"form-group"},[a("label",{staticClass:"control-label col-sm-3 col-xs-12"},[t._v("自動產生密碼")]),a("div",{staticClass:"col-sm-6 col-xs-12"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-xs-12"},[a("div",{staticClass:"form-inline"},[a("button",{staticClass:"btn btn-info",attrs:{type:"button"},on:{click:t.autopwd}},[t._v("產生密碼並貼到密碼欄")]),a("div",{staticClass:"input-group"},[a("input",{staticClass:"form-control",attrs:{id:"apwd",type:"text",readonly:"readonly"},domProps:{value:t.apwd}}),t._m(3)])])]),t._m(4)])])]),a("div",{staticClass:"form-group"},[t._m(5),a("div",{staticClass:"col-sm-6 col-xs-12"},[a("label",{staticClass:"radio-inline"},[a("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.role,expression:"role",modifiers:{trim:!0}}],attrs:{type:"radio",value:"admin",name:"role",disabled:"admin"!==t.me.role},domProps:{checked:t._q(t.role,"admin")},on:{__c:function(e){t.role="admin"}}}),t._v("管理者")]),a("label",{staticClass:"radio-inline"},[a("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.role,expression:"role",modifiers:{trim:!0}}],attrs:{type:"radio",value:"user",name:"role",checked:"checked",disabled:"admin"!==t.me.role},domProps:{checked:t._q(t.role,"user")},on:{__c:function(e){t.role="user"}}}),t._v("一般使用者")]),t._m(6)])]),a("div",{staticClass:"form-group"},[t._m(7),a("div",{staticClass:"col-sm-6 col-xs-12"},[a("label",{staticClass:"radio-inline"},[a("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.active,expression:"active",modifiers:{trim:!0}}],attrs:{type:"radio",value:"active",name:"act",checked:"checked",disabled:"admin"!==t.me.role},domProps:{checked:t._q(t.active,"active")},on:{__c:function(e){t.active="active"}}}),t._v("正常")]),a("label",{staticClass:"radio-inline"},[a("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.active,expression:"active",modifiers:{trim:!0}}],attrs:{type:"radio",value:"stop",name:"act",disabled:"admin"!==t.me.role},domProps:{checked:t._q(t.active,"stop")},on:{__c:function(e){t.active="stop"}}}),t._v("停用")]),t._m(8)])]),a("div",{staticClass:"ln_solid"}),a("div",{staticClass:"col-xs-12 flex-cc"},[a("button",{staticClass:"btn btn-default",attrs:{type:"button"},on:{click:t.onCancel}},[t._v("取消")]),a("button",{staticClass:"btn btn-success",attrs:{type:"button"},on:{click:t.onSubmit}},[t._v("送出")])])])]),t.dataDone?t._e():a("div",{staticClass:"inloading"},[a("i",{staticClass:"fa fa-circle-o-notch fa-spin"})])])])])])},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("label",{staticClass:"control-label col-sm-3 col-xs-12"},[t._v("Username"),a("span",{staticClass:"required"},[t._v("*")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("label",{staticClass:"control-label col-sm-3 col-xs-12"},[t._v("Password"),a("span",{staticClass:"required"},[t._v("*")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("label",{staticClass:"control-label col-sm-3 col-xs-12"},[t._v("Password再一次"),a("span",{staticClass:"required"},[t._v("*")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"input-group-addon cppwd",attrs:{"data-clipboard-target":"#apwd","data-toggle":"tooltip","data-placement":"top",title:"複製密碼"}},[a("i",{staticClass:"fa fa-clipboard"})])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"col-xs-12"},[a("small",[t._v("你也可以使用系統自動產生的密碼")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("label",{staticClass:"control-label col-sm-3 col-xs-12"},[t._v("權限"),a("span",{staticClass:"required"},[t._v("*")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("small",[t._v("【管理者】擁有最高權限，【一般使用者】只能觀看列表，無法修改檔案(除了自己的密碼以外)")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("label",{staticClass:"control-label col-sm-3 col-xs-12"},[t._v("帳號狀態"),a("span",{staticClass:"required"},[t._v("*")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("small",[t._v("如果有帳號使用者暫時不會使用時，可以選擇停用")])])}]}},53:function(t,e,a){var s=a(45);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);a(7)("6bdf319c",s,!0)}});