import api from '/libs/api'
const app = getApp();

Page({
  data: {
    options: {},
    windowHeight: 0,
    windowWidth: 0,
    titleBarHeight: 0,
    orderList: [],
    current: {
      0: true,
      1: true
    },
  },
  onLoad(options) {
    my.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          titleBarHeight: res.titleBarHeight
        })
      },
    });
    var _this = this;
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        _this.setData({
          userInfo: userinfo
        })
        api.getOrderList({
          openid: _this.data.userInfo.openid,
          year: 2019,
          success: (res) => {
            _this.setData({
              orderList: res
            })
          }, fail: (res) => {

          }
        })
      }
    })
  },
  swiperChange(event) {
    this.data.current[event.detail.current] = true;
    if (!this.data.current[event.detail.current + 1]) {
      this.data.current[event.detail.current + 1] = true
    }
    this.setData({
      current: this.data.current
    })
  }
});
