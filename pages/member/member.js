// pages/member/member.js
const app = getApp()
const API = require('../../API/api.js')
const util = require('../../utils/util.js')
let teamid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    members:[],
    showSearchBar:false,
    result:null,
    userid:null
  },

  
  addMember(){
    this.setData({
      showSearchBar:true
    })
  },
  cancel(){
    this.setData({
      showSearchBar:false,
      result:null
    })
  },
  search(e){
    let that = this
    // console.log(e.detail.value)
    API.userSearch(e.detail.value).then(res=>{
      that.setData({
        result:res
      })
    })
  },
  invite(){
    let that = this
    let members = this.data.members.map(item=>item._id)
    if(members.indexOf(this.data.result._id)==-1){
      let data = {
        userid:this.data.result._id,
        teamid:teamid
      }
      API.updateTeamMember(data).then(res=>{
        that.setData({
          members:res,
          result:null
        })
      })
    }else{
      util.showToast('该用户已加入活动')
    }
  },
  delete(e){
    let that = this
    let data = {
      teamid:teamid,
      userid:e.currentTarget.id
    }
    console.log(data)
    API.deleteTeamMember(data).then(res=>{
      that.setData({
        members:res
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    teamid = options.teamid
    API.getTeamMember(options.teamid).then(res=>{
      that.setData({
        members:res,
        userid:app.globalData.userid
      })
    })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})