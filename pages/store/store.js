import api from '/libs/api'
const app = getApp();
Page({
  data: {
    scale: 14,
    longitude: 120.131441,
    latitude: 30.279383,
    markers: []
  },
  onLoad() {

  },
  markertap(e) {
    console.log('marker tap', e);
  },
  onCalloutTap(e) {
    console.log('onCalloutTap', e);
  },
  onReady(e) {
    this.mapCtx = my.createMapContext('storemap');
    this.getStoreList();
  },
  getStoreList() {
    var _this = this;
    api.getStoreList(function(storelist) {
      console.log(storelist)
      if(!storelist) {
        return ;
      }
      
      my.getLocation({
        success(res) {
          var customCalloutMarkers = [], storeinfo = null;
          for (var i in storelist) {
            storelist[i].longvalue = parseInt(app.getLong(res.latitude, res.longitude, storelist[i].lat, storelist[i].lng));
            storelist[i].longvalueFormat = app.getLongFormat(storelist[i].longvalue);
          }
          storelist.sort(function(x, y) {
            return x.longvalue > y.longvalue;
          })
          for (var j in storelist) {
            storeinfo = storelist[j];

            customCalloutMarkers.push({
              id: storeinfo.storeid,
              latitude: storeinfo.lat,
              longitude: storeinfo.lng,
              width: 32,
              height: 32,
              iconPath: '/static/icon/weizhi.png',
              "customCallout": {
                "type": 1,
                "time": "3",
                "descList": [{
                  "desc": "距离您",
                  "descColor": "#333333"
                }, {
                  "desc": storeinfo.longvalueFormat,
                  "descColor": "#108EE9"
                }],
                "isShow": 1
              },
              markerLevel: 2
            });
          }
          console.log(customCalloutMarkers)
          _this.setData({
            storelist: storelist,
             markers: customCalloutMarkers
          })
          _this.setStoreTomap({ index: 0 });

        },
        fail() {
          my.hideLoading();
          my.alert({ title: '定位失败' });
        },
      })
    })
  },
  setStoreTomap(event) {
    console.log(event)
    if (!my.canIUse('createMapContext.return.updateComponents')) {
      my.alert({
        title: '客户端版本过低',
        content: 'this.mapCtx.updateComponents 需要 10.1.35 及以上版本'
      });
      return;
    }
    const storeinfo = this.data.storelist[event.index];
    console.log(storeinfo)

    this.mapCtx.updateComponents({
      scale: 14,
      longitude: storeinfo.lng,
      latitude: storeinfo.lat
    });
  }
});
