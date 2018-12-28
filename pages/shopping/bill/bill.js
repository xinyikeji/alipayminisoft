
import api from '/libs/api'
import php from '/libs/php'
import clickgoods from '/libs/clickgoods'
const app = getApp();

Page({
  data: {
    shopCart: {},
    userInfo: {},
    storeInfo: {},
    windowWidth: 0,
    windowHeight: 0,
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

    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        _this.setData({
          userInfo: userinfo
        })
        api.getStoreInfo(_this.data.options.id, function(storeinfo) {
          _this.setData({
            storeInfo: storeinfo
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
      }
    })
  },
  sendOrderToServer() {
    var orderData = this.data.shopCart;
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
        // console.log(uploadData)
        api.uploadOrder(uploadData, function(status, res) {
          console.log(status, res)
        })
      }
    })
    console.log(orderData.user)
  }
});