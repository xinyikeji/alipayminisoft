import api from '/libs/api'
import php from '/libs/php'
const app = getApp();
Page({
  data: {
    loading: true,
    windowHeight: 80,
    options: {},
    storeData: {

    },
    goodsData: {},
    userInfo: {},
    clickgoodsnumber: 1,
    activeTab: 0,
    showTop: false,
    showData: {},
    showInfoData: {},
    showDataEmpty: []
  },
  handleChange(index) {
    console.log('handleChange', index)
    this.setData({
      activeTab: index,
    });
  },
  onListChange(index) {
    console.log(index)
  },
  onLoad(options) {
    this.setData({
      options: options
    })
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    var _this = this;
    app.getUserInfo(function(userinfo) {
      if (userinfo) {

        _this.setData({
          userInfo: userinfo
        })
        //开始拉取用户基本数据
        _this.getStoreInfo();
      } else {
        my.alert({
          title: '获取用户信息失败'
        });
      }
    })
  },
  getStoreInfo() {
    var _this = this;
    api.getStoreInfo(this.data.options.id, function(storeinfo) {
      if (storeinfo) {
        my.getLocation({
          success(res) {
            my.hideLoading();
            storeinfo.longvalue = app.getLong(res.latitude, res.longitude, storeinfo.lat, storeinfo.lng);
            storeinfo.longvalueFormat = app.getLongFormat(storeinfo.longvalue);
            _this.setData({
              storeData: storeinfo
            })
          },
          fail() {
            my.hideLoading();
            my.alert({ title: '定位失败' });
          },
        })
        _this.getGoodsData();
      }
    })
  },
  getGoodsData() {
    var _this = this;
    // 获取数据
    api.getGoodsInfo(this.data.options.id, function(goodsdata) {
      _this.setData({
        goodsData: goodsdata
      })

    })
  },
  // 设置商品规格页面隐藏
  onPopupClose() {
    this.setData({
      showTop: false,
      showDataEmpty:['1']
    });
  },
  onInfoPopupClose() {
    this.setData({
      showInfoTop: false
    })
  },
  showInfoPopup(event) {
    this.setData({
      showInfoTop: true,
      showInfoData: this.data.goodsData.goodsObj[event.currentTarget.dataset.goodsid]
    })
  },
  plusGoods(event) {
    console.log(event);
    console.log(this.data.goodsData.goodsObj[event.currentTarget.dataset.goodsid])
    this.setData({
      showTop: true,
      showInfoTop: false,
      showData: this.data.goodsData.goodsObj[event.currentTarget.dataset.goodsid]
    })
  },
  callBackFn(value) {
    console.log(value);
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
