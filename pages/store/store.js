import api from '/libs/api'
const app = getApp();
Page({
  data: {
    scale: 14,
    nowindex: 0,
    longitude: 120.131441,
    latitude: 30.279383,
    markers: []
  },
  onLoad() {
    api.uploadBehavior({ data: { mode: "instpage", query: {}, path: '/pages/store/store' } });
  },
  onReady(e) {
    this.mapCtx = my.createMapContext('storemap');

    this.getStoreList();
  },
  getStoreList() {
    var _this = this;
    api.getStoreList(function (storelist) {
      console.log('获取门店列表', storelist)
      if (!storelist) {
        console.log('!storelist')
        return;
      }

      my.getLocation({
        success(res) {
          for (var i in storelist) {
            storelist[i].longvalue = parseInt(app.getLong(res.latitude, res.longitude, storelist[i].lat, storelist[i].lng));
            storelist[i].longvalueFormat = app.getLongFormat(storelist[i].longvalue);
            // console.log(storelist[i].longvalue,storelist[i].longvalueFormat)
          }
          storelist.sort(function (x, y) {
            return x.longvalue > y.longvalue;
          })

          _this.setData({
            storelist: storelist
          })
          _this.setStoreTomap({ index: 0 });

        },
        fail() {
          my.hideLoading();
          my.alert({
            title: '定位失败',
            success() {
              my.reLaunch({
                url: '/pages/index/index'
              });
            }
          });
        },
      })
    })
  },
  onUnload() {
    api.uploadBehavior({ data: { mode: "uninstpage", query: {}, path: '/pages/store/store' } });
  },
  // 切换门店
  gotoClickGoodsTap(event) {
    // api.getStopCompleteList()
    // console.log('EVENT', event)
    // console.log('storelist', this.data.storelist)
    const storeinfo = this.data.storelist[event.currentTarget.dataset.index];
    if (storeinfo.shop_type === 0) {
      my.redirectTo({
        url: "../shopping/shopping?id=" + storeinfo.storeid
      })
    } else {
      my.alert({
        title: "提示",
        content: '此门店暂不支持自助点餐~'
      })
    }
    // console.log(storeinfo)
  },
  setStoreTomap(event) {
    // console.log(event)
    if (!my.canIUse('createMapContext.return.updateComponents')) {
      my.alert({
        title: '客户端版本过低',
        content: 'this.mapCtx.updateComponents 需要 10.1.35 及以上版本'
      });
      return;
    }
    this.setData({
      nowindex: event.index
    })
    const storeinfo = this.data.storelist[event.index];
    // console.log('storeinfo', storeinfo)

    this.mapCtx.updateComponents({
      scale: 14,
      longitude: storeinfo.lng,
      latitude: storeinfo.lat,
      markers: [{
        id: storeinfo.storeid,
        latitude: storeinfo.lat,
        longitude: storeinfo.lng,
        width: 32,
        height: 32,
        iconPath: '/static/icon/weizhi.png',
        "customCallout": {
          "type": 2,
          "descList": [{
            "desc": storeinfo.storename,
            "descColor": "#333333"
          }, {
            "desc": storeinfo.longvalueFormat,
            "descColor": "#108EE9"
          }],
          "isShow": 1
        },
        markerLevel: 2
      }]
    });
  }
});
