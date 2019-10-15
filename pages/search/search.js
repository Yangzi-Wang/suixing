// pages/search/search.js
const app = getApp()
const API = require('../../API/api');
Page({
  data: {
    titlebar_height: 0,
    item_icon_position: 0,
    teams: [],
    topics: []
  },

  return() {
    wx.navigateBack({
      delta: 1
    })
  },

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
          // header_position: res.statusBarHeight + 33,
          // navbar_position: res.statusBarHeight + 43,
          // content_position: res.statusBarHeight + 100,
          // current_windowWidth: res.windowWidth
        })
        //console.log(that.item_icon_position);
      },
    })

    /**
     * 搜索接口
     */
    if(options.key){
    let data = {
      key: options.key,
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }
    API.search(data).then(res => {
      console.log(res)
      that.setData({
        teams: res.teams,
        topics: res.topics
      })
    })
  }else if(options.opt){
    let data = JSON.parse(options.opt)
    console.log(data)
    API.sieve(data).then(res=>{
      that.setData({
        teams: res.teams,
      })
    })

  }

  },
  onShow: function () {

  }
})