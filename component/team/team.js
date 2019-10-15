// team.js
const app = getApp()
const API = require('../../API/api')
const util = require('../../utils/util.js')


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    team:{ type:Object },
    showOwner:{type:Boolean,value:true}
  },

  /**
   * 组件的初始数据
   */
  data: {
    showme:true,
    item:{},
    userid:''
  },

  observers: {
    'team': function(sub) {
      this.init()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    like2team: function () {
      let that = this
      // const teamid = e.currentTarget.id
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
          teamid: that.data.item._id,
          userid: app.globalData.userid
        })
      } else {
        API.removeGood2team({
          teamid: that.data.item._id,
          userid: app.globalData.userid
        })
      }
  
    },
    collect2team: function () {
      let that = this
     
      this.setData({
        'item.collectBool':!this.data.item.collectBool
      })
      if (this.data.item.collectBool) {
        API.collect2team({
          teamid: that.data.item._id,
          userid: app.globalData.userid
        })
      } else {
        API.removeCollect2team({
          teamid: that.data.item._id,
          userid: app.globalData.userid
        })
      }
  
    },

    getDetail(){
      wx.navigateTo({
        url: '../detail/detail?id=' + this.data.item._id + '&&type=0'
      })
    },
    navToCenter(){
      wx.navigateTo({
        url: '../center/center?userid=' + this.properties.team.owner._id
      })
    },
    delete(){
      let that = this;

      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success (res) {
          if (res.confirm) {
            API.deleteTeam(that.data.item._id).then(res=>{
              if(res.success){
                that.setData({
                  showme:false
                })
              }
            })
          } 
        }
      })
    },
    init(){
      let team = this.properties.team
      team.updatedAt=util.formatTime(new Date(team.updatedAt))
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

      this.setData({
        item:team,
        userid:app.globalData.userid
      })
    }

  },
  // lifetimes: {
  //   attached: function() {
  //     // 在组件实例进入页面节点树时执行
      
  //     // console.log(this.properties.team)
  //   },
  //   detached: function() {
  //     // 在组件实例被从页面节点树移除时执行
  //   },
  // },
})
