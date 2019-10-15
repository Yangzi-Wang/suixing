//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置
const API =require('../../API/api.js')
var imagesURL=[]
var team_data={}


Page({
  data: {
    
    inputVal: "",
    inputShowed: false,
    tabs: ["创建组队", "发布话题"],
    sliderOffset: 0,
    sliderLeft: 0,
    activeIndex: 1,
    current_windowWidth: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item_icon_position: 0,
    titlebar_height: 0,
    header_position: 0,
    navbar_position: 0,
    content_position: 0,
    content_position2: 0,
    titleBarHeight: 32,
    act_img: '',
    content_text:'在这里写下你的想法...',
    preImg:[],
    images: [],
    tempImage:'',
    team_data:{title:'',content:'',require:'',prince:'',memberNum:''},
    labels: [],
    labelsArr:[],
    time: '',
    date: '',
    focus:false,
    locationName:"",
    location:[],
    hasPost:false
    

  },

  onTextInput: function (e) {
    var that = this
    that.setData({
      content_text: e.detail.value
    })
  },

  onAddImage: function () {
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        if (that.data.preImg == '') {
          that.setData({
            preImg: res.tempFilePaths
          });
        } else {
          let imgArr = that.data.preImg;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            imgArr.push(res.tempFilePaths[i]);
          }
          that.setData({
            preImg: imgArr
          });
        }
      }
    })
  },
  
  publishTopic: function () {
    if (imagesURL == '' && this.data.content_text == ''||this.data.location == '') {
      util.showModel("发布失败", "内容不完整")
    }
    else {

      let data = {
        images: imagesURL,
        content: this.data.content_text,
        location:this.data.location,
        locationName: this.data.locationName,
        owner:app.globalData.userid
      }
      API.postTopic(data).then(res=>{
        if(res.success){
          util.showSuccess("发布成功")
          wx.reLaunch({
            url: '../index/index'
          })
        }
      }).catch(error=>{
        console.log(error)
        util.showModel("提示","发布失败")
      })
    }
  },

  confirm: function () {
    var that = this
    // if (this.data.images == [] || this.data.content_text == '' || this.data.location == ''){
    //   wx.showToast({
    //     title: '内容不完整',
    //     icon: 'none',
    //     duration: 1500,
    //     mask: true,
    //     success: function (res) { },
    //     fail: function (res) { },
    //     complete: function (res) { },
    //   })
    //   return
    // }else{
    let len = that.data.preImg.length
    if(len==0){
      this.publishTopic();
      return;
    }
      // let tempImgArr = new Array()
      for (var i = 0; i < len; i++) {

        wx.uploadFile({
          url: app.globalData.uploadUrl,//'https://www.sh-invi.cn/admin/api/upload',
          filePath: that.data.preImg[i],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          // formData: '',    //请求额外的form data
          success: function (res) {
            imagesURL.push(JSON.parse(res.data).url)
            
            if(imagesURL.length==len){
              that.publishTopic()
            }            
          },
          fail: function (error) {
            console.log(error);
          }
        })

      // wx.showToast({
      //   title: '请稍等...',
      //   icon: 'loading',
      //   duration: 1500,
      //   mask: true,
      //   success: function(res) {},
      //   fail: function(res) {},
      //   complete: function(res) {},
      // })
      // wx.showModal({
      //   title: '确认发布吗？',
      //   content: '',
      //   showCancel: true,
      //   confirmText: '确认',
      //   confirmColor: '#AB4CFA',
      //   cancelText: '取消',
      //   cancelColor: 'black',
      //   success: function(res) {
      //     if (res.confirm) {
      //       that.publishTopic()
      //       
      //     } else if (res.cancel) {
      //       //console.log('用户点击取消')
      //     }
          
      //   },
      //   fail: function(res) {

      //   },
      //   complete: function(res) {},
      // })
    }

  },

  addLocation:function(){
    var that = this
    wx.chooseLocation({
      success: function(res) {
        //address
        that.setData({
          locationName:res.name,
          location:[res.latitude,res.longitude]
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  

  // chooseImage: function (e) {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     success: function (res) {
  //       //console.log(res.tempFilePaths);
  //       that.setData({
  //         act_img: res.tempFilePaths
  //       })
  //     },
  //     fail: function (res) { },
  //     complete: function (res) { },
  //   })
  // },

  inputTyping: function (e) {
    var that = this
    //console.log(e.detail);
    that.setData({
      inputVal: e.detail.value
    });
    //console.log(this.data.inputVal);

  },

  onPageScroll: function (e) {

  },

  tabClick: function (e) {
    //console.log(e)//获取滚动条当前位置的值

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  onSwiperchange: function (e) {
    //console.log(e)//获取滚动条当前位置的值
    this.setData({
      activeIndex: e.detail.current,
    });
    this.setData({
      sliderOffset: this.data.current_windowWidth / this.data.tabs.length * this.data.activeIndex,
    });
    //console.log(e)
    //console.log(this.data.activeIndex)
    //console.log(this.data.sliderOffset)
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  

  onLoad: function () {
    var that = this;

    this.getLabels()

    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2 - 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          item_icon_position: res.statusBarHeight + 13,
          titlebar_height: res.statusBarHeight + 50,
          header_position: res.statusBarHeight + 33,
          navbar_position: res.statusBarHeight + 43,
          content_position: res.statusBarHeight + 100,
          current_windowWidth: res.windowWidth
        })
        //console.log(that.item_icon_position);
      },
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 绘制海报
   */
  getPost(){
    const ctx = wx.createCanvasContext('post');

    if (team_data.title && team_data.memberNum && this.data.date && this.data.time){
      let title = team_data.title
      let memberNum = '规模：' + team_data.memberNum + '人'
      let date = this.data.date + ' ' + this.data.time
      ctx.drawImage("../../images/postbg.jpg", 0, 0, 348, 159);
      ctx.setFontSize(12);
      ctx.setFillStyle("#ffffff");

      let labelsText = '';
      let labels = this.data.labels;
      for(let i = 0;i < labels.length;i++)
      labelsText = labelsText + labels[i].name + ' ';
      ctx.fillText(labelsText, 27, 20);
      ctx.setFontSize(24);
      ctx.fillText(title, 27, 50);
      ctx.setFontSize(17);
      ctx.fillText(memberNum, 27, 80);
      ctx.setFontSize(17);
      ctx.fillText(date, 27, 100);
      ctx.draw();

      this.setData({
        hasPost:true
      })
    }else{
      util.showToast("内容不完整！")
      this.setData({
        hasPost: false
      })
    }
    
  },
  getTeamTitle(e){
    team_data.title=e.detail.value
  },
  getTeamContent(e) {
    team_data.content = e.detail.value
  },
  getTeamRequire(e) {
    team_data.require = e.detail.value
  },
  getTeamPrice(e) {
    team_data.price = e.detail.value
  },
  getTeamMemberNum(e) {
    team_data.memberNum = e.detail.value
  },
  bindTimeChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  publishTeam(){
    let that =this
    let labels = this.data.labels.map(item=>{
      return item._id
    })
    if(this.data.hasPost&&team_data.content&&team_data.require&&team_data.price){
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 348,
        height: 159,
        destWidth: 348,
        destHeight: 159,
        canvasId: 'post',
        success(res) {
          console.log(res.tempFilePath)
          wx.uploadFile({
            url: app.globalData.uploadUrl,//'https://www.sh-invi.cn/admin/api/upload',
            filePath: res.tempFilePath,
            name: 'file',
            header: {
              'content-type': 'multipart/form-data'
            },
            success: function (res) {
              team_data.postUrl = JSON.parse(res.data).url
              team_data.date = that.data.date
              team_data.time=that.data.time
              team_data.owner=app.globalData.userid
              team_data.location = that.data.location
              team_data.locationName = that.data.locationName
              team_data.labels = labels
              // console.log(team_data)

              API.postTeam(team_data).then(res => {
                if (res.success) {
                  util.showSuccess("发布成功")
                  that.setData({
                    ['team_data.title']:'',
                    ['team_data.content']:'',
                    ['team_data.require']:'',
                    ['team_data.price']:'',
                    ['team_data.memberNum']:'',
                    labels:[],
                    date:'',
                    time:'',
                    locationName:'',
                    location:[],
                    hasPost: false
                  })
                  // const ctx = wx.createCanvasContext('post');
                  // ctx.clearRect(0, 0, 348, 159)

                  wx.switchTab({
                    url: '../index/index'
                  })
                  // console.log(team_data)
                }
              }).catch(error => {
                console.log(error)
                util.showModel("提示", "发布失败")
              })
            },
            fail: function (error) {
              console.log(error);
              util.showModel("提示", "发布失败")
            }
          })
        }
      })
    }
  },
  getLabels(){
    API.getLabels().then(res=>{
      this.setData({
        labelsArr:res
      })
    })
  },
  bindLabelChange(e){
    let newArr = this.data.labels
    newArr.push(this.data.labelsArr[e.detail.value])
    this.setData({
      labels:newArr
    })
  }
})
