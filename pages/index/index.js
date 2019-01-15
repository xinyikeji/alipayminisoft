import http from '/libs/http'
import api from '/libs/api'
const app = getApp();
Page({
  data: {
    userInfo: {},
    storeList: {},
    indexAds: {}
  },
  onLoad(options) {
    var _this = this;
    //获取首页广告
    api.getIndexAds(false, function(indexads) {
      // console.log(indexads)
      _this.setData({
        indexAds: indexads,
        options: options
      })
    })
    api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/index/index' } });
  },
  onUnload() {
    api.uploadBehavior({ data: { mode: "uninstpage", query: this.data.options, path: '/pages/index/index' } });
  },
  clearCache() {
    my.clearStorage();
  },
  showQrcode(event) {
    api.sendFormid({
      openid: this.data.userInfo.openid,
      formid: event.detail.formId
    })
    my.navigateTo({
      url: '../shopping/shopping?id=8&t=100'
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

        // console.log(encryptedData)
      },
      fail: (res) => {
        // console.log(res)
        // console.log('getPhoneNumber_fail')
      },
    });
  },
  onAuthError() {
    // console.log('getPhoneNumber_error')
  }
});
