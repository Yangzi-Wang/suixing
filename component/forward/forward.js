// component/forward/forward.js
const app = getApp()
const API = require('../../API/api')
let choose = []
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hiddenmodal: { type: Boolean, value: true },
    from: { type: String }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checked0: false,
    checked1: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange(e) {
      let _choose = [false, false]
      e.detail.value.forEach(current => {
        current == 0 && (_choose[0] = true)
        current == 1 && (_choose[1] = true)
      })
      choose = _choose
    },
    cancel() {
      this.setData({
        hiddenmodal: true,
        checked0: false,
        checked1: false
      })
    },
    forwardConfirm() {
      this.setData({
        hiddenmodal: true,
        checked0: false,
        checked1: false
      })
      console.log(choose)
      let data = {
        owner:app.globalData.userid,
        ref: 'Topic',
        from: this.properties.from
      }
      console.log(data)
      API.forward(data)
    }

  }
})
