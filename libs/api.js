import http from './http'
export default {
  getOrderList(option) {
    if (!option.success) option.success = function(res) { console.log('getOrderList success ', res) }
    if (!option.fail) option.fail = function(res) { console.log('getOrderList fail ', res) }
    if (!option.openid) {
      option.fail({ error: true, message: "没有设置openid" })
      return;
    }
    if (!option.year) {
      option.fail({ error: true, message: "没有设置year" })
      return;
    }
    var info = my.getStorageSync({
      key: 'orderlist' + option.year, // 缓存数据的key
    });
    console.log(info)
    if (info.data) {
      option.success(info.data.rowdata);
      return;
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "member.OpenUser.getOrderlist",
      openid: option.openid,
      year: option.year,
      page: 1,
      page_size: 1000
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        for (var i in rest.data.data.rowdata) {
          delete rest.data.data.rowdata[i].detail;
        }
        my.setStorage({
          key: 'orderlist' + option.year,
          data: rest.data.data,
          success: (res) => {
            console.log('orderlist' + option.year, res)
          },
          fail: (res) => {
            console.log(res)
          }
        })
        option.success(rest.data.data.rowdata)
      } else {
        option.fail({ error: true, message: "数据读取失败" })
        return;
      }
    })

  },
  getStoreInfo(storeid, callback) {
    var storeinfo = my.getStorageSync({
      key: 'storeinfo-' + storeid, // 缓存数据的key
    });
    if (storeinfo.data) {
      callback(storeinfo.data);
      return;
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "miniapp.StoreInfo.getStoreInfo",
      third_appid: extJson.aliappid,
      type: 1,
      ptype: 2,
      storeid: storeid
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        my.setStorageSync({
          key: "storeinfo-" + storeid,
          data: rest.data.data
        })
        callback(rest.data.data);
      } else {
        callback(false);
      }
    })
  },
  getStoreList(callback) {
    var storeinfo = my.getStorageSync({
      key: 'storeinfo-all', // 缓存数据的key
    });
    if (storeinfo.data) {
      callback(storeinfo.data);
      return;
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "miniapp.StoreInfo.getStoreList",
      third_appid: extJson.aliappid,
      ptype: 2,
      type: 1
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        my.setStorageSync({
          key: "storeinfo-all",
          data: rest.data.data
        })
        callback(rest.data.data);
      } else {
        console.log(status, rest)
        callback(false);
      }
    })
  },
  getIntegralList(openid, page, callback) {
    http.post({
      method: "member.OpenUser.getIntegralWater",
      openid: openid,
      page: page,
      page_size: 30
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        callback(rest.data.data);
      } else {
        console.log(status, rest)
        callback(false);
      }
    })
  },
  getFinancialflow(openid, page, callback) {
    http.post({
      method: "member.MemberInfo.getFinancialflow",
      openid: openid,
      page: page,
      page_size: 30
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        callback(rest.data.data.rowdata);
      } else {
        console.log(status, rest)
        callback(false);
      }
    })
  },
  getUserGiveGoods(openid, storeid, callback) {
    const extJson = my.getExtConfigSync();
    http.post({
      method: "miniapp.Activity.getUserGiveGoods",
      openid: openid,
      storeid: storeid,
      third_appid: extJson.aliappid,
      ptype: 2
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        callback(rest.data.data);
      } else {
        console.log(status, rest)
        callback(false);
      }
    })
  },
  getIndexAds(openid, callback) {
    var datainfo = my.getStorageSync({
      key: 'indexads-all', // 缓存数据的key
    });
    if (datainfo.data) {
      callback(datainfo.data);
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "miniapp.Activity.getIndexActivityLink",
      openid: openid,
      third_appid: extJson.aliappid,
      ptype: 2
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        my.setStorageSync({
          key: "indexads-all",
          data: rest.data.data
        })
        callback(rest.data.data);
      } else {
        console.log(status, rest)
        callback(false);
      }
    })
  },
  getIntegralShoppingList(openid, callback) {
    var storeinfo = my.getStorageSync({
      key: 'getIntegralList-all', // 缓存数据的key
    });
    if (storeinfo.data) {
      callback(storeinfo.data);
      return;
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "member.OpenIntegralMall.getIntegralList",
      openid: openid,
      page: 1
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        my.setStorageSync({
          key: "getIntegralList-all",
          data: rest.data.data
        })
        callback(rest.data.data);
      } else {
        console.log(status, rest)
        callback(false);
      }
    })
  },
  getMemberConfigInfo(storeid, callback) {
    var info = my.getStorageSync({
      key: 'member.MemberInfo.memberAccount', // 缓存数据的key
    });
    if (info.data) {
      callback(info.data);
      return;
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "member.MemberInfo.memberAccount",
      storeid: storeid,
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        my.setStorageSync({
          key: "member.MemberInfo.memberAccount",
          data: rest.data.data
        })
        callback(rest.data.data);
      } else {
        console.log(status, rest)
        callback(false);
      }
    })
  },
  uploadOrder(data, callback) {
    data.method = "order.xinyiorder.uploadOrder";
    http.post(data, function(status, rest) {
      if (status && rest.data.code === 1) {
        callback(rest.data.data);
      } else {
        console.log(status, rest)
        callback(false);
      }
    })
  },
  createAlipay(data, callback) {
    data.method = "miniapp.OnlinePay.getAliPayPaymentOrderno";
    http.post(data, function(status, rest) {
      if (status && rest.data.code === 1) {
        callback(rest.data.data);
      } else {
        console.log(status, rest)
        callback(false);
      }
    })
  },
  getGoodsInfo(storeid, callback) {
    var datainfo = my.getStorageSync({
      key: 'store-goods-all-' + storeid, // 缓存数据的key
    });
    var dataobjinfo = my.getStorageSync({
      key: 'store-goods-goods-obj-' + storeid, // 缓存数据的key
    });
    var dataTypeobjinfo = my.getStorageSync({
      key: 'store-goods-type-obj-' + storeid, // 缓存数据的key
    });
    if (datainfo.data && dataobjinfo.data && dataTypeobjinfo.data) {
      callback({
        goodstype: datainfo.data.goodstype,
        goodsdata: datainfo.data.goodsdata,
        goodsObj: dataobjinfo.data.goodsObj,
        goodsTypeData: dataTypeobjinfo.data.goodsTypeData
      });
      return;
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "miniapp.GoodsInfo.getGoodsTypeList",
      third_appid: extJson.aliappid,
      type: 1,
      ptype: 2,
      storeid: storeid
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        http.post({
          method: "miniapp.GoodsInfo.getGoodsInfo",
          third_appid: extJson.aliappid,
          type: 1,
          ptype: 2,
          storeid: storeid
        }, function(status, restgoods) {
          if (status && restgoods.data.code === 1) {
            //处理数据
            var goodsObj = {}, goodsTypeData = {};
            for (var i in restgoods.data.data) {
              restgoods.data.data[i].priceFormat = (restgoods.data.data[i].price / 100).toFixed(2)
              goodsObj[restgoods.data.data[i]['goodsid']] = restgoods.data.data[i];
              if (!goodsTypeData[restgoods.data.data[i]['gtid']]) goodsTypeData[restgoods.data.data[i]['gtid']] = [];
              goodsTypeData[restgoods.data.data[i]['gtid']].push(restgoods.data.data[i]);
            }
            my.setStorage({
              key: "store-goods-all-" + storeid,
              data: {
                goodstype: rest.data.data,
                goodsdata: restgoods.data.data,
              },
              fail: function(res) {
                my.alert({ content: '1' + res.errorMessage });
              }
            })
            my.setStorage({
              key: "store-goods-goods-obj-" + storeid,
              data: {
                goodsObj: goodsObj,
              },
              fail: function(res) {
                my.alert({ content: '2' + res.errorMessage });
              }
            })
            my.setStorage({
              key: "store-goods-type-obj-" + storeid,
              data: {
                goodsTypeData: goodsTypeData,
              },
              fail: function(res) {
                my.alert({ content: '3' + res.errorMessage });
              }
            })
            callback({
              goodstype: rest.data.data,
              goodsdata: restgoods.data.data,
              goodsObj: goodsObj,
              goodsTypeData: goodsTypeData
            });
          } else {
            callback(false);
          }
        })
      } else {
        callback(false);
      }
    })
  },
  getUserAccount(openid, callback) {
    http.post({
      openid: openid,
      usercoupon: '1',
      method: "member.MemberInfo.getMemberInfoDetail",
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        callback(rest.data.data);
      } else {
        callback(false);
      }
    })
  },
}