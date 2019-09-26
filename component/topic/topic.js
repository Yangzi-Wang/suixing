// component/topic/topic.js
const app = getApp()
const API = require('../../API/api');

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
    item:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    like: function (e) {
      const topicid = e.currentTarget.id
      this.setData({
        'item.likeBool':!this.data.item.likeBool
      })
      if (this.data.item.likeBool) {
        API.addGood({
          topicid: topicid,
          userid: app.globalData.userid
        })
      } else {
        API.removeGood({
          topicid: topicid,
          userid: app.globalData.userid
        })
      }
    },
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.setData({
        item:this.properties.topic
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
