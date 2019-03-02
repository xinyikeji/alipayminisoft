const app = getApp();
import api from '/libs/api'
Page({
  data: {
    userInfo: {
      nickname: "获取中...",
      iconurl: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
      ucode: "获取中..."
    },
    brand:'iphone',
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
  onLoad(options) {
    var _this = this;
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          brand: res.brand.toLowerCase()
        })
      },
    });
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/member/page' } });
        _this.setData({
          userInfo: userinfo
        })
        //开始拉取用户基本数据
        api.getUserAccount(userinfo.openid, function(userAccount) {
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
  onCardClick: function(ev) {
    my.navigateTo({
      url: "info/info"
    });
  }
});
