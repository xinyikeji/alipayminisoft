const app = getApp();
import api from '/libs/api'
Page({
  data: {
    userInfo: {
      nickname: "获取中...",
      iconurl: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
      ucode: "获取中..."
    },
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
      // , {
      //   thumb: '/static/icon/dingdan.png',
      //   link: "/pages/member/address/address",
      //   title: '配送地址'
      // }
      // , {
      //   thumb: '/static/icon/dingdan.png',
      //   link: "/pages/member/about/about",
      //   title: '关于我们'
      // }
    ],
  },
  onMenuClick(event) {
    my.navigateTo({
      url: event.index
    })
  },
  onLoad() {
    var _this = this;
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        _this.setData({
          userInfo: userinfo
        })
        //开始拉取用户基本数据
        api.getUserAccount(userinfo.openid, function(userAccount) {
          console.log(userAccount)
          if (userAccount) {
            _this.setData({
              userAccount: userAccount
            })
          }
        })
      }
    })
  },
  onCardClick: function(ev) {
    my.navigateTo({
      url: "info/info"
    });
  }
});
