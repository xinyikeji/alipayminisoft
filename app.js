import http from '/libs/http'
App({
  onLaunch(options) {
      this.dataInfo.runkey = this.getUUID();
      console.log(options)
    // my.clearStorage();
  },
  setLog(logdata){
    
  },
  // getConfig(){
  //   var datainfo = my.getStorageSync({
  //     key: 'StoreBaseConfig-' + storeid, // 缓存数据的key
  //   });
  //   if (datainfo.data) {
  //     callback(datainfo.data);
  //     return;
  //   }
  //   const extJson = my.getExtConfigSync();
  //   http.post({
  //     method: "alipay.StoreInfoAlipay.getStoreBaseConfig",
  //     alipay_appid: extJson.aliappid,
  //     type: 1,
  //     storeid: storeid
  //   }, function(status, rest) {
  //     if (status && rest.data.code === 1) {
  //       my.setStorageSync({
  //         key: "StoreBaseConfig-" + storeid,
  //         value: rest.data.data
  //       })
  //       callback(rest.data.data);
  //     } else {
  //       callback(false);
  //     }
  //   })
  // },
  getUserInfo(callback) {
    const UserCache = my.getStorageSync({
      key: 'userinfo', // 缓存数据的key
    });
    if (UserCache.data) {
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
  getUUID: function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },
  getLong: function(lat1, lng1, lat2, lng2) {
    /**
     * 根据两个地图坐标计算两点间的直线距离
     */
    //获取两点距离
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    var r = 6378137;
    var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));

    /*if (distance > 1000){
      distance = Math.round(distance / 1000);
    }*/
    return distance;


  },
  getLongFormat: function(long) {
    /**
     * 对距离进行格式化
     */
    //格式化距离
    if (long > 1000) {
      return (long / 1000).toFixed(2) + 'km';
    } else {
      return long.toFixed(2) + 'm';
    }
  },
  dataInfo: {
    runkey:null
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
