webpackJsonp([3],{37:function(t,a,e){e(56);var n=e(6)(e(42),e(52),"data-v-4f758f9e",null);t.exports=n.exports},42:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.default={data:function(){return{}},watch:{},computed:{},methods:{uploadClick:function(){$("#f0_ufile").click()},ufileChanged:function(t){var a=t.target.files||t.dataTransfer.files;this.doUpload(a)},ajaxUpload:function(t,a,e){return $.ajax({xhr:function(){var t=$.ajaxSettings.xhr();return e&&t.upload&&t.upload.addEventListener("progress",e,!1),t},url:t,type:"POST",dataType:"json",data:a,contentType:!1,processData:!1})},doUpload:function(t){var a=new FormData;if("string"==typeof t)a.append("files",t,"base64.jpg");else for(var e=0;e<t.length;e++)a.append("files",t[e]);a.append("test","測試"),this.ajaxUpload("http://localhost:8080/api/upload",a,function(t){var a=0,e=t.loaded||t.position,n=t.total;t.lengthComputable&&(a=Math.ceil(e/n*100)),console.log(a)}).done(function(t){$("#f0_ufile").val(""),console.log(t)})},uploadCanvasClick:function(){var t=document.getElementById("mycanvas"),a=t.toDataURL();$.ajax({url:"http://localhost:8080/api/uploadBase64",method:"POST",datatype:"json",data:{photo:a}}).done(function(t){console.log(t)})}},beforeRouteUpdate:function(t,a,e){},created:function(){setTimeout(function(){var t=document.getElementById("mycanvas");t.width=500,t.height=500;var a=t.getContext("2d");a.fillStyle="#FF0000",a.fillRect(0,0,500,500),a.fillStyle="#FFFF00",a.fillRect(400,300,100,200)},500)},beforeDestroy:function(){}}},48:function(t,a,e){a=t.exports=e(5)(),a.push([t.i,"#f0_ufile[data-v-4f758f9e]{display:none}",""])},52:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("div",{staticClass:"row"},[e("div",{staticClass:"col-md-12"},[e("button",{staticClass:"btn btn-default",attrs:{type:"button"},on:{click:t.uploadClick}},[t._v("Upload")]),e("input",{attrs:{id:"f0_ufile",type:"file",name:"files",multiple:"multiple",accept:".jpg,.png|image/*"},on:{change:t.ufileChanged}})]),e("div",[e("canvas",{attrs:{id:"mycanvas"}}),e("button",{staticClass:"btn btn-default",attrs:{type:"button"},on:{click:t.uploadCanvasClick}},[t._v("UploadCanvas")])])])])},staticRenderFns:[]}},56:function(t,a,e){var n=e(48);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);e(7)("591e6ad8",n,!0)}});