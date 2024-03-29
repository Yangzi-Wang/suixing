// pages/settings/settings.js
const app = getApp()
const API = require('../../API/api')
const util = require('../../utils/util.js')
let cropper = null

Page({
  data: {
    info: '',
    showCropper: false
  },
  getValue(e) {
    let id = e.currentTarget.id
    let value = e.detail.value
    
    id == 'nickName' && this.setData({
      'info.nickName': value
    })
    id == 'intro' && this.setData({
      'info.intro': value
    })
    id == 'phone' && this.setData({
      'info.phone': value
    })
    id == 'wechat' && this.setData({
      'info.wechat': value
    })
  },
  onChooseImage: function () {
    let that = this
    wx.chooseImage({
      sizeType: ['compressed', 'camera'],
      sourceType: ['album'],
      count: 1,
      success: function (res) {
        that.setData({
          showCropper: true
        })
        //初始化cropper
        cropper = that.selectComponent('#cropper');
        cropper.fnInit({
          imagePath: res.tempFilePaths[0],       //*必填
          debug: false,                        //可选。是否启用调试，默认值为false。true：打印过程日志；false：关闭过程日志
          outputFileType: 'jpg',              //可选。目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
          quality: 1,                         //可选。图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
          aspectRatio: 1,                  //可选。裁剪的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
          minBoxWidthRatio: 0.2,              //可选。最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
          minBoxHeightRatio: 0.2,             //可选。同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。
          initialBoxWidthRatio: 0.6,          //可选。剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
          initialBoxHeightRatio: 0.6          //可选。同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
        })
      }
    })
  },
  confirm() {
    let data = {
      userid: app.globalData.userid,
      info: this.data.info
    }
    console.log(data)
    API.updateUserBasicInfo(data).then(res => {
      if (res.success) {
        util.showSuccess('修改成功')
      }
    })
  },

  //裁减成功后图片上传服务器
  fnSubmit: function () {
    let that = this
    cropper.fnCrop({

      //剪裁成功的回调
      success: function (res) {
        //生成文件的临时路径
        // console.log(res.tempFilePath);
        wx.uploadFile({
          url: app.globalData.uploadUrl,//'https://www.sh-invi.cn/admin/api/upload', //'http://localhost:3000/admin/api/upload',
          filePath: res.tempFilePath,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (res) {
            that.setData({
              showCropper: false,
              'info.avatarUrl': JSON.parse(res.data).url
            })
            // wx.previewImage({
            //   urls: [that.data.info.avatarUrl],
            // })
          },
          fail: function (error) {
            console.log(error);
            that.setData({
              showCropper: false
            })
          }
        })

      },
      //剪裁失败的回调
      fail: function (res) {
        console.log(res);
      },

      //剪裁结束的回调
      complete: function () {
        //complete
      }
    });
  },
  fnCancel() {
    this.setData({
      showCropper: false
    })
  },


  onLoad: function (options) {
    let that = this
    API.getUserBasicInfo(app.globalData.userid).then(res => {
      console.log(res)
      that.setData({
        info: res
      })
    })
  }
})