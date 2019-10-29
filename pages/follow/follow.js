const app = getApp()
const API = require('../../API/api');

Page({
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

if(options.key==0){   //我的关注
  API.getFollowList(app.globalData.userid).then(res => {
    that.setData({
      list: res.follow
    })
  })
  wx.setNavigationBarTitle({
    title: '我的关注'
  })
}else if(options.key==1){     //我的粉丝
  API.getFansList(app.globalData.userid).then(res => {
    that.setData({
      list: res
    })
  })
  wx.setNavigationBarTitle({
    title: '我的粉丝'
  })
}
    

  },
  navToCenter(e){
    wx.navigateTo({
      url:'../center/center?userid='+e.currentTarget.id
    })
  },
})