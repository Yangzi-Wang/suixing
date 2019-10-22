//app.js
const API = require('./API/api.js')
const util = require('./utils/util.js')

App({
  onLaunch: function () {

    let that = this


    wx.clearStorage()

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    //获取缓存
    wx.getStorage({
      key: 'docid',
      success (res) {
        console.log(res.data)
        that.globalData.userid = res.data
      },
      fail(){
        wx.login({    // 发送 res.code 到后台换取 openId, sessionKey, unionId
          success: res => {
            wx.setStorage({
              key: "code",
              data: res.code
            })
            that.myLogin(res)
          }
        })
      }
    })

    
    // 获取用户信息
    /*wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log('appjs获取用户信息')
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })*/
  },
  myLogin(res){
    API.login(res).then(res => {
      wx.setStorage({
        key: "docid",
        data: res
      })
      this.globalData.userid = res
    })
      .catch(error => {
        util.showToast('网络错误')
      })
  },
  globalData: {
    userInfo: null,
    userid:null,
    lat:null,
    lng:null,
    uploadUrl:'https://www.sh-invi.cn/admin/api/upload'
  }
})