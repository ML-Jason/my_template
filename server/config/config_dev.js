// 設定會依環境ENV而改變的 變數、sensitive data等等
const config = {

  PORT: process.env.PORT || 8080,

  // 如果允許CORS的話，允許的origin列在這裡(要有protocol)，設為true則是開放所有
  ALLOW_DOMAIN: ['http://localhost:8088', 'http://127.0.0.1:8088'],

  // 要啟動的db connection資訊，如果只有一個的話，會用預設的mongoose當connection
  DB: {
    mlab: {
      pool: 5,
      uri: 'mongodb://localhost/template',
    },
  },

  JWT_SECRET: 'dev',
  GITHUB_SECRET: '..........',
  GITHUB_APP_ID: '..........',
  GITHUB_APP_SECRET: '..........',
};

// 把環境對應的config存到global.config裡
global.config = config;
module.exports = global;
