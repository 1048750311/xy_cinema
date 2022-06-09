// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    movielist : [],
    pageno : 1,   // 存储页码
    cid : 1,       // 存储当前类别ID
    cityname : '未选择'
  },

  /** 点击左上角，跳转到城市列表页面 */
  tapToCitylist(){
    wx.navigateTo({
      url: '/pages/citylist/citylist'
    })
  },

  /** 点击顶部导航时，执行该方法 */
  tapNav(event){
    let id = event.target.dataset.id
    if(id == this.data.cid){
      return;
    }
    this.setData({
      cid : id,
      pageno: 1  // 当切换选项卡时，把pageno重置为1。
    })
    // 拿着id先去缓存找一圈，如果有数据，则直接加载即可。
    wx.getStorage({
      key: id+"",
      success: (result)=>{  // 从缓存中可以读取到数据 
        this.setData({
          movielist: result.data
        })
      },
      fail: (err)=>{ // 从缓存中没有读到数据，将会回调fail
        // 发送请求，加载当前选中项下的第一页电影数据
        this.loadData(id, 0).then(movies=>{
          this.setData({
            movielist: movies
          })
          // 把movies存入Storage，把当前类别下的第一页数据缓存下来
          wx.setStorage({
            data: movies,
            key: id+""    // storage的key只能是字符串
          })
        })
      }
    })
  },

  /** 加载电影列表数据 
   *  @param cid: 查询电影列表时传递的类别id
   *  @param offset: 分页加载时，读取记录的起始位置
   *  @returns 将以promise的方式返回查到的结果
   */
  loadData(cid, offset){
    // wx.showLoading({
    //   title: '加载中...',
    // })
    console.log(`cid: ${cid}, offset: ${offset}`)
    return new Promise((resolve, reject)=>{
      wx.request({
        url: 'https://api.tedu.cn/index.php',
        method: 'GET',
        data: {
          cid: cid,
          offset: offset
        },
        success: (result)=>{
          // 响应成功后，回调resolve，把电影列表交给loadData的调用者
          resolve(result.data) 
          // wx.hideLoading()
        }
      })
    });
  },

  /** 通过腾讯位置服务 加载当前位置 */
  loadLocation(){
    let qqmapsdk = getApp().globalData.qqmapsdk;
    qqmapsdk.reverseGeocoder({
      success: (res)=>{
        console.log(res)
        // 修改cityname的值
        let city = res.result.address_component.city;
        this.setData({
          cityname: city
        })
        // 把cityname更新到app的globaldata中
        getApp().globalData.CITYNAME = city;
      }
    })
  },

  /** 当页面初始化加载时执行 */
  onLoad() {
    // 获取当前位置
    // wx.getLocation({
    //   isHighAccuracy: true,
    //   altitude: true,
    //   type: 'gcj02',
    //   success: (res)=>{
    //     console.log(res);
    //   }
    // })
    this.loadLocation();


    // 发送请求，获取热映类别(cid=1)下的电影列表
    this.loadData(1, 0).then(movies=>{
      // movies 即是从服务端加载到的列表数据
      this.setData({
        movielist: movies
      })
    })
  },

  onShow(){
    // 从app.globalData中获取城市名，设置
    this.setData({
      cityname: getApp().globalData.CITYNAME
    })
  },

  /** 在触底后执行 */
  onReachBottom(){
    // 修改data中的值有两种方式
    // 1. this.data.pageno++            不会更新UI
    // 2. this.setData({pageno : 2})    将会把pageno的值更新到视图层
    this.data.pageno++;
    // 发送请求，获取当前类别的下一页数据
    let offset = (this.data.pageno-1) * 20;
    let cid = this.data.cid;
    this.loadData(cid, offset).then(movies=>{
      this.setData({
        movielist: [...this.data.movielist, ...movies]
      })
    })
  },

  /** 当在当前页面中执行下拉刷新时 触发 */
  onPullDownRefresh(){
    console.log('pulldown..')
    // 获取当前cid， 调用API  访问当前cid下的第一页数据
    // 一旦新数据加载完毕，把新数据存入缓存
    this.loadData(this.data.cid, 0).then(movies=>{
      // 更新当前列表
      this.setData({
        movielist: movies
      })
      // 重新存入缓存
      wx.setStorage({
        data: movies,
        key: this.data.cid+'',
      })
      // 停止下拉刷新效果
      wx.stopPullDownRefresh()
    })
  }
})
