const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: content,
    showCancel: false
  })
}

//消息提示框
var showToast = (title, icon) => {
  wx.showToast({
    title: title,
    icon: icon || 'none',
    duration: 2000
  })
}

module.exports = {
  formatTime, 
  showToast, 
  showSuccess, 
  showModel, 
  formatTime: formatTime
}
