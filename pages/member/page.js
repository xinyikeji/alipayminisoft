const app = getApp();
import api from '/libs/api'
Page({
  data: {
    options: '',
    userInfo: {
      nickname: "获取中...",
      iconurl: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
      ucode: "获取中..."
    },
    brand: 'iphone',
    userAccount: {
      account_balance: 0,
      account_integral: 0,
      discount: 0,
      integral: 0,
      level: "黑铁",
      price_discount: 0,
      mlid: 1,
      usercoupon: [],
      max_price: 0
    },
    integralList: [],
    menulist: [{
      thumb: '/static/icon/dingdan.png',
      link: "/pages/order/index",
      title: '我的订单'
    }
    ],
  },
  onUnload() {
    api.uploadBehavior({ data: { openid: this.data.userInfo.openid, mode: "uninstpage", query: this.data.options, path: '/pages/member/page' } });
  },
  onMenuClick(event) {
    my.navigateTo({
      url: event.index
    })
  },
  onShow() {
    let _this = this;
    let options = this.options
    // 判断是否登录
    const UserCache = my.getStorageSync({
      key: 'userinfo', // 缓存数据的key
    });
    console.log("会员中心的userinfo-onShow时", UserCache.data)
    if (UserCache.data === null) {
      console.log(UserCache.data)
      my.alert({
        title: '提示',
        content: '你还没有登录，请登录~',
        success() {
          my.navigateTo({
            url: '/pages/login/login'
          })
        }
      })
      return false;
    }


    app.getUserInfo(function (userinfo) {
      if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/member/page' } });
        _this.setData({
          userInfo: userinfo
        })
        //开始拉取用户基本数据
        api.getUserAccount(userinfo.openid, function (userAccount) {
          // console.log("获取用户信息",userAccount)
          if (userAccount) {
            _this.setData({
              options: options,
              userAccount: userAccount
            })
            // console.log("获取用户信息",_this.data.userAccount)
          }
        })
      } else {
        api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/member/page' } });
      }
    })
  },
  onLoad(options) {
    console.log(11111)
    let _this = this;
    this.options = options
    // // 判断是否登录
    // const UserCache = my.getStorageSync({
    //   key: 'userinfo', // 缓存数据的key
    // });
    // console.log("会员中心的userinfo-onLoad时", UserCache.data)
    // if (UserCache.data === null) {
    //   console.log(UserCache.data)
    //   my.alert({
    //     title: '提示',
    //     content: '你还没有登录，请登录~',
    //     success() {
    //       my.navigateTo({
    //         url: '/pages/login/login'
    //       })
    //     }
    //   })
    //   return false;
    // }

    my.getSystemInfo({
      success: (res) => {
        this.setData({
          brand: res.brand.toLowerCase()
        })
      },
    });
    app.getUserInfo(function (userinfo) {
      if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/member/page' } });
        _this.setData({
          userInfo: userinfo
        })
        //开始拉取用户基本数据
        api.getUserAccount(userinfo.openid, function (userAccount) {
          // console.log("获取用户信息",userAccount)
          if (userAccount) {
            _this.setData({
              options: options,
              userAccount: userAccount
            })
            // console.log("获取用户信息",_this.data.userAccount)
          }
        })
      } else {
        api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/member/page' } });
      }
    })
  },
  onCardClick: function (ev) {
    my.navigateTo({
      url: "info/info"
    });
  }
});
