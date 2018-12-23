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
          console.log(status, rest);
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
  getUserAccount(openid, callback) {
    http.post({
      openid: openid,
      usercoupon: '1',
      method: "member.MemberInfo.getMemberInfoDetail",
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        callback(rest.data.data);
      } else {
        callback(false);
      }
    })
  },
  getStoreInfo(storeid, callback) {
    var storeinfo = my.getStorageSync({
      key: 'storeinfo' + storeid, // 缓存数据的key
    });
    if (storeinfo.data) {
      callback(storeinfo.data);
      return;
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "alipay.StoreInfoAlipay.getStoreList",
      alipay_appid: extJson.aliappid,
      type: 1,
      storeid: storeid
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        my.setStorageSync({
          key: "storeinfo" + storeid,
          value: rest.data.data
        })
        callback(rest.data.data);
      } else {
        callback(false);
      }
    })
  },
  getGoodsInfo(storeid, callback) {
    var datainfo = my.getStorageSync({
      key: 'store-goods-all-' + storeid, // 缓存数据的key
    });
    if (datainfo.data) {
      callback(datainfo.data);
      return;
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "alipay.GoodsInfo.getGoodsTypeList",
      alipay_appid: extJson.aliappid,
      type: 1,
      storeid: storeid
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        http.post({
          method: "dapingzizhu.GoodsInfo.getGoodsInfo",
          alipay_appid: extJson.aliappid,
          type: 1,
          storeid: storeid
        }, function(status, restgoods) {
          if (status && restgoods.data.code === 1) {
            my.setStorageSync({
              key: "store-goods-all-" + storeid,
              value: {
                goodstype: rest.data.data,
                goodsdata: restgoods.data.data
              }
            })
            callback({
              goodstype: rest.data.data,
              goodsdata: restgoods.data.data
            });
          } else {
            callback(false);
          }
        })
      } else {
        callback(false);
      }
    })
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
