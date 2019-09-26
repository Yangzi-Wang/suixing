// pages/fens/fens.js
const app = getApp()
const API = require('../../API/api');
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleBarHeight: 32,
    titlebar_height: 0,
    item_icon_position: 0,
    header_position: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        that.setData({
         // sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2 - 2,
         // sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          item_icon_position: res.statusBarHeight + 13,
          titlebar_height: res.statusBarHeight + 50,
          header_position: res.statusBarHeight + 33,
         // navbar_position: res.statusBarHeight + 43,
         // content_position: res.statusBarHeight + 100,
         // current_windowWidth: res.windowWidth
        })
      },
    })

if(options.key==0){   //我的关注
  API.getInterestList(app.globalData.userid).then(res => {
    that.setData({
      list: res.interest
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

  return:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})