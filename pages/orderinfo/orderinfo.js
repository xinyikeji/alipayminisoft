
import api from '/libs/api'

const app = getApp();

Page({
  data: {
    loading: true,
    order: {},
    remarks: {},
    options: {}
  },
  onLoad(options) {
    this.setData({
      options: options
    })
    var _this = this;
    app.getUserInfo(function(userInfo) {
      if (userInfo) {
        _this.setData({
          userInfo: userInfo
        })
        _this.reloadData()
      }
    })

  },
  gotoPay() {
    var _this = this;
    const extJson = my.getExtConfigSync();
    //计算支付方式
    var price = 0;
    for (var i in _this.data.order.paytype) {
      if (_this.data.order.paytype[i].ptid == -1) {
        price = _this.data.order.paytype[i].price
      }
    }
    if (price <= 0) {
      return false;
    }
    my.showLoading({
      content: "处理中..."
    });
    api.getStoreInfo(_this.data.order.order.storeid, function(storeInfo) {
      api.createAlipay({
        orderno: _this.data.order.order.orderno,
        third_appid: extJson.aliappid,
        openid: _this.data.userInfo.openid,
        storeid: _this.data.order.order.storeid,
        ptid: storeInfo.ptid,
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
    })

  },
  setOrderComplete() {
    my.showLoading({
      content:"处理中...",
    });
    var _this =  this;
    api.setOrderComplete({
      storeid: this.data.order.order.storeid,
      orderno: this.data.order.order.orderno,
      price: this.data.order.order.allprice,
      success: (res) => {
        my.hideLoading();
        _this.reloadData(true);
        console.log(res)
      }
    })
  },
  onPullDownRefresh() {
    this.reloadData(true);
  },
  reloadData(reloadCache) {
    var _this = this;
    console.log(this.data.options.orderno)
    api.getRemarks(function(remarks) {
      console.log(remarks)
      api.getOrderDetail({
        orderno: _this.data.options.orderno,
        cache: reloadCache,
        success: function(res) {
          my.stopPullDownRefresh();
          console.log(res)
          for (var i in res.goodsdata) {
            res.goodsdata[i].remarks = res.goodsdata[i].remarks.split(',');
          }
          _this.setData({
            loading: false,
            order: res,
            remarks: remarks
          })
        }
      })
    })

  },
});
