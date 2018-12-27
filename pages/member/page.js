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
    }, {
      thumb: '/static/icon/dingdan.png',
      link: "/pages/member/address/address",
      title: '配送地址'
    }, {
      thumb: '/static/icon/dingdan.png',
      link: "/pages/member/about/about",
      title: '关于我们'
    },],
    itemsThumbMultiple: [
      {
        thumb: 'https://paimgcdn.baidu.com/2C6E14EAB0EDF738?src=http%3A%2F%2Fms.bdimg.com%2Fdsp-image%2F1393641007.jpg&rz=urar_2_968_600&v=0',
        title: 'iPad',
        brief: '积分：80000',
      },
      {
        thumb: 'https://paimgcdn.baidu.com/30DD4CE04E61E7F?src=http%3A%2F%2Fms.bdimg.com%2Fdsp-image%2F1420530446.png&rz=urar_2_968_600&v=0',
        title: 'iPone xs max',
        brief: '积分：180000',
      },
      {
        thumb: 'https://i8.mifile.cn/b2c-mimall-media/24b7f3c26569ea91b68551f32109dcb1.jpg',
        title: '小米手机',
        brief: '积分：8000',
      },
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
        app.getUserAccount(userinfo.openid, function(userAccount) {
          console.log(userAccount)
          if (userAccount) {
            _this.setData({
              userAccount: userAccount
            })
          }
        })
        //开始拉取积分商城数据
        api.getIntegralShoppingList(userinfo.openid, function(integralList) {
          console.log(integralList)
          if (integralList) {
            _this.setData({
              integralList: integralList
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
