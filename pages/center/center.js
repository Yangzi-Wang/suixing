const app = getApp()
const API = require('../../API/api');
const util = require('../../utils/util.js')
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
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

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // item_icon_position: 0,
    // titleBarHeight: 32,
    // titlebar_height: 0,
    // header_position: 0,
    navbar_position: 0,
    navbar_position2: 0,
    content_position: 0,
    content_position2: 0,
    topNum: 0,
    topNum3: 0,
    topNum4: 0,
    index_second: 3,

    //followNum: 0,
    //fansNum: 0,
    currentContentId: 0,
    currentImgId: 0,

    //用户信息
    userInfo: {},
    //收藏列表
    collections:[],
    //是否关注
    follow:false,
  },

  follow(){
    let that = this
    let data = {
      userid:this.data.userInfo._id,
      myid:app.globalData.userid
    }
    //关注
    !that.data.follow&&API.follow(data).then(res=>{
      if(res.success){
        util.showSuccess(res.msg)
        that.setData({
          follow:true
        })
      }
    })
    //取消关注
    that.data.follow&&API.followCancel(data).then(res=>{
      if(res.success){
        that.setData({
          follow:false
        })
      }
    })
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
        id: this.data.userInfo._id,
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

  onLoad: function (options) {
    let that = this;

    //获取用户信息
    let data = {
      id: options.userid,
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }
    API.getUser(data).then(res=>{
      console.log(res)
      let follow = false
      if(res.follow.indexOf(app.globalData.userid)!=-1) follow=true
      that.setData({
        userInfo:res,
        follow:follow
      })
    })

    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2 - 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          // item_icon_position: res.statusBarHeight + 13,
          // titlebar_height: res.statusBarHeight + 34,
          // header_position: res.statusBarHeight + 33,
          navbar_position: 151,//res.statusBarHeight + 185,
          navbar_position2: 200,//res.statusBarHeight + 234,
          content_position: 210,//res.statusBarHeight + 244,
          content_position2: 36,//res.statusBarHeight + 70,
          sliderLeft2: res.screenWidth / 4,
          current_windowWidth: res.windowWidth,
        })
        //console.log(that.item_icon_position);
      },
    })
  },
})
