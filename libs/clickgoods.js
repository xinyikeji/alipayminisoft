import http from './http'

export default {
  getShoppingCart(storeid) {
    const shoppingdata = my.getStorageSync({
      key: 'shoppingcart' + storeid, // 缓存数据的key
    });
    if (shoppingdata.data) {
      return shoppingdata.data;
    } else {
      var defaultData = {
        goodsnumber: 0,
        goodsprice: 0, //商品的价格
        type: 1,//1堂食2外卖
        people: 0, //就餐人数
        reservation: 0,//是否预约单
        yytime: null,//预约时间
        ispay: 0, //是否已经支付
        total_price: 0, //订单总价
        discount_price: 0,// 订单优惠金额
        sprice: 0, //实收金额（需要支付的金额）
        remark: "", //整单备注
        need_invoice: 1,//是否需要发票，1是2不需要
        prefix: "ZFBZZ",
        goodsnumbers:{},
        typenumbers:{},
        store: {
          storeid: storeid
        },
        paylist: [

        ],
        goods: [

        ],
        user: {
          openid: null,
          name: null,
          phone: null,
          address: null,
          lng: null,
          lat: null,
        }
      };
      my.setStorageSync({
        data: defaultData, // 要缓存的数据
        key: 'shoppingcart' + storeid, // 缓存数据的key
      });
      return defaultData;
    }
  },
  setUserInfo(option) {
    if (!option.success) option.success = function(res) { console.log('setUserInfo success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('setUserInfo fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.user) {
      option.fail({ error: true, message: "没有设置user" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    for (var i in shoppingInfo.user) {
      if (option.user[i]) shoppingInfo.user[i] = option.user[i];
    }
    my.setStorage({
      data: shoppingInfo, // 要缓存的数据
      key: 'shoppingcart' + option.storeid, // 缓存数据的key
      success: function() {
        option.success(shoppingInfo);
      },
      fail: function() {
        option.fail({ error: true, message: "数据保存失败" })
      }
    });
  },
  addPaylist(option) {
    if (!option.success) option.success = function(res) { console.log('addPaylist success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('addPaylist fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.paytype) {
      option.fail({ error: true, message: "没有设置paytype" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    option.paytype.key = this.getUUID();
    shoppingInfo.paylist.push(option.paytype);
    my.setStorage({
      data: shoppingInfo, // 要缓存的数据
      key: 'shoppingcart' + option.storeid, // 缓存数据的key
      success: function() {
        option.success(shoppingInfo);
      },
      fail: function() {
        option.fail({ error: true, message: "数据保存失败" })
      }
    });
  },
  removePaylist(option) {
    if (!option.success) option.success = function(res) { console.log('addPaylist success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('addPaylist fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.key) {
      option.fail({ error: true, message: "没有要删除的支付方式的key" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    for (var i in shoppingInfo.paylist) {
      if (shoppingInfo.paylist[i].key === option.key) {
        shoppingInfo.paylist.splice(i, 1);
      }
    }
    my.setStorage({
      data: shoppingInfo, // 要缓存的数据
      key: 'shoppingcart' + option.storeid, // 缓存数据的key
      success: function() {
        option.success(shoppingInfo);
      },
      fail: function() {
        option.fail({ error: true, message: "数据保存失败" })
      }
    });

  },
  addGoodsToShoppingCart(option) {
    if (!option.success) option.success = function(res) { console.log('addPaylist success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('addPaylist fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.goodsdata) {
      option.fail({ error: true, message: "没有设置goodsdata" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    option.goodsdata.key = this.getUUID();
    shoppingInfo.goods.push(option.goodsdata);
    shoppingInfo.goodsnumber++;
    if(shoppingInfo.goodsnumbers[option.goodsdata.goodsid] ){
      shoppingInfo.goodsnumbers[option.goodsdata.goodsid]++;
    }else{
      shoppingInfo.goodsnumbers[option.goodsdata.goodsid] = 1;
    }
    if(shoppingInfo.typenumbers[option.goodsdata.gtid] ){
      shoppingInfo.typenumbers[option.goodsdata.gtid]++;
    }else{
      shoppingInfo.typenumbers[option.goodsdata.gtid] = 1;
    }
    my.setStorage({
      data: shoppingInfo, // 要缓存的数据
      key: 'shoppingcart' + option.storeid, // 缓存数据的key
      success: function() {
        option.success(shoppingInfo);
      },
      fail: function() {
        option.fail({ error: true, message: "数据保存失败" })
      }
    });
  },
  incGoodsToShoppingCart(option) {
    if (!option.success) option.success = function(res) { console.log('addPaylist success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('addPaylist fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.key) {
      option.fail({ error: true, message: "没有要增加商品的key" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    for (var i in shoppingInfo.goods) {
      if (shoppingInfo.goods[i].key === option.key) {
        //@todo 未来第二份半价等优惠活动在这里完善计算即可
        shoppingInfo.goods[i].goodsno++;
        shoppingInfo.goods[i].yprice = shoppingInfo.goods[i].goodsno * shoppingInfo.goods[i].mprice;
        shoppingInfo.goods[i].youhuiprice = 0;
        shoppingInfo.goods[i].sprice = shoppingInfo.goods[i].yprice;
      }
    }
    shoppingInfo.goodsnumber++;
    my.setStorage({
      data: shoppingInfo, // 要缓存的数据
      key: 'shoppingcart' + option.storeid, // 缓存数据的key
      success: function() {
        option.success(shoppingInfo);
      },
      fail: function() {
        option.fail({ error: true, message: "数据保存失败" })
      }
    });

  },
  decGoodsToShoppingCart(option) {
    if (!option.success) option.success = function(res) { console.log('addPaylist success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('addPaylist fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.key) {
      option.fail({ error: true, message: "没有要减少商品的key" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    for (var i in shoppingInfo.goods) {
      if (shoppingInfo.goods[i].key === option.key) {
        //@todo 未来第二份半价等优惠活动在这里完善计算即可
        shoppingInfo.goods[i].goodsno--;
        // 如果商品减至0，则直接调用删除方法
        if (shoppingInfo.goods[i].goodsno === 0) {
          shoppingInfo.goods.splice(i, 1);
        } else {
          shoppingInfo.goods[i].yprice = shoppingInfo.goods[i].goodsno * shoppingInfo.goods[i].mprice;
          shoppingInfo.goods[i].youhuiprice = 0;
          shoppingInfo.goods[i].sprice = shoppingInfo.goods[i].yprice;
        }
      }
    }
    shoppingInfo.goodsnumber--;
    my.setStorage({
      data: shoppingInfo, // 要缓存的数据
      key: 'shoppingcart' + option.storeid, // 缓存数据的key
      success: function() {
        option.success(shoppingInfo);
      },
      fail: function() {
        option.fail({ error: true, message: "数据保存失败" })
      }
    });
  },
  removeGoodsToShoppingCart(option) {
    if (!option.success) option.success = function(res) { console.log('addPaylist success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('addPaylist fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.key) {
      option.fail({ error: true, message: "没有要删除的商品key" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    for (var i in shoppingInfo.goods) {
      if (shoppingInfo.goods[i].key === option.key) {
        //@todo 未来第二份半价等优惠活动在这里完善计算即可
        shoppingInfo.goodsnumber = shoppingInfo.goodsnumber - shoppingInfo.goods[i].goodsno;
        shoppingInfo.goods.splice(i, 1);
      }
    }
    my.setStorage({
      data: shoppingInfo, // 要缓存的数据
      key: 'shoppingcart' + option.storeid, // 缓存数据的key
      success: function() {
        option.success(shoppingInfo);
      },
      fail: function() {
        option.fail({ error: true, message: "数据保存失败" })
      }
    });
  },
  clearShoppingCart(option) {
    if (!option.success) option.success = function(res) { console.log('addPaylist success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('addPaylist fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }

    my.setStorage({
      data: null, // 要缓存的数据
      key: 'shoppingcart' + option.storeid, // 缓存数据的key
      success: function() {
        option.success(this.getShoppingCart(option.storeid));
      },
      fail: function() {
        option.fail({ error: true, message: "数据保存失败" })
      }
    });
  },
  getUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },
}