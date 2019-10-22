// pages/search/search.js
const app = getApp()
const API = require('../../API/api')
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置
let current_windowWidth = 0

Page({
  data: {
    tabs: ["组队", "话题"],
    sliderOffset: 0,
    sliderLeft: 0,
    activeIndex: 0,
    content_position: 0,
    teams: [],
    topics: []
  },

  return() {
    wx.navigateBack({
      delta: 1
    })
  },
  tabClick: function (e) {
    //console.log(e)//获取滚动条当前位置的值

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onSwiperchange: function (e) {
    //console.log(e)//获取滚动条当前位置的值
    this.setData({
      activeIndex: e.detail.current,
      sliderOffset: current_windowWidth / this.data.tabs.length * e.detail.current
    })
    //console.log(this.data.activeIndex)
    //console.log(this.data.sliderOffset)
  },

  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        current_windowWidth = res.windowWidth
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2 - 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          content_position: res.statusBarHeight + 35
        })
      },
    })


    /**
     * 搜索接口
     */
    if (options.key) {
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
    } else if (options.opt) {
      let data = JSON.parse(options.opt)
      console.log(data)
      API.sieve(data).then(res => {
        that.setData({
          teams: res.teams,
        })
      })

    }

  },
  onShow: function () {

  }
})