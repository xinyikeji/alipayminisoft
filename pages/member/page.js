const app = getApp();
Page({
  data: {
    userInfo: {
      nickname: "获取中...",
      iconurl: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
      ucode: "获取中..."
    },
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
  onLoad() {
    var _this = this;
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        _this.setData({
          userInfo: userinfo
        })
        //开始拉取用户基本数据
        app.getUserAccount(userinfo.openid,function (userAccount){
            console.log(userAccount)
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
