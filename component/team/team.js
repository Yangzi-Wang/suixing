// team.js
const app = getApp()
const API = require('../../API/api');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    team:{ type:Object }
  },

  /**
   * 组件的初始数据
   */
  data: {
    item:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    like2team: function (e) {
      const teamid = e.currentTarget.id
      // let teams = this.data.teams
      // const thisTeam = teams.filter(item => {
      //   if (item._id == teamid) {
      //     let index = teams.indexOf(item)
      //     this.setData({
      //       ['teams[' + index + '].likeBool']: !item.likeBool
      //     })
      //     return true
      //   }
      // })
      this.setData({
        'item.likeBool':!this.data.item.likeBool
      })
      if (this.data.item.likeBool) {
        API.addGood2team({
          teamid: teamid,
          userid: app.globalData.userid
        })
      } else {
        API.removeGood2team({
          teamid: teamid,
          userid: app.globalData.userid
        })
      }
  
    },
    collect2team: function (e) {
      const teamid = e.currentTarget.id
     
      this.setData({
        'item.collectBool':!this.data.item.collectBool
      })
      if (this.data.item.collectBool) {
        API.collect2team({
          teamid: teamid,
          userid: app.globalData.userid
        })
      } else {
        API.removeCollect2team({
          teamid: teamid,
          userid: app.globalData.userid
        })
      }
  
    },

    getDetail(e){
      wx.navigateTo({
        url: '../detail/detail?id=' + e.currentTarget.id
      })
    }

  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.setData({
        item:this.properties.team
      })
      // console.log(this.properties.team)
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
