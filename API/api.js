// api.js

const API_BASE_URL = 'https://www.sh-invi.cn/weixin/api';
//  'http://localhost:3000/weixin/api';

const request = (url, method, data) => { 

  let _url = API_BASE_URL  + url;

  return new Promise((resolve, reject) => {

    wx.request({
      url: _url,
      method: method || "get",
      data: data,
      header: {
        'Content-Type': 'application/json'//'application/x-www-form-urlencoded'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      }
    })
  });
}

// const upLoadFile=(url,filePath, name, formData) =>{

//   let _url = 'http://localhost:3000' + url;

//   return new Promise((resolve, reject) => {

//     wx.uploadFile({
//       url: _url,
//       filePath: filePath,
//       name: name,
//       header: {
//         'content-type': 'multipart/form-data'
//       },
//       formData: formData,    //请求额外的form data
//       success: function (res) {
//         // console.log(res);
//         if (res.statusCode == 200) {
//           typeof resolve == "function" && resolve(res.data);
//         } else {
//           typeof reject == "function" && reject(res.data);
//         }
//       },
//       fail: function (error) {
//         console.log(error);
//         typeof reject == "function" && reject(error);
//       }
//     })
//   })
// }

module.exports ={
    
  getTopics:(data) =>{
    return request('/topics','post',data)    //话题列表
  },

  getTeams: (data) => {
    return request('/teams', 'post', data)    //组队列表
  },

  getTopicDetail:(id) =>{
    return request('/topic/'+id,'get','')    //话题
  },

  getTeamDetail: (id) => {
    return request('/team/'+id, 'get', '')    //组队
  },

  getLabels: () => {
    return request('/labels', 'get', '')               //标签
  },


  postTopic: (data) => {
    return request('/topic', 'post', data)         //提交话题
  },

  postTeam: (data) => {
    return request('/team', 'post', data)         //提交组队
  },

  deleteTopic: (id) => {
    return request('/topic/'+id, 'delete', '')         //删除话题
  },

  deleteTeam: (id) => {
    return request('/team/'+id, 'delete', '')         //删除组队
  },

  login:(data)=>{
    return request('/openid','post',data)         //交换openid
  },

  updateUserInfo:(data)=>{
    return request('/user','put',data)          //更新用户信息
  },

  getUser:(data) =>{
    return request('/user','post',data)         //获取用户信息
  },

  getUserBasicInfo:(id) =>{
    return request('/userBasicInfo/'+id,'get','')         //获取用户基本信息
  },

  updateUserBasicInfo:(data) =>{
    return request('/userBasicInfo','put',data)         //修改用户基本信息
  },


  getCollectList:(data) =>{
    return request('/user/collection','post',data)         //收藏列表
  },

  getFollowList: (data) => {
    return request('/user/follow/' + data, 'get', '')      //我的关注
  },

  getFansList: (data) => {
    return request('/user/fans/' + data, 'get', '')         //我的粉丝
  },

  follow: (data) => {
    return request('/follow', 'post', data)         //关注
  },

  followCancel: (data) => {
    return request('/followCancel', 'post', data)         //取消关注
  },

  getCommentsMsg: (data) => {
    return request('/messages/comment/' + data, 'get', '')         //获取给我的评论
  },

  //点赞
  addGood: (data) => {
    return request('/topicLike', 'put', data)       //话题点赞
  },
  addGood2team: (data) => {
    return request('/teamLike', 'put', data)        //组队点赞
  },
  //取消点赞
  removeGood: (data) => {
    return request('/topicLike', 'delete', data)
  },
  removeGood2team: (data) => {
    return request('/teamLike', 'delete', data)
  },
  //收藏
  collect2team: (data) => {
    return request('/teamCollect', 'put', data)
  },
  //取消收藏
  removeCollect2team: (data) => {
    return request('/teamCollect', 'delete', data)
  },
  //首页定位，获取城市信息
  locate:(data)=>{
    return request('/reverseGeocoder','post',data)
  },
  //搜索
  search:(data)=>{
    return request('/search','post',data)
  },

  comment:(data)=>{
    return request('/comment','post',data)          //添加评论
  },

  getCommentsOnly: (id) => {
    return request('/comments/'+id, 'get', '')    //更新评论列表
  },

  join:(data)=>{
    return request('/message','post',data)          //加入组队
  },

  agree:(id)=>{
    return request('/message/'+id,'put','')          //同意
  },

  getMsg: (id) => {
    return request('/messages/'+id, 'get', '')    //消息列表
  },

  getRegion: () => {
    return request('/region', 'get', '')    //获取省市数据
  },

  sieve: (data) => {
    return request('/sieve', 'post', data)    //筛选
  },

}