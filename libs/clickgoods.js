import http from './http'
import php from './php'

export default {
  getShoppingCart(storeid) {
    const shoppingdata = my.getStorageSync({
      key: 'shoppingcart' + storeid, // 缓存数据的key
    });
    if (shoppingdata.data) {
      return shoppingdata.data;
    } else {
      var defaultData = {
        order_id: null,
        goodsnumber: 0,
        type: 4,//订单类型（1外送2外带3堂食4自助）
        people: 0, //就餐人数
        reservation: 0,//是否预约单
        yytime: php.time(),//预约时间
        is_suitflag: 1,//启用套餐
        ispay: 0, //是否已经支付
        total_price: 0, //订单总价
        goodsnumbers: {},
        typenumbers: {},
        store: {
          storeid: storeid,
          name: ''
        },
        copenid:"", //创建人
        discount_price: 0,// 订单优惠金额
        sprice: 0, //实收金额（需要支付的金额）
        remark: "", //整单备注
        need_invoice: 1,//是否需要发票，1是2不需要
        ctime: php.time(),
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
    //设置订单创建人
    if(option.user.openid) {
      shoppingInfo.copenid = option.user.openid;
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
  getOrderId(option) {
    if (!option.success) option.success = function(res) { console.log('setUserInfo success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('setUserInfo fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.storecode) {
      option.fail({ error: true, message: "没有设置storecode" })
      return;
    }

    option.success('AX' + php.date('YmdHis') + option.storecode + php.time());

  },
  setStoreInfo(option) {
    if (!option.success) option.success = function(res) { console.log('setUserInfo success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('setUserInfo fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.store) {
      option.fail({ error: true, message: "没有设置store" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    for (var i in shoppingInfo.store) {
      if (option.store[i]) shoppingInfo.store[i] = option.store[i];
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
  clearPaylist(option) {
    if (!option.success) option.success = function(res) { console.log('addPaylist success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('addPaylist fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    shoppingInfo.paylist = [];
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
    if (!option.paytype.ptid) {
      option.fail({ error: true, message: "没有设置paytype.ptid" })
      return;
    }
    if (!option.paytype.price) {
      option.fail({ error: true, message: "没有设置paytype.price" })
      return;
    }
    if (!option.paytype.paytype) {
      option.fail({ error: true, message: "没有设置paytype.paytype" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    option.paytype.isonline = 1;
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
    if (!option.ptid) {
      option.fail({ error: true, message: "没有要删除的支付方式的ptid" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    for (var i in shoppingInfo.paylist) {
      if (shoppingInfo.paylist[i].ptid === option.ptid) {
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
    option.goodsdata.key = php.md5(php.json_encode(option.goodsdata));
    for (var i in shoppingInfo.goods) {
      if (shoppingInfo.goods[i].key === option.goodsdata.key) {
        this.incGoodsToShoppingCart({
          storeid: option.storeid,
          key: option.goodsdata.key,
          success: option.success,
          fail: option.fail
        });
        return;
      }
    }

    shoppingInfo.goods.push(option.goodsdata);
    shoppingInfo.goodsnumber++;
    shoppingInfo.sprice += option.goodsdata.tmpprice;
    shoppingInfo.total_price += option.goodsdata.tmpprice;
    shoppingInfo.discount_price += option.goodsdata.youhuiprice;

    if (shoppingInfo.goodsnumbers[option.goodsdata.goodsid]) {
      shoppingInfo.goodsnumbers[option.goodsdata.goodsid]++;
    } else {
      shoppingInfo.goodsnumbers[option.goodsdata.goodsid] = 1;
    }
    if (shoppingInfo.typenumbers[option.goodsdata.gtid]) {
      shoppingInfo.typenumbers[option.goodsdata.gtid]++;
    } else {
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

        shoppingInfo.sprice -= shoppingInfo.goods[i].tmpprice;
        shoppingInfo.total_price -= shoppingInfo.goods[i].tmpprice;
        shoppingInfo.discount_price -= shoppingInfo.goods[i].youhuiprice;

        shoppingInfo.goods[i].goodsno++;
        shoppingInfo.goods[i].yprice = shoppingInfo.goods[i].goodsno * shoppingInfo.goods[i].one_yprice;
        shoppingInfo.goods[i].youhuiprice = 0;
        shoppingInfo.goods[i].sprice = shoppingInfo.goods[i].goodsno * shoppingInfo.goods[i].one_sprice;
        shoppingInfo.goods[i].tmpprice = shoppingInfo.goods[i].goodsno * shoppingInfo.goods[i].tmp_oneprice;

        shoppingInfo.sprice += shoppingInfo.goods[i].tmpprice;
        shoppingInfo.total_price += shoppingInfo.goods[i].tmpprice;
        shoppingInfo.discount_price += shoppingInfo.goods[i].youhuiprice;

        if (shoppingInfo.goodsnumbers[shoppingInfo.goods[i].goodsid]) {
          shoppingInfo.goodsnumbers[shoppingInfo.goods[i].goodsid]++;
        } else {
          shoppingInfo.goodsnumbers[shoppingInfo.goods[i].goodsid] = 1;
        }
        if (shoppingInfo.typenumbers[shoppingInfo.goods[i].gtid]) {
          shoppingInfo.typenumbers[shoppingInfo.goods[i].gtid]++;
        } else {
          shoppingInfo.typenumbers[shoppingInfo.goods[i].gtid] = 1;
        }
        //套餐处理
        if (shoppingInfo.goods[i].suitflag === 1) {
          for (var j in shoppingInfo.goods[i].child) {
            shoppingInfo.goods[i].child[j].goodsno = shoppingInfo.goods[i].child[j].one_goodsno * shoppingInfo.goods[i].goodsno;
            shoppingInfo.goods[i].child[j].sprice = shoppingInfo.goods[i].child[j].yprice = shoppingInfo.goods[i].child[j].addprice = shoppingInfo.goods[i].child[j].one_price * shoppingInfo.goods[i].goodsno;
          }
        }



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
  decGoodsByGoodsid(option) {
    if (!option.success) option.success = function(res) { console.log('addPaylist success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('addPaylist fail ', res) }
    if (!option.storeid) {
      option.fail({ error: true, message: "没有设置storeid" })
      return;
    }
    if (!option.goodsid) {
      option.fail({ error: true, message: "没有要增加商品的key" })
      return;
    }
    var shoppingInfo = this.getShoppingCart(option.storeid);
    console.log(shoppingInfo.goods)
    for (var i in shoppingInfo.goods) {
      if (shoppingInfo.goods[i].goodsid == option.goodsid) {
        console.log(shoppingInfo.goods[i])
        this.decGoodsToShoppingCart({
          storeid: option.storeid,
          key: shoppingInfo.goods[i].key,
          success: option.success,
          fail: option.fail
        })
        break
      }
    }
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
        shoppingInfo.goodsnumber--;
        //还原总价
        shoppingInfo.sprice -= shoppingInfo.goods[i].tmpprice;
        shoppingInfo.total_price -= shoppingInfo.goods[i].tmpprice;
        shoppingInfo.discount_price -= shoppingInfo.goods[i].youhuiprice;

        // 如果商品减至0，则直接调用删除方法
        if (shoppingInfo.goods[i].goodsno === 0) {
          if (shoppingInfo.goodsnumbers[shoppingInfo.goods[i].goodsid]) {
            shoppingInfo.goodsnumbers[shoppingInfo.goods[i].goodsid]--;
          }
          if (shoppingInfo.typenumbers[shoppingInfo.goods[i].gtid]) {
            shoppingInfo.typenumbers[shoppingInfo.goods[i].gtid]--;
          }
          shoppingInfo.goods.splice(i, 1);
        } else {
          shoppingInfo.goods[i].yprice = shoppingInfo.goods[i].goodsno * shoppingInfo.goods[i].one_yprice;
          shoppingInfo.goods[i].youhuiprice = 0;
          shoppingInfo.goods[i].sprice = shoppingInfo.goods[i].goodsno * shoppingInfo.goods[i].one_sprice;
          shoppingInfo.goods[i].tmpprice = shoppingInfo.goods[i].goodsno * shoppingInfo.goods[i].tmp_oneprice;

          //计算总价
          shoppingInfo.sprice += shoppingInfo.goods[i].tmpprice;
          shoppingInfo.total_price += shoppingInfo.goods[i].tmpprice;
          shoppingInfo.discount_price += shoppingInfo.goods[i].youhuiprice;

          if (shoppingInfo.goodsnumbers[shoppingInfo.goods[i].goodsid]) {
            shoppingInfo.goodsnumbers[shoppingInfo.goods[i].goodsid]--;
          }
          if (shoppingInfo.typenumbers[shoppingInfo.goods[i].gtid]) {
            shoppingInfo.typenumbers[shoppingInfo.goods[i].gtid]--;
          }
        }
        //套餐处理
        if (shoppingInfo.goods[i].suitflag === 1) {
          for (var j in shoppingInfo.goods[i].child) {
            shoppingInfo.goods[i].child[j].goodsno = shoppingInfo.goods[i].child[j].one_goodsno * shoppingInfo.goods[i].goodsno;
            shoppingInfo.goods[i].child[j].sprice = shoppingInfo.goods[i].child[j].yprice = shoppingInfo.goods[i].child[j].addprice = shoppingInfo.goods[i].child[j].one_price * shoppingInfo.goods[i].goodsno;
          }
        }


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
        shoppingInfo.goods[i].goodsno--;
        //还原总价
        shoppingInfo.sprice -= shoppingInfo.goods[i].sprice;
        shoppingInfo.total_price -= shoppingInfo.goods[i].yprice;
        shoppingInfo.tmpprice -= shoppingInfo.goods[i].yprice;
        shoppingInfo.discount_price -= shoppingInfo.goods[i].youhuiprice;

        //@todo 未来第二份半价等优惠活动在这里完善计算即可
        shoppingInfo.goodsnumber = shoppingInfo.goodsnumber - shoppingInfo.goods[i].goodsno;

        if (shoppingInfo.goodsnumbers[shoppingInfo.goods[i].goodsid]) {
          shoppingInfo.goodsnumbers[shoppingInfo.goods[i].goodsid] -= shoppingInfo.goods[i].goodsno;
        }
        if (shoppingInfo.typenumbers[shoppingInfo.goods[i].gtid]) {
          shoppingInfo.typenumbers[shoppingInfo.goods[i].gtid] -= shoppingInfo.goods[i].goodsno;
        }

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
    my.removeStorage({
      key: 'shoppingcart' + option.storeid, // 缓存数据的key
      success: (res) => {
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