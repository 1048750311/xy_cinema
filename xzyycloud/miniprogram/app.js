// app.js
App({
  onLaunch() {
    // 初始化腾讯位置服务SDK
    let QQMapWX = require('libs/qqmap-wx-jssdk');
    let qqmapsdk = new QQMapWX({
      key: 'X7VBZ-COYLX-RUR4M-7LA6T-XSRR2-3BBUV'
    })
    this.globalData.qqmapsdk = qqmapsdk;
    // 初始化云服务
    wx.cloud.init({
      env: 'yiteng-movie-yisgi'
    })
  },
  globalData: {
    userInfo: null,
    CITYNAME: '未选择',
    qqmapsdk: null,
    openid: 0
  }
})
