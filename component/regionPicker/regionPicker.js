// component/regionPicker/regionPicker.js
const app = getApp()
const API = require('../../API/api');

Component({

  properties: {

  },

  data: {
    multiIndex: [15, 0],
    multiArray: [],
    provinces: [],
  },

  methods: {
    bindMultiPickerChange: function (e) {
      this.setData({
        "multiIndex[0]": e.detail.value[0],
        "multiIndex[1]": e.detail.value[1]
      })
      let myEventDetail = {
        city: this.data.multiArray[1][e.detail.value[1]]
      }
      this.triggerEvent('regionPickerEvent', myEventDetail)
    },
    bindMultiPickerColumnChange: function (e) {
      let that = this
      switch (e.detail.column) {
        case 0:
          that.setData({
            "multiArray[1]": that.data.provinces[e.detail.value].citys,
            "multiIndex[0]": e.detail.value,
            "multiIndex[1]": 0
          })
      }
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let that = this
      API.getRegion().then(res => {

        let provinceNameArr = res.provinces.map(item => {
          return item.provinceName
        })
        that.setData({
          provinces: res.provinces,
          'multiArray[0]': provinceNameArr,
          'multiArray[1]': res.provinces[15].citys
        })
      })
    }
  },
})
