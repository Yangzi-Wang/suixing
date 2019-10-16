//index.js
//获取应用实例
const app = getApp()
const API = require('../../API/api')
const util = require('../../utils/util.js')
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置
let lat = null, lng = null;   //经纬度信息
let sieve_city;

Page({
  data: {
    tabs: ["附近组队", "热门话题"],
    sliderOffset: 0,
    sliderLeft: 0,
    activeIndex: 1,
    current_windowWidth: 0,
    current_windowHeight: 0,
    // userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item_icon_position: 0,
    titlebar_height: 0,
    header_position: 0,
    navbar_position: 0,
    content_position: 0,
    content_position2: 0,
    titleBarHeight: 32,
    
    show_modal: false,
    city: '定位中',
    date: '',   //时间选择器
    labels: [],  //标签
    labelsArr: [],   //
    teams: [],
    hotTopics: [],
    // myTopics: [],
    isLogin: false,
    maxDistance: '3km'
    // currentContentId:0,
    // currentImgId:0,
    //like:"https://cloud-minapp-26901.cloud.ifanrusercontent.com/1hWThugmGDwCoqyx.png",
    // likeBool:false
  },

  /*getId: function (e) {
    console.log(e.currentTarget.id)
    console.log(e.target.id)
    var that = this
    // that.setData({
    //   currentContentId:e.currentTarget.id,
    //   currentImgId:e.target.id
    // })
    // if(e.target.id != ""){
    //   wx.previewImage({
    //     current: that.data.hotTopics[that.data.currentContentId].images[that.data.currentImgId],
    //     urls: that.data.hotTopics[that.data.currentContentId].images,
    //     success: function (res) { },
    //     fail: function (res) { },
    //     complete: function (res) { },
    //   })
    // }
  },*/


//获取话题列表
  loadHotTopics: function (maxDistance) {
    let data = {
      lat: lat,
      lng: lng,
      getNear: true,
      maxDistance: maxDistance || 10000
    }

    API.getTopics(data).then(res => {
      //  console.log(res)
      // const topics = res.map(item => {
      //格式化日期
      // item.updatedAt=util.formatTime(new Date(item.updatedAt))

      // if (item.good && item.good.indexOf(app.globalData.userid) != -1) {
      //   item.likeBool = true
      // } else {
      //   item.likeBool = false
      // }
      // return item
      // })

      this.setData({
        hotTopics: res
      })
    })
  },

  //获取组队列表
  loadTeams: function (maxDistance) {
    let data = {
      lat: lat,
      lng: lng,
      getNear: true,
      maxDistance: maxDistance || 3
    }

    API.getTeams(data).then(res => {
      // const teams = res.map(item => {
      //   item.updatedAt=util.formatTime(new Date(item.updatedAt))

      //   if (item.good && item.good.indexOf(app.globalData.userid) != -1) {
      //     item.likeBool = true
      //   } else {
      //     item.likeBool = false
      //   }
      //   return item
      // })
      this.setData({
        teams: res
      })
    })
  },

  //距离变化监听
  distanceChange(e) {
    if (e.detail.value == 0.5) {
      this.setData({
        maxDistance: e.detail.value * 1000 + 'm'
      })
    } else {
      this.setData({
        maxDistance: e.detail.value + 'km'
      })
    }
    this.loadTeams(e.detail.value)

  },

  bindDateChange(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  //转跳到搜索页
  search: function (e) {
    wx.navigateTo({
      url: '../search/search?key=' + e.detail.value
    })
  },

  onPageScroll: function (e) {

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
    });
    this.setData({
      sliderOffset: this.data.current_windowWidth / this.data.tabs.length * this.data.activeIndex,
    });
    // console.log(e)
    // console.log(this.data.activeIndex)
    // console.log(this.data.sliderOffset)
  },

  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  showChooseModal() {
    this.animation.translateX(-237).step(),
      this.setData({
        animation: this.animation.export(),
        show_modal: true,
      })
  },

  closeChooseModal() {
    this.animation.translateX(237).step(),
      this.setData({
        animation: this.animation.export(),
        show_modal: false,
      })
  },

  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
  },

  onLoad: function () {
    let that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2 - 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          current_windowHeight: res.windowHeight,
          item_icon_position: res.statusBarHeight + 13,
          titlebar_height: res.statusBarHeight + 50,
          header_position: res.statusBarHeight + 33,
          navbar_position: res.statusBarHeight + 110,
          content_position: res.statusBarHeight + 165,
          current_windowWidth: res.windowWidth
        })
        //console.log(that.item_icon_position);
      },
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


    //首页定位城市，获取经纬度信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                // wx.showToast({
                //   title: '拒绝授权',
                //   icon: 'none',
                //   duration: 1000
                // })
                that.getDefaultLocation()
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                      console.log('2')
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation()
        }
        else {
          //调用wx.getLocation的API
          that.getLocation()
        }
      }
    })

    this.getLabels()
  },

  onShow: function () {
    // wx.showToast({
    //   title: '一键转发到朋友圈呀！',
    //   icon: 'none',
    //   duration: 2000
    // })
    if (lat && lng) {
      this.loadHotTopics()
      this.loadTeams()
    }

  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getLocation: function () {
    let that = this
    console.log('定位')
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        lat = res.latitude
        lng = res.longitude
        app.globalData.lat = lat
        app.globalData.lng = lng
        console.log(lat, lng)
        API.locate({
          lat: lat,
          lng: lng
        }).then(res => {
          that.setData({
            city: res.city
          })
          sieve_city = res.city
        })
        that.loadHotTopics()
        that.loadTeams()
      }
    })
  },

  //如果取消授权获取地理位置，默认处理
  getDefaultLocation: function () {
    let that = this

    lat = 23.117
    lng = 113.27
    app.globalData.lat = lat
    app.globalData.lng = lng

    API.locate({
      lat: lat,
      lng: lng
    }).then(res => {
      res.city && that.setData({
        city: res.city
      })
      sieve_city = res.city || '广州市'
      res.msg && console.log(res.msg)
    })
    that.loadHotTopics()
    that.loadTeams()
  },

  //获取全部标签
  getLabels() {
    API.getLabels().then(res => {
      this.setData({
        labelsArr: res
      })
    })
  },

  //筛选中监听标签选择
  bindLabelChange(e) {
    let newArr = this.data.labels
    newArr.push(this.data.labelsArr[e.detail.value])
    this.setData({
      labels: newArr
    })
  },

  //筛选中监听选择的城市
  onGetRegion(e) {
    sieve_city = e.detail.city
  },

  //筛选
  sieve() {
    this.animation.translateX(237).step(),
      this.setData({
        animation: this.animation.export(),
        show_modal: false,
      })
    let labels = this.data.labels.map(item => {
      return item._id
    })
    let data = {
      type: 0,
      lat: app.globalData.lat,
      lng: app.globalData.lng,
      labels: labels,
      date: this.data.date,
      city: sieve_city
    }
    wx.navigateTo({
      url: '../search/search?opt=' + JSON.stringify(data)
    })

  },

  //重置标签
  labelsClean() {
    this.setData({
      labels: []
    })
  }
})
