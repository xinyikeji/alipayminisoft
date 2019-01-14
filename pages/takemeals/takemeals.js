import api from '/libs/api'
import php from '/libs/php'
const app = getApp();

Page({
  data: {
    onshow: false,
    loading: true,
    orderList: []
  },
  onLoad() {
    var _this = this;
    my.showLoading({
      content: "加载中.."
    });
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        _this.setData({
          onshow: true,
          userInfo: userinfo
        })
        _this.reloadData();
      }
    })
  },
  onShow() {
    if (this.data.onshow) {
      this.reloadData();
    }
  },
  onPullDownRefresh() {
    this.reloadData();
  },
  reloadData() {
    var _this = this;
    api.getOrderList({
      openid: _this.data.userInfo.openid,
      year: php.date('Y'),
      isfinish:0,
      success: (res) => {
        my.stopPullDownRefresh();
        my.hideLoading();
        _this.setData({
          loading: false,
          orderList: res
        })
      }
    })
  },
});
