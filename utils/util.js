const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isJugeEnvironment = _ => {
  let domain = "https://h5.scimall.org.cn";
  let env = typeof __wxConfig !== "undefined" ? __wxConfig.envVersion || "develop" : "develop";
  if (env !== 'develop') {
      domain = "https://h5.scimall.org.cn";
  }
  wx.setStorageSync('domain', domain);
  // console.log(wx.getStorageSync('domain'))
};

const getQueryString = function(url, name) {
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
      return r[2]
  }
  return null;
}

// 用星号隐藏用户的部分信息
const maskUserName = function(str) {
  let len = str.length;

  // 如果是空。就什么操作都没有
  if (!len) {
      return "";
  }
  // 如果两个字就显示为*+最后一个
  if (str.length <= 2) {
      return "*" + str[len - 1];
  }
  return str[0] + "*" + str[len - 1];
}
const fomatFloat = function(src, pos) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}
// 校验邮箱
const isEmail = (value) => {
  let reg = new RegExp("^[a-z0-9]+([_\\-]*[a-z0-9])*@([0-9a-z]+\\.)+[a-z]{2,20}$")
  return reg.test(value);
}
// 校验手机号
const isPhone = (value) => {
  let reg = /^[1][0-9]{10}$/;

  return reg.test(value);
}
module.exports = {
  formatTime: formatTime,
  getQueryString: getQueryString,
  fomatFloat: fomatFloat,
  isEmail,
  isPhone,
  maskUserName,
  isJugeEnvironment
}