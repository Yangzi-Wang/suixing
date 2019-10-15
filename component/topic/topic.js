// component/topic/topic.js
const app = getApp()
const API = require('../../API/api')
const util = require('../../utils/util.js')


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topic: { type: Object },
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
    'topic': function(sub) {
      this.init()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    like: function () {
      let that = this
      this.setData({
        'item.likeBool':!this.data.item.likeBool
      })
      if (this.data.item.likeBool) {
        API.addGood({
          topicid: that.properties.topic._id,
          userid: app.globalData.userid
        })
      } else {
        API.removeGood({
          topicid: that.properties.topic._id,
          userid: app.globalData.userid
        })
      }
    },
    getDetail(){
      wx.navigateTo({
        url: '../detail/detail?id=' + this.properties.topic._id +'&&type=1'
      })
    },
    navToCenter(){
      wx.navigateTo({
        url: '../center/center?userid=' + this.properties.topic.owner._id
      })
    },
    delete(){
      let that = this;

      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success (res) {
          if (res.confirm) {
            API.deleteTopic(that.properties.topic._id).then(res=>{
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
      let topic = this.properties.topic
      topic.updatedAt=util.formatTime(new Date(topic.updatedAt))
      topic.goodCount = topic.good.length
      if (topic.good && topic.good.indexOf(app.globalData.userid) != -1) {
        topic.likeBool = true
      } else {
        topic.likeBool = false
      }

      this.setData({
        userid: app.globalData.userid,
        item:topic
      })
    }
  },
  // lifetimes: {
  //   attached: function() {
  //     // 在组件实例进入页面节点树时执行
  //     this.init()
  //   },
  //   detached: function() {
  //     // 在组件实例被从页面节点树移除时执行
  //   },
  // },
})
