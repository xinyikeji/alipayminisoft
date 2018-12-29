import http from '/libs/http'
const app = getApp();
Page({
  data: {
    title: "尊敬的用户",
    subTitle: "欢迎使用自助点餐服务，请扫码进行点餐！",
    messageButton: {
      mainButton: {
        buttonText: "扫码点餐"
      },
      subButton: {
        buttonText: "预约点餐"
      }
    }
  },
  onLoad() {
    app.getUserInfo(function(userinfo) {
      console.log(userinfo)
    })
  },
  clearCache() {
    my.clearStorage();
  },
  showQrcode() {
    my.navigateTo({
      url: '../shopping/shopping?id=3&t=100'
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  onGetAuthorize() {
    my.getPhoneNumber({
      success: (res) => {
        let encryptedData = res.response
        http.post({
          encryptedData: encryptedData,
          cachekey: '1111111111',
          method: "alisoft.Login.bindUser"
        }, function(staus, rest) {

        })

        console.log(encryptedData)
      },
      fail: (res) => {
        console.log(res)
        console.log('getPhoneNumber_fail')
      },
    });
  },
  onAuthError() {
    console.log('getPhoneNumber_error')
  }
});
