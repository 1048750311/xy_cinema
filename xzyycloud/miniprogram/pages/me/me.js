// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: "cloud://yiteng-movie-yisgi.7969-yiteng-movie-yisgi-1312401072/logo.jpg",
    nickname: "点击登录",
    isLogin: false
  },

  /** 更换头像 */
  changeAvatar(){
    wx.chooseImage({
      count: 1,
    }).then(res=>{
      console.log(res)
      this.setData({
        avatar: res.tempFilePaths[0]
      })
      // 把图片上传到服务端
      wx.cloud.uploadFile({
        cloudPath: 'a_'+Math.random()+'.jpg',
        filePath: res.tempFilePaths[0]
      }).then(uploadRes=>{
        console.log(uploadRes);
        let fileID = uploadRes.fileID;
        // 把图片与当前用户ID 绑定在一起，存入云数据库
        let openid = getApp().globalData.openid;
        // 更新数据库中的头像路径
        let db = wx.cloud.database();
        db.collection('users').where({
          _openid : openid
        }).update({
          data: {
            avatar: fileID
          }
        }).then(updateRes=>{
          console.log(updateRes)
        })
      })
    })
  },

  /** 点击头像后的操作 */
  tapAvatar(){
    if(this.data.isLogin){ // 已登录，执行选择图片更换头像
      this.changeAvatar();
    }else{  // 未登录，则执行登录
      wx.getUserProfile({
        "lang": "zh_CN",
        "desc": "您的信息将用于登录小程序"
      }).then(res=>{
        console.log(res)
        // 去云函数获取openid，然后通过openid查询云数据库，验证是否已注册
        wx.cloud.callFunction({
          name: 'login'
        }).then(loginRes=>{
          let openid = loginRes.result.openid;
          getApp().globalData.openid = openid;
          //通过openid查询云数据库，验证是否已注册
          let db = wx.cloud.database();
          db.collection('users').where({
            _openid : openid
          }).get().then(queryRes=>{
            console.log(queryRes)
            if(queryRes.data.length!=0){ // 已经注册过了 
              this.setData({
                avatar: queryRes.data[0].avatar,
                nickname: queryRes.data[0].nickname,
                isLogin: true
              })
            }else{ // 没有注册过，第一次登录，执行注册
              // 插入数据库
              db.collection('users').add({
                data: {
                  avatar: res.userInfo.avatarUrl,
                  nickname: res.userInfo.nickName
                }
              })
              this.setData({
                avatar: res.userInfo.avatarUrl,
                nickname: res.userInfo.nickName,
                isLogin: true
              })
            }
          })
        })



      })
    }

  },

  doubletapEvent(){
    console.log('自定义组件出发了doubleclick..')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})