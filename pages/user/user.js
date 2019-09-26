//index.js
//获取应用实例
const app = getApp()
const API = require('../../API/api');
const util = require('../../utils/util.js')
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    motto: 'Hello World',
    inputVal: "",
    inputShowed: false,
    tabs: ["活动", "话题", "收藏"],
    tabs_second: ["发布过", "参与过"],
    tabs_topic: ["发布过", "浏览过"],
    sliderOffset: 0,
    sliderLeft: 0,
    activeIndex: 1,
    sliderOffset2: 0,
    sliderLeft2: 0,
    activeIndex2: 3,
    current_windowWidth: 0,
    userInfo: {
      nickName:"未登录",
      avatarUrl:'',
      intro:''
    },
    authorized: false,
    collections:[],


    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item_icon_position: 0,
    titleBarHeight: 32,
    content: ["", "", "", ""],
    titlebar_height: 0,
    header_position: 0,
    navbar_position: 0,
    navbar_position2: 0,
    content_position: 0,
    content_position2: 0,
    topNum: 0,
    topNum3: 0,
    topNum4: 0,
    index_second: 3,
    followNum: 0,
    fansNum: 0,
    currentContentId: 0,
    currentImgId: 0,
    like: "",
  },

  // getId: function (e) {
  //   //console.log(e)
  //   var that = this
  //   that.setData({
  //     currentContentId: e.currentTarget.id,
  //     currentImgId: e.target.id
  //   })
  //   if (e.target.id != "") {
  //     wx.previewImage({
  //       current: that.data.myTopics[that.data.currentContentId].images[that.data.currentImgId],
  //       urls: that.data.myTopics[that.data.currentContentId].images,
  //       success: function (res) { },
  //       fail: function (res) { },
  //       complete: function (res) { },
  //     })
  //   }
  // },

  like: function () {
    var that = this
    if (that.data.likeBool) {
      that.setData({
        like: "https://cloud-minapp-26901.cloud.ifanrusercontent.com/1hWThugmGDwCoqyx.png",
        likeBool: false
      })
    } else {
      that.setData({
        like: "https://cloud-minapp-26901.cloud.ifanrusercontent.com/1hWf6lmIXvw47oJs.png",
        likeBool: true
      })
    }

  },

  // loadMyTopics: function () {

  //   let topicId = getApp().globalData.topic_id
  //   let Topics = new wx.BaaS.TableObject(topicId)
  //   let query = new wx.BaaS.Query()

  //   query.compare('created_by', '=', wx.BaaS.storage.get('uid'))

  //   Topics.expand('created_by').setQuery(query).orderBy(['-created_at']).find().then(res => {
  //     //console.log(res)
  //     this.setData({
  //       myTopics: res.data.objects
  //     })
  //   }, err => {

  //   })

  // },

  bindGetUserInfo: function (e) {
    let that = this;
    let userInfo = e.detail.userInfo
    if (userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = userInfo
      let data = {}
      data.nickName = userInfo.nickName
      data.avatarUrl = userInfo.avatarUrl
      data.userid = app.globalData.userid
      API.updateUserInfo(data)
        .catch(error => {
          util.showToast('网络错误')
        })
        .then(res => {
          console.log(res)
          // that.setData({
          //   userInfo: res,
          //   authorized:true
          // })
          let data2 = {
            id: app.globalData.userid,
            lat: app.globalData.lat,
            lng: app.globalData.lng
          }
          API.getUser(data2).then(res=>{
            that.setData({
              authorized:true,
              userInfo:res
            })
          })
        })
    } else {
      //用户按了拒绝按钮
    }
  },

  getLocation: function (e) {
    var that = this
    console.log(e)
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log(res)
      }
    })
  },

  inputTyping: function (e) {
    var that = this
    //console.log(e.detail);
    that.setData({
      inputVal: e.detail.value
    });
    //console.log(this.data.inputVal);

  },

  onPageScroll: function (e) {
    //console.log(e)
    //console.log(this.data.activeIndex);
    if (this.data.activeIndex2 == 3) {
      this.setData({
        topNum3: e.detail.scrollTop,
      });
      //console.log(this.data.topNum3)
    };
    if (this.data.activeIndex2 == 4) {
      this.setData({
        topNum4: e.detail.scrollTop,
      });
      //console.log(this.data.topNum4)
    };
    //console.log(this.data.topNum3);
    //console.log(this.data.topNum4)
  },

  tabClick: function (e) {
    //console.log(e)//获取滚动条当前位置的值

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    //加载收藏列表
    if(e.currentTarget.id==2){
      let data = {
        id: app.globalData.userid,
        lat: app.globalData.lat,
        lng: app.globalData.lng
      }
      API.getCollectList(data).then(res=>{

        this.setData({
          collections:res
        })
      })
    }
  },

  tabClick2: function (e) {
    //console.log(e)//获取滚动条当前位置的值
    this.setData({
      sliderOffset2: e.currentTarget.offsetLeft,
      activeIndex2: e.currentTarget.id,
    });
    if (e.currentTarget.id == 3) {
      this.setData({
        topNum: this.data.topNum3
      });
    };
    if (e.currentTarget.id == 4) {
      this.setData({
        topNum: this.data.topNum4
      });
    };
  },

  onSwiperchange: function (e) {
    //console.log(e)//获取滚动条当前位置的值
    this.setData({
      activeIndex: e.detail.current,
    });
    this.setData({
      sliderOffset: this.data.current_windowWidth / this.data.tabs.length * this.data.activeIndex,
    });
    //console.log(e)
    //console.log(this.data.activeIndex)
    //console.log(this.data.sliderOffset)
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },


  onLoad: function () {
    var that = this;
    // that.loadMyTopics()

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权
          let data = {
            id: app.globalData.userid,
            lat: app.globalData.lat,
            lng: app.globalData.lng
          }
          API.getUser(data).then(res=>{
            that.setData({
              authorized:true,
              userInfo:res
            })
            // console.log(res)
          })
        }
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2 - 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          item_icon_position: res.statusBarHeight + 13,
          titlebar_height: res.statusBarHeight + 34,
          header_position: res.statusBarHeight + 33,
          navbar_position: res.statusBarHeight + 185,
          navbar_position2: res.statusBarHeight + 234,
          content_position: res.statusBarHeight + 244,
          content_position2: res.statusBarHeight + 70,
          sliderLeft2: res.screenWidth / 4,
          current_windowWidth: res.windowWidth,
        })
        //console.log(that.item_icon_position);
      },
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        avatar: app.globalData.userInfo.avatarUrl,
        userName: app.globalData.userInfo.nickName,
        authorized: true
      })
    } /*else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          authorized: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            authorized: true
          })
        }
      })
    }*/
  },

  getUserInfo: function (e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      authorized: true
    })
  }
})
