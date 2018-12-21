import http from '/libs/http'
App({
  onLaunch(options) {


  },
  getUserInfo(callback) {
    if (this.dataInfo.userInfo) {
      callback(this.dataInfo.userInfo);
      return;
    }

    const UserCache = my.getStorageSync({
      key: 'userinfo', // 缓存数据的key
    });
    if (UserCache.data) {
      this.dataInfo.userInfo = UserCache.data;
      callback(UserCache.data);
      return;
    }
    const extJson = my.getExtConfigSync();
    var _this = this;
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        http.post({
          authcode: res.authCode,
          alipayappid: extJson.aliappid,
          method: "alisoft.Login.codeToinfo"
        }, function(status, rest) {
          if (status && rest.data.code === 1) {
            _this.dataInfo.userInfo = rest.data.data;
            my.setStorageSync({
              key: 'userinfo', // 缓存数据的key
              data: rest.data.data, // 要缓存的数据
            });
            callback(rest.data.data);
          } else {
            callback(false);
          }
        })
      },
    });
  },
  dataInfo: {
    islogin: false,
    userInfo: null,
    storeList: [],
    storeObj: {},
    goodsData: {}
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
