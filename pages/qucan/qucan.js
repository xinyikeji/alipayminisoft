import api from '/libs/api'
import php from '/libs/php'
const app = getApp();

Page({
  data: {
    onshow: false,
    options: {},
    windowHeight: 0,
    windowWidth: 0,
    titleBarHeight: 0,
    activeOrder: 0,
    orderList: [],
    orderDetail: {},
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
        _this.reloadData();
      }
    })
  },
  onShow() {
    if (this.data.onshow) {
      this.reloadData();
    }
  },
  gotoShopping() {
    my.navigateTo({
      url: "/pages/shopping/shopping"
    });
  },
  reloadData() {
    var _this = this;
    api.getOrderList({
      openid: _this.data.userInfo.openid,
      year: php.date('Y'),
      isfinish: 0,
      success: (res) => {
        _this.setData({
          onshow: true,
          activeOrder: 0,
          orderList: res
        })
        if (res.length > 0) {
          this.reloadDetail();
        }
      }
    })

  },
  showQrcode(event) {
    console.log(event)
    var _this = this;
    this.setData({
      imagesrc: event.target.dataset.src,
      showimage: true,
    })
    my.setKeepScreenOn({
      keepScreenOn: true
    })
  },
  closeImage() {
    this.setData({
      showimage: false,
    })
    my.setKeepScreenOn({
      keepScreenOn: false
    })
  },
  swiperChange(event) {
    this.data.current[event.detail.current] = true;
    if (!this.data.current[event.detail.current + 1]) {
      this.data.current[event.detail.current + 1] = true
    }
    this.setData({
      activeOrder: event.detail.current,
      current: this.data.current
    })
    // 获取订单详情
    this.reloadDetail();
  },
  reloadDetail() {
    var _this = this;
    var order = _this.data.orderList[this.data.activeOrder]
    api.getOrderDetail({
      storeid: order.storeid,
      orderno: order.orderno,
      success: function(res) {
        var orderDetail = _this.data.orderDetail;
        orderDetail[order.orderno] = res;
        console.log(res);
        _this.setData({
          orderDetail: orderDetail
        })
      }
    })
  }
});
