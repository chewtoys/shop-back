const multer = require('koa-multer');
const path = require('path');

const storage = multer.diskStorage({
  // 文件保存路径
  destination(req, file, cb){
    cb(null, 'static/upload/')
  },
  // 修改文件名称
  filename(req, file, cb){
    const filenameArr = file.originalname.split('.');
    cb(null,Date.now() + '.' + filenameArr[filenameArr.length-1]);
  }
});

const upload = multer({storage: storage});

module.exports = upload;