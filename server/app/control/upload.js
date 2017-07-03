const multer = require('multer');
const utils = require('../lib/utils');
const validators = require('../lib/validators.js');
const fs = require('fs');

const fn = {};

const uploadMode1 = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './server/public/uploads/temp');
    },
    // 改名
    filename: (req, file, cb) => {
      // console.log(file);
      let ext = '';
      // 取得原本檔案的副檔名
      if (file.originalname.indexOf('.') > 0) {
        ext = `.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`;
      }
      // 如果是圖檔，自己指定副檔名
      if (file.mimetype === 'image/jpeg') ext = '.jpg';
      if (file.mimetype === 'image/png') ext = '.png';
      cb(null, `${utils.newID()}${ext}`);
    },
  });
  const mu = multer({
    storage,
    // 最多5mb
    limits: { fileSize: 5 * 1024 * 1024 },
    // 過濾檔案類型
    fileFilter(req, file, cb) {
      const filetypes = /jpeg|jpg|png|pdf/;
      const mimetype = filetypes.test(file.mimetype);
      if (mimetype) return cb(null, true);
      return cb(new Error('Wrong file type'));
    },
  });
  const upload = mu.array('files');
  return upload;
};
const uMode1 = uploadMode1();
fn.upload = (req, res, next) => {
  uMode1(req, res, (err) => {
    if (err) {
      return next(err);
    }
    // console.log(req.files);
    const f = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        f.push(`/uploads/temp/${req.files[i].filename}`);
      }
    }
    // 其它參數仍然可以用req.body取得
    // console.log(req.body.test);
    return res.json({
      status: 'OK', data: { files: f },
    });
  });
};

fn.uploadBase64 = (req, res, next) => {
  // console.log(req.body['photo[]']);
  const photo = validators.toStr(req.body.photo);
  const buffer = utils.decodeBase64(photo);
  if (!buffer) {
    return next('E006010');
  }
  let filename = utils.newID();
  if (buffer.type === 'image/png') {
    filename += '.png';
  } else {
    filename += '.jpg';
  }
  return fs.writeFile(`./server/public/uploads/temp/${filename}`, buffer.data, (err) => {
    if (err) return next(err);
    return res.json({
      status: 'OK',
    });
  });
};

module.exports = fn;
