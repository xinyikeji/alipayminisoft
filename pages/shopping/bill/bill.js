
import api from '/libs/api'
import php from '/libs/php'
import clickgoods from '/libs/clickgoods'
const app = getApp();

Page({
  data: {
    shopCart: {},
    userInfo: {},
    userAccount: {},
    scrollHeight: 0,
    storeInfo: {},
    windowWidth: 0,
    windowHeight: 0,
    giveGoodsData: [{
      "goodsid": "7",
      "goodsname": "苹果",
      "shoppic": "http://f.xinyisoft.org/b60e28d9d76b1fa674e90b1084eedb5b",
      "price": 1000
    },
    {
      "goodsid": "8",
      "goodsname": "香蕉",
      "shoppic": "http://f.xinyisoft.org/b60e28d9d76b1fa674e90b1084eedb5b",
      "price": 1000
    }],
    giveGoodsDataIndex: -1,
    giveGoodsDataSelected: {}
  },
  onLoad(options) {
    if (!options.id) options.id = 3;
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
      },
    });

    my.showLoading({
      content:"数据加载中"
    })
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        _this.setData({
          userInfo: userinfo
        })
        api.getStoreInfo(_this.data.options.id, function(storeinfo) {
          console.log('storeinfo',storeinfo)
          _this.setData({
            storeInfo: storeinfo
          })

          //获取赠送的商品
          api.getUserGiveGoods(userinfo.openid, storeinfo.storeid, function(rest) {
            if (rest) {
              console.log(rest)
              _this.setData({
                giveGoodsData: rest.goods_data
              })
              api.getUserAccount(userinfo.openid, function(userAccount) {
                console.log(userAccount)
                my.hideLoading()
                if (userAccount) {
                  _this.setData({
                    userAccount: userAccount
                  })
                }
              })
            }else{
              my.hideLoading()
            }
          })

          clickgoods.clearPaylist({
            storeid: _this.data.options.id,
            success: function(res) {
              clickgoods.addPaylist({
                storeid: _this.data.options.id,
                paytype: {
                  ptid: storeinfo.ptid,
                  price: res.sprice,
                  paytype: 1
                },
                success: function(res) {
                  console.log(res)
                  _this.setData({
                    shopCart: res
                  })
                }
              })
            }
          })
        })
      }else{
        my.hideLoading()
        my.showToast({
          type: 'fail',
          content:"获取用户数据失败",
        });
      }
    })
  },
  onReady() {
    var _this = this;
    my.createSelectorQuery().select('#goodslistview').boundingClientRect().exec(function(ret) {
      console.log(ret)
      var height = (ret[0].height > 300) ? 300 : ret[0].height;
      _this.setData({
        scrollHeight: height
      })
    })
  },
  setTangshi() {
    // 设置堂食
    var _this = this;
    clickgoods.setTangshi({
      storeid: this.data.storeInfo.storeid,
      success: function(res) {
        _this.setData({
          shopCart: res
        })
      }
    });

  },
  setWaidai() {
    // 设置外带
    var _this = this;
    clickgoods.setWaidai({
      storeid: this.data.storeInfo.storeid,
      success: function(res) {
        console.log('setWaidai', res)
        _this.setData({
          shopCart: res
        })
      }
    });

  },
  setGiveGoods(event) {
    // 选择赠送商品
    if (this.data.giveGoodsDataIndex == event.currentTarget.dataset.index) {
      this.setData({
        giveGoodsDataIndex: -1,
        giveGoodsDataSelected: {}
      })
    } else {
      this.setData({
        giveGoodsDataIndex: event.currentTarget.dataset.index,
        giveGoodsDataSelected: this.data.giveGoodsData[event.currentTarget.dataset.index]
      })
    }
  },
  setOrder() {
    var _this = this;
    var orderData = clickgoods.getShoppingCart(this.data.storeInfo.storeid);
    clickgoods.getOrderId({
      storeid: this.data.options.id,
      storecode: this.data.storeInfo.storecode,
      success: function(order_id) {
        var uploadData = {};
        orderData.order_id = order_id;
        uploadData.goods = php.json_encode(orderData.goods);
        delete orderData.goods;
        uploadData.paylist = php.json_encode(orderData.paylist);
        delete orderData.paylist;
        uploadData.user = php.json_encode(orderData.user);
        delete orderData.user;
        uploadData.store = php.json_encode(orderData.store);
        delete orderData.store;
        //删除一些临时用来显示用的数据
        delete orderData.goodsnumbers;
        delete orderData.goodsnumber;
        delete orderData.typenumbers;
        uploadData.order = php.json_encode(orderData);

        // 设置使用券码或者会员积分余额等
        uploadData.consumption = php.json_encode({
          user: {
            openid: _this.data.userInfo.openid,
            // amount: 0,
            integral: 10
          }
        })
        // console.log(uploadData)
        my.showLoading({
          content: "正在创建订单",
        });
        api.uploadOrder(uploadData, function(res) {
          my.hideLoading();
          if (res) {
            my.showLoading({
              content: "正在提交支付",
            });
            const extJson = my.getExtConfigSync();
            console.log(orderData);
            api.createAlipay({
              orderno: res.order_no,
              third_appid: extJson.aliappid,
              openid: _this.data.userInfo.openid,
              storeid: _this.data.storeInfo.storeid,
              ptid: _this.data.storeInfo.ptid,
              type: 1,
              price: orderData.sprice / 100,
            }, function(respay) {
              my.hideLoading();
              if (respay) {
                my.tradePay({
                  tradeNO: respay.trade_no,
                  success: function(res) {
                    my.alert({ title: "成功了", content: php.json_encode(res) });
                  },
                  fail: function(res) {
                    my.alert({ title: "失败了", content: php.json_encode(res) });
                  },
                });
              }
              console.log(respay)
            })
          }
          console.log(res)
        })
      }
    })
    console.log(orderData.user)
  },
  sendOrderToServer() {

    var _this = this;

    // 获取赠品设置
    if (this.data.giveGoodsData.length > 0) { //如果存在赠送商品
      if (this.data.giveGoodsDataIndex < 0) {
        my.confirm({
          title: "温馨提示",
          content: "您还没有选择赠品，确定要下单吗？",
          confirmButtonText: "立即下单",
          cancelButtonText: "选择赠品",
          success: (res) => {
            console.log(res);
            if (res.confirm) {
              _this.setOrder()
            }
          },
        });
        return;
      }
    }


  }
});
