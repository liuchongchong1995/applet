let domain = wx.getStorageSync('domain') || "https://h5.scimall.org.cn";
function promiseRequest(pamar, method, header) {
  let pamars = pamar || {};

   // 如果没有找到这两个值。就重新获取一次
   if (!domain) {
    domain = wx.getStorageSync('domain');
  }

  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: domain + pamars.url + '?token='+ wx.getStorageSync('token'),
      header: header,
      data: pamars.data,
      method: method,
      success: function (res) {
        if (typeof res.data === "object") {
          if (res.data.code != 0) {
            if (res.data.code == 302) {
              wx.navigateTo({
                url: '/pages/authorization/index'
              })
            } else if(res.data.code == 100060082) {  //积分类型code 不需要toast
              reject(res);
            }
            else{
              wx.showToast({
                title: res.data.error ? res.data.error[0].value:res.data.msg,
                icon: "none"
              });
              reject(res);
            }
          }
        }
        resolve(res);
      },
      fail: reject,
    });
  });
  return promise;
}

module.exports = {
  domain: domain,
  "get": function (parma) {
    return promiseRequest(parma, 'GET', {"Content-Type": "json"});
  },
  "post": function (parma) {
    return promiseRequest(parma, 'POST', {'content-type': 'application/x-www-form-urlencoded' });
  }
};
