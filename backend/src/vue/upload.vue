<template lang="pug">
  div
    .row
      .col-md-12
        button.btn.btn-default(type="button" @click="uploadClick") Upload
        input#f0_ufile(type="file" name="files" multiple="multiple" @change="ufileChanged" accept=".jpg,.png|image/*")
      div
        canvas#mycanvas
        button.btn.btn-default(type="button" @click="uploadCanvasClick") UploadCanvas
</template>
<script>
// import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
    };
  },
  watch: {

  },
  computed: {

  },
  methods: {
    uploadClick() {
      $('#f0_ufile').click();
    },
    ufileChanged(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.doUpload(files);
    },
    ajaxUpload(uploadURL, formdata, onprogress) {
      const ajax = $.ajax({
        xhr() {
          const xhr = $.ajaxSettings.xhr();
          if (onprogress) {
            if (xhr.upload) xhr.upload.addEventListener('progress', onprogress, false);
          }
          return xhr;
        },
        url: uploadURL,
        type: 'POST',
        dataType: 'json',
        data: formdata,
        contentType: false,
        processData: false,
      });
      return ajax;
    },
    doUpload(files) {
      const uploadURL = 'http://localhost:8080/api/upload';
      const formdata = new FormData();
      if (typeof files === 'string') {
        formdata.append('files', files, 'base64.jpg');
      } else {
        for (let i = 0; i < files.length; i++) {
          formdata.append('files', files[i]);
        }
      }
      formdata.append('test', '測試');

      this.ajaxUpload(uploadURL, formdata, (event) => {
        let percent = 0;
        const position = event.loaded || event.position;
        const total = event.total;
        if (event.lengthComputable) {
          percent = Math.ceil((position / total) * 100);
        }
        console.log(percent);
      }).done((pdata) => {
        $('#f0_ufile').val('');
        console.log(pdata);
      });
    },

    uploadCanvasClick() {
      const c = document.getElementById('mycanvas');
      const jpegUrl = c.toDataURL();
      $.ajax({
        url: 'http://localhost:8080/api/uploadBase64',
        method: 'POST',
        datatype: 'json',
        data: {
          photo: jpegUrl,
        },
      }).done((d) => {
        console.log(d);
      });
    },
  },
  beforeRouteUpdate(to, from, next) {

  },
  created() {
    setTimeout(() => {
      const c = document.getElementById('mycanvas');
      c.width = 500;
      c.height = 500;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(0, 0, 500, 500);
      ctx.fillStyle = '#FFFF00';
      ctx.fillRect(400, 300, 100, 200);
    }, 500);
  },
  beforeDestroy() {
  },
};
</script>
<style scoped lang="stylus">
#f0_ufile
  display none
</style>
