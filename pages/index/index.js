import http from '/libs/http'
import api from '/libs/api'
const app = getApp();
Page({
  data: {
    userInfo: {},
    storeList: {},
    indexAds:{}
  },
  onLoad() {
    var _this = this;
     //获取首页广告


    app.getUserInfo(function(userinfo) {
      // console.log(userinfo)
      api.getIndexAds(userinfo.openid,function (indexads){
        // console.log(indexads)
        _this.setData({
          indexAds:indexads
        })

      })
      api.getStoreList(function(storeList) {
        if (storeList) {
          my.getLocation({
            success(res) {
              my.hideLoading();
              for (var i in storeList) {
                storeList[i].longvalue = app.getLong(res.latitude, res.longitude, storeList[i].lat, storeList[i].lng);
                storeList[i].longvalueFormat = app.getLongFormat(storeList[i].longvalue);
              }

              //排出最近的门店

             
              

              _this.setData({
                storeList: storeList,
                userInfo: userinfo
              })
              // console.log(storeList);
            }
          })
        }
      })
    })
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
