
import api from '/libs/api'
import php from '/libs/php'

const app = getApp();

Page({
  data: {
    loading: true,
    order: {},
    remarks: {},
    options: {},
    qrcodeLoad:false, // 二维码加载
  },
  onUnload() {
    api.uploadBehavior({ data: { openid: this.data.userInfo.openid, mode: "uninstpage", query: this.data.options, path: '/pages/orderinfo/orderinfo' } });
  },
  onLoad(options) {
    this.setData({
      options: options
    })
    var _this = this;
    app.getUserInfo(function (userinfo) {
      if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/orderinfo/orderinfo' } });
        _this.setData({
          userInfo: userinfo
        })
        _this.reloadData(true)
        _this.getCancleRemarks();
      } else {
        api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/orderinfo/orderinfo' } });
      }
    })
  },
  imageLoad(){
    console.log("加载成功")
    this.setData({
      qrcodeLoad:true
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
    api.getStoreInfo(_this.data.order.order.storeid, function (storeInfo) {
      api.createAlipay({
        orderno: _this.data.order.order.orderno,
        third_appid: extJson.aliappid,
        openid: _this.data.userInfo.openid,
        storeid: _this.data.order.order.storeid,
        ptid: storeInfo.ptid,
        type: 1,
        price: price / 100,
      }, function (respay) {
        my.hideLoading();
        if (respay) {
          my.tradePay({
            tradeNO: respay.trade_no,
            success: function (resdata) {
              _this.reloadData(true);
            },
            fail: function (resdata) {
              _this.reloadData(true);
            },
          });
        }
      })
    })

  },
  setOrderComplete() {
    // console.log(this.data.order)
    my.showLoading({
      content: "处理中...",
    });
    var _this = this;
    api.setOrderComplete({
      storeid: this.data.order.order.storeid,
      orderno: this.data.order.order.orderno,
      price: this.data.order.order.allprice,
      success: (res) => {
        my.hideLoading();
        _this.reloadData(true);
        // console.log(res)
      }
    })
  },
  onPullDownRefresh() {
    this.reloadData(true);
  },
  getCancleRemarks() {
    api.getOrderCancleRemarks({
      success: function (remarks) {
        // console.log(remarks)
      }
    })
  },

  //取消订单
  cancelOrder(e) {
    let _this = this;
    // 重新拉取订单信息，判断isconfirm
    api.getOrderDetail({
      orderno: _this.data.options.orderno,
      cache: true,
      success: function (res) {
        console.log(res.order)
        if (!(res.order.rstatus == 0 && res.order.pstatus == 1 && res.order.status != 5)) {
          my.alert({
            title: '该订单已签收，请联系商户取消',
          });
          return false
        } else {
          api.getCancelReason({
            success(reason) {
              console.log('getCancelReason-success')
              let items = [];
              for (let r in reason) {
                items[r] = reason[r].text;
              }
              // console.log('reason', reason);
              my.showActionSheet({
                title: '请选择取消理由',
                items: items,
                cancelButtonText: '取消好了',
                success: (res) => {
                  if (res.index >= 0) {

                    api.cancelOrder({
                      storeid: _this.data.order.order.storeid,//	是	int	2.0	门店ID
                      orderno: _this.data.order.order.orderno,//string	是	2.0	订单编号
                      dociid: reason[res.index].dociid,//	int	是	2.0	取消理由ID 拉取销单理由接口
                      canceltype: 3,
                      success(rest) {
                        my.alert({
                          title: '取消成功',
                          success() {
                            _this.reloadData(true);
                          }
                        });
                      },
                      fail(err) {
                        my.alert({
                          title: err.msg
                        });
                      }
                    });
                  }
                },
              });
            },
            fail() {
              console.log('getCancelReason-fail')
            }
          });
        }
      }
    })
  },
  reloadData(reloadCache) {
    var _this = this;
    // console.log(this.data.options.orderno)
    api.getRemarks(function (remarks) {
      // console.log(remarks)
      api.getOrderDetail({
        orderno: _this.data.options.orderno,
        cache: reloadCache,
        success: function (res) {
          my.stopPullDownRefresh();
          // console.log(res)
          for (var i in res.goodsdata) {
            res.goodsdata[i].remarks = res.goodsdata[i].remarks.split(',');
          }
          res.order.addtimeFormat = php.date('Y-m-d H:i:s', res.order.addtime);
          res.order.yytimeFormat = php.date('Y-m-d H:i:s', res.order.yytime);
          _this.setData({
            loading: false,
            order: res,
            remarks: remarks
          })
          console.log(res)
        }
      })
    })
  },
});
