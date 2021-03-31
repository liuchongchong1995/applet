//app.js
import { isJugeEnvironment } from "utils/util"
const Request = require("assets/scripts/request.js"); 
 

App({
  onLaunch: function () {
    this.systemInfo();
    this.update();
    this.aldWXLogin();
  },
  globalData: {
    pageSize: 10,
    height: null, //页面可视区域高度
    navHeight: 45 //顶部导航高度
  },
  onShow(options){ 
    isJugeEnvironment();
     this.checksession();
  },
   //验证登录是否过期
   checksession: function () {
    let _ = this;
      wx.checkSession({
          success: (res) => {
              console.log("授权未失效");
              _.getuserinfo();
          },
          fail: (res) => {
             console.log("授权失效");
              wx.setStorageSync('isLogin', false);
              wx.clearStorageSync();
          }
      })
  },
  getuserinfo() {
      wx.login({
          success: function (res) {
              let code = res.code;
              wx.getUserInfo({
                lang: "zh_CN",
                success: res => { 
                    const datas = res;
                    Request.post({
                        url: '/xcx/weiXinLogin',
                        data: {
                            code: code,
                            raw_data: datas.rawData,
                            signature: datas.signature,
                            encrypted_data: datas.encryptedData,
                            iv: datas.iv,
                            type: 4
                        }
                    }).then(({data}) => { //成功回调
                        wx.setStorageSync('token', data.data.token);
                        wx.setStorageSync('isLogin', true);
                        wx.setStorageSync('userInfo', data.data);
                    },function(){
                        
                    })

                },
                fail:res=> {
                    wx.setStorageSync('isLogin', false);
                }
            })

          }
      })
  },
  systemInfo(){
    let that = this;
    wx.getSystemInfo({
      success(res) { 
          that.globalData.navHeight = res.statusBarHeight + 46;
          that.globalData.height = res.windowHeight;
      }
    })
  },
  update() {
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                }
            })
        }
    }
})