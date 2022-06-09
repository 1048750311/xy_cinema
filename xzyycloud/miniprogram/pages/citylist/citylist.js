// pages/citylist/citylist.js
const map = require('../../libs/map')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    citymap: {},
    currentLetter: 'A',
    cityname: '定位中...',
    locOK: false   //代表当前定位成功
  },

  /** 点击当前城市 */
  tapCurrentCity(){
    if(this.data.locOK){ // 定位成功，点击当前城市应该回传数据
      // 把data.cityname存入globalData
      getApp().globalData.CITYNAME = this.data.cityname;
      wx.navigateBack();
    }else{
      // 定位失败，点击当前城市，重新定位
      this.loadLocation();
    }

  },

  /** 当选择某个城市后 执行 */
  chooseCity(event){
    let city = event.currentTarget.dataset.city;
    // 把city存入app.globalData
    getApp().globalData.CITYNAME = city;
    // 回到上一页
    wx.navigateBack()
  },

  /** 点击右侧边栏字母后执行 */
  tapLetter(event){
    let letter = event.currentTarget.dataset.letter;
    this.setData({
      currentLetter: letter
    })
  },

  /** 通过腾讯位置服务 加载当前位置 */
  loadLocation(){
    this.setData({
      cityname: '定位中...'
    })
    let qqmapsdk = getApp().globalData.qqmapsdk;
    qqmapsdk.reverseGeocoder({
      success: (res)=>{   // 将会在逆地址解析成功后执行
        console.log(res)
        // 修改cityname的值
        this.setData({
          cityname: res.result.address_component.city,
          locOK: true
        })
      },
      fail: (err)=>{
        console.warn(err)
        // 逆地址解析失败后执行
        this.setData({
          cityname: '定位失败，点击重试',
          locOK: false
        })
        // 弹出窗口提示用户，没有权限，希望赋予权限
        wx.showModal({
          title: '提示',
          content: '获取当前位置需要授权，是否跳转到设置页面？',
          success: (res)=>{
            console.log(res);
            if(res.confirm){ // 用户点击了确定按钮
              // 执行跳转，跳转到小程序设置页面
              wx.openSetting({
                success: (settingRes)=>{
                  console.log(settingRes)
                  if(settingRes.authSetting['scope.userLocation']){
                    this.loadLocation();
                  }
                }
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      citymap: map
    })
    this.loadLocation();
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