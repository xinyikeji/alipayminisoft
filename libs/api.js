import http from './http'
export default {
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
      method: "alipay.StoreInfoAlipay.getStoreList",
      alipay_appid: extJson.aliappid,
      type: 1,
      storeid: storeid
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        my.setStorageSync({
          key: "storeinfo-" + storeid,
          data: rest.data.data[0]
        })
        callback(rest.data.data[0]);
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
      method: "alipay.StoreInfoAlipay.getStoreList",
      alipay_appid: extJson.aliappid,
      type: 1
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        for (var i in rest.data.data) {
          my.setStorageSync({
            key: "storeinfo-" + rest.data.data[i].storeid,
            data: rest.data.data[i]
          })
        }
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
  getGoodsInfo(storeid, callback) {
    var datainfo = my.getStorageSync({
      key: 'store-goods-all-' + storeid, // 缓存数据的key
    });
    if (datainfo.data) {
      callback(datainfo.data);
      return;
    }
    const extJson = my.getExtConfigSync();
    http.post({
      method: "alipay.GoodsInfo.getGoodsTypeList",
      alipay_appid: extJson.aliappid,
      type: 1,
      storeid: storeid
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        http.post({
          method: "alipay.GoodsInfo.getGoodsInfo",
          alipay_appid: extJson.aliappid,
          type: 1,
          storeid: storeid
        }, function(status, restgoods) {
          if (status && restgoods.data.code === 1) {
            //处理数据
            var goodsObj = {}, goodsTypeData = {}, typeTabData = [];
            for (var i in restgoods.data.data) {
              restgoods.data.data[i].priceFormat = (restgoods.data.data[i].price / 100).toFixed(2)
              goodsObj[restgoods.data.data[i]['goodsid']] = restgoods.data.data[i];
              if (!goodsTypeData[restgoods.data.data[i]['gtid']]) goodsTypeData[restgoods.data.data[i]['gtid']] = [];
              goodsTypeData[restgoods.data.data[i]['gtid']].push(restgoods.data.data[i]);
            }
            for (var j in rest.data.data) {
              typeTabData.push({
                title: rest.data.data[j].name,
                anchor: rest.data.data[j].gtid,
                info: rest.data.data[j]
              })
            }
            my.setStorageSync({
              key: "store-goods-all-" + storeid,
              data: {
                goodstype: rest.data.data,
                goodsdata: restgoods.data.data,
                goodsObj: goodsObj,
                goodsTypeData: goodsTypeData,
                typeTabData: typeTabData
              }
            })
            callback({
              goodstype: rest.data.data,
              goodsdata: restgoods.data.data,
              goodsObj: goodsObj,
              goodsTypeData: goodsTypeData,
              typeTabData: typeTabData
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
}