// pages/masagepage/masagepage.js
const app = getApp()
const API = require('../../API/api')
const util = require('../../utils/util.js')
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    tabs: ["讨论组", "信息"],
    sliderOffset: 0,
    sliderLeft: 0,
    activeIndex: 0,
    // userInfo: {},
    current_windowWidth: 0,
    // current_windowHeight: 0,
    // item_icon_position: 0,
    // titlebar_height: 0,
    // header_position: 0,
    // navbar_position: 0,
    content_position: 0,
    // content_position2: 0,
    // titleBarHeight: 32,
    // content: ["", "", ""],
    btn_width:0,
    msg:[],

    isLogin: false,
    chat:[],
    mas:[],
    chatnum:[]
  },

  agree(e){
    API.agree(e.currentTarget.id).then(res=>{
      if(res.success) util.showSuccess("已同意")
    })
  },
  onLoad: function (options) {
    let that = this;
     wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
           sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2 - 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          // item_icon_position: res.statusBarHeight + 13,
          // titlebar_height: res.statusBarHeight + 50,
          // header_position: res.statusBarHeight + 33,
          //  navbar_position: res.statusBarHeight + 43,
          content_position: res.statusBarHeight+35 ,
          //  current_windowWidth: res.windowWidth
          btn_width:res.windowWidth - 270,

        })
      },
    })
  //  获取消息列表
    API.getMsg(app.globalData.userid).then(res=>{
<<<<<<< HEAD
=======
      // console.log(res)
      let msg = res
      msg.forEach(item => {
        if(item.updatedAt)
        item.updatedAt=util.formatTime(new Date(item.updatedAt))
      })
>>>>>>> b1d72cc396ae7877b42f5c56c8088ac0ab868340
      that.setData({
        msg: msg
      })
    }),

    API.getChatList(app.globalData.userid).then(res=>{
      that.setData({
        chat:res
      })
      console.log(res)
    })
    
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
  //       current: that.data.hotTopics[that.data.currentContentId].images[that.data.currentImgId],
  //       urls: that.data.hotTopics[that.data.currentContentId].images,
  //       success: function (res) { },
  //       fail: function (res) { },
  //       complete: function (res) { },
  //     })
  //   }
  // },
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
    //console.log(e)
    //console.log(this.data.activeIndex)
    //console.log(this.data.sliderOffset)
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  // clicktoback:function(){
  //     wx.navigateBack({
  //       delta: 1
  //     })
    
  // },
  // getUserInfo: function (e) {
  //   //console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
})