import api from '/libs/api'
import php from '/libs/php'
const app = getApp();
var timer = null;
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
  reloadDetail(reloadCache) {
    var _this = this;
    var order = _this.data.orderList[this.data.activeOrder]
    api.getOrderDetail({
      storeid: order.storeid,
      orderno: order.orderno,
      cache: reloadCache,
      success: function(res) {
        var orderDetail = _this.data.orderDetail;
        orderDetail[order.orderno] = res;
        _this.setData({
          orderDetail: orderDetail
        })
        if (res.order.pstatus != 1) {
          var maxtime = (105 * 60) - (php.time() - res.order.addtime)
          _this.setData({
            maxtime: maxtime
          })
          if (timer) {
            clearTimeout(timer)
          }
          _this.CountDown()
        } else {
          _this.setData({
            maxtime: -1
          })
        }
      }
    })
  },
  gotoPay(event) {
    var _this = this;
    const extJson = my.getExtConfigSync();
    var ordeDetailTmp = _this.data.orderDetail[event.target.dataset.orderno];
    my.showLoading({
      content:"支付中..."
    });
    api.getStoreInfo(ordeDetailTmp.order.storeid, function(storeInfo) {
      //计算支付方式
      var price = 0;
      for (var i in ordeDetailTmp.paytype) {
        if (ordeDetailTmp.paytype[i].ptid == -1) {
          price = ordeDetailTmp.paytype[i].price
        }
      }
      if (price <= 0) {
        return false;
      }

      api.createAlipay({
        orderno: ordeDetailTmp.order.orderno,
        third_appid: extJson.aliappid,
        openid: _this.data.userInfo.openid,
        storeid: ordeDetailTmp.order.storeid,
        ptid: storeInfo.ptid,
        type: 1,
        price: price / 100,
      }, function(respay) {
        my.hideLoading();
        if (respay) {
          my.tradePay({
            tradeNO: respay.trade_no,
            success: function(resdata) {
              _this.reloadDetail(true);
            },
            fail: function(resdata) {
              _this.reloadDetail(true);
            },
          });
        }
      })
    })
  },
  CountDown() {
    console.log('1111111111111')
    if (this.data.maxtime >= 0) {
      var minutes = Math.floor(this.data.maxtime / 60);
      var seconds = Math.floor(this.data.maxtime % 60);
      var msg = minutes + "分" + seconds + "秒后取消订单";
      this.setData({
        maxtime: this.data.maxtime - 1,
        countTime: msg
      })
      var _this = this;
      timer = setTimeout(function() {
        _this.CountDown()
      }, 1000)
    } else {
      this.setData({
        countTime: '订单超时未支付'
      })
    }
  },
  onHide() {
    if (timer) {
      clearTimeout(timer)
    }
  }
});
