const app = getApp()
const API = require('../../API/api.js')
const util = require('../../utils/util.js')

Page({
  data: {
    item_icon_position: 0,
    titlebar_height: 0,
    content_position: 0,
    type: null,
    team: '',
    topic: '',
    hasJoin: false,
    mine: false,
    comments: [],
    comment: '',
    focus: false
  },

  return() {
    wx.navigateBack({
      delta: 1
    })
  },

  commentFocus() {
    this.setData({
      focus: true
    })
  },

  commentInput(e) {
    this.setData({
      comment: e.detail.value
    })
  },

  addComment() {
    let that = this
    let _id = this.data.type == 0 ? this.data.team._id : this.data.topic._id
    let data = {
      content: this.data.comment,
      owner: app.globalData.userid,
      to: _id
    }
    API.comment(data).then(res => {
      if (res.success) {
        util.showSuccess("发送成功")
        API.getCommentsOnly(_id).then(res => {
          let comments = res
          comments.forEach(item => {
            item.updatedAt = util.formatTime(new Date(item.updatedAt))
          })
          that.setData({
            comments: comments,
            comment: '',
            focus: false
          })
        })
      }
    }).catch(err => {
      that.setData({
        comment: '',
        focus: false
      })
    })
  },
  like: function () {
    let that = this
    this.setData({
      'topic.likeBool': !this.data.topic.likeBool
    })
    if (this.data.topic.likeBool) {
      API.addGood({
        topicid: that.data.topic._id,
        userid: app.globalData.userid
      })
    } else {
      API.removeGood({
        topicid: that.data.topic._id,
        userid: app.globalData.userid
      })
    }
  },
  like2team: function () {
    let that = this
    this.setData({
      'team.likeBool': !this.data.team.likeBool
    })
    if (this.data.team.likeBool) {
      API.addGood2team({
        teamid: that.data.team._id,
        userid: app.globalData.userid
      })
    } else {
      API.removeGood2team({
        teamid: that.data.team._id,
        userid: app.globalData.userid
      })
    }

  },
  collect2team: function () {
    let that = this
    this.setData({
      'team.collectBool': !this.data.team.collectBool
    })
    if (this.data.team.collectBool) {
      API.collect2team({
        teamid: that.data.team._id,
        userid: app.globalData.userid
      })
    } else {
      API.removeCollect2team({
        teamid: that.data.team._id,
        userid: app.globalData.userid
      })
    }

  },
  join() {
    let data = {
      owner: this.data.team.owner._id,
      participant: app.globalData.userid,
      team: this.data.team._id,
      status: 0
    }
    API.join(data).then(res => {
      if (res.success) util.showSuccess("申请成功")
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

    options.type == 0 && API.getTeamDetail(options.id).then(res => {
      let hasJoin = false
      let mine = false
      if (res.team.hasJoin && res.team.hasJoin.indexOf(app.globalData.userid) != -1) hasJoin = true
      if (app.globalData.userid == res.team.owner._id) mine = true

      let team = res.team
      team.updatedAt = util.formatTime(new Date(team.updatedAt))
      team.goodCount = team.good.length
      team.collectCount = team.collect.length
      if (team.good && team.good.indexOf(app.globalData.userid) != -1) {
        team.likeBool = true
      } else {
        team.likeBool = false
      }
      if (team.collect && team.collect.indexOf(app.globalData.userid) != -1) {
        team.collectBool = true
      } else {
        team.collectBool = false
      }

      let comments = res.comments
      comments.forEach(item => {
        item.updatedAt = util.formatTime(new Date(item.updatedAt))
      })


      that.setData({
        type: 0,
        team: team,
        comments: comments,
        hasJoin: hasJoin,
        mine: mine
      })
    })

    options.type == 1 && API.getTopicDetail(options.id).then(res => {
      let mine = false
      if (app.globalData.userid == res.topic.owner._id) mine = true

      let topic = res.topic
      topic.updatedAt = util.formatTime(new Date(topic.updatedAt))
      topic.goodCount = topic.good.length
      if (topic.good && topic.good.indexOf(app.globalData.userid) != -1) {
        topic.likeBool = true
      } else {
        topic.likeBool = false
      }

      let comments = res.comments
      comments.forEach(item => {
        item.updatedAt = util.formatTime(new Date(item.updatedAt))
      })

      that.setData({
        type: 1,
        topic: topic,
        comments: comments,
        mine: mine
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})