const app = getApp()
const API =require('../../API/api.js')
const util = require('../../utils/util.js')

Page({
  data: {
    item_icon_position: 0,
    titlebar_height: 0,
    content_position: 0,
    team: '',
    comments:[],
    comment:'',
    focus:false
  },

  return() {
    wx.navigateBack({
      delta: 1
    })
  },

  commentInput(e){
    this.setData({
      comment:e.detail.value
    })
  },

  addComment(){
    let that = this
    let data = {
      content: this.data.comment,
      owner: app.globalData.userid,
      to: this.data.team._id
    }
    API.comment(data).then(res=>{
      if(res.success){
        util.showSuccess("发送成功")
        that.setData({
          comment:''
        })
      }
    })
  },
  join(){
    let data = {
      owner: this.data.team.owner._id,
      participant: app.globalData.userid,
      team: this.data.team._id,
      status: 0
    }
    API.join(data).then(res=>{
      if(res.success) util.showSuccess("申请成功")
    })
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
          item_icon_position: res.statusBarHeight + 13,
          titlebar_height: res.statusBarHeight + 50,
          content_position: res.statusBarHeight + 60,
        })
        //console.log(that.item_icon_position);
      },
    })

    API.getTeamDetail(options.id).then(res=>{
      that.setData({
        team:res.team,
        comments:res.comments
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})