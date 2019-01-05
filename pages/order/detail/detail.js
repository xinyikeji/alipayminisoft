const app = getApp();
import api from '/libs/api'
import php from '/libs/php'
var timer = null;

Page({
  data: {
    options: {},
    orderDetail: {},
    storeInfo: {},
    userInfo: {},
    windowHeight: 0,
  },
  onLoad(options) {
    var _this = this;
    this.setData({
      options: options
    })
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    app.getUserInfo(function(userInfo) {
      if (userInfo) {
        _this.setData({
          userInfo: userInfo
        })
        _this.reloadData()

      }
    })
  },
  openLocation() {
    my.openLocation({
      longitude: this.data.storeInfo.lng,
      latitude: this.data.storeInfo.lat,
      name: this.data.storeInfo.storename,
      address: this.data.storeInfo.address
    });
  },
  makePhoneCall() {
    my.makePhoneCall({ number: this.data.storeInfo.tel_phone });
  },
  reloadData(reloadCache) {
    var _this = this;
    api.getOrderDetail({
      orderno: this.data.options.orderno,
      cache: reloadCache,
      success: function(res) {
        console.log(res)
        api.getStoreInfo(res.order.storeid, function(storeInfo) {
          _this.setData({
            storeInfo: storeInfo
          })
        })
        _this.setData({
          orderDetail: res
        })
        if (res.order.pstatus != 1) {
          console.log((php.time() - res.order.addtime))
          var maxtime = (105 * 60) - (php.time() - res.order.addtime)
          _this.setData({
            maxtime: maxtime
          })
          if (timer) {
            clearTimeout(timer)
          }
          _this.CountDown()
        }
      }
    })
  },
  gotoPay() {
    var _this = this;
    const extJson = my.getExtConfigSync();
    //计算支付方式
    var price = 0;
    for (var i in _this.data.orderDetail.paytype) {
      if (_this.data.orderDetail.paytype[i].ptid == -1) {
        price = _this.data.orderDetail.paytype[i].price
      }
    }
    if (price <= 0) {
      return false;
    }

    api.createAlipay({
      orderno: _this.data.orderDetail.order.orderno,
      third_appid: extJson.aliappid,
      openid: _this.data.userInfo.openid,
      storeid: _this.data.orderDetail.order.storeid,
      ptid: _this.data.storeInfo.ptid,
      type: 1,
      price: price / 100,
    }, function(respay) {
      my.hideLoading();
      if (respay) {
        my.tradePay({
          tradeNO: respay.trade_no,
          success: function(resdata) {
            _this.reloadData(true);
          },
          fail: function(resdata) {
            _this.reloadData(true);
          },
        });
      }
    })
  },
  CountDown() {
    console.log('111111', this.data.maxtime)
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
  onUnload() {
    if (timer) {
      clearTimeout(timer)
    }
  }

});
