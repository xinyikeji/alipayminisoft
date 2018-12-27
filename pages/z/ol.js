import api from '/libs/api'
import php from '/libs/php'
import clickgoods from '/libs/clickgoods'
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
    showDataEmpty: [],
    shopCart: {}
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
        // 开始拉取门店基本数据
        _this.getStoreInfo();
        // 读取当前门店购物车数据

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
      console.log('all goodsdata', goodsdata)
      var userinfo = _this.data.userInfo;
      userinfo.name = userinfo.nickname;
      clickgoods.setUserInfo({
        storeid: _this.data.options.id,
        user: userinfo,
        success: function(res) {
          _this.setData({
            shopCart: res,
            goodsData: goodsdata
          })
          _this.reloadData();
        }
      })
    })
  },
  reloadData() {
    var goodsdata = this.data.goodsData;
    var shopCart = this.data.shopCart;
    for (var i in goodsdata.typeTabData) {
      if (shopCart.typenumbers[goodsdata.typeTabData[i].anchor]) {
        goodsdata.typeTabData[i].badgeType = 'text';
        goodsdata.typeTabData[i].badgeText = shopCart.typenumbers[goodsdata.typeTabData[i].anchor];
      } else {
        if (goodsdata.typeTabData[i].badgeType) {
          delete goodsdata.typeTabData[i].badgeType;
          delete goodsdata.typeTabData[i].badgeText;
        }
      }
    }
    console.log('reloaddata',goodsdata);
    _this.setData({
      goodsData: goodsdata
    })
  },
  // 设置商品规格页面隐藏
  onPopupClose() {
    this.setData({
      showTop: false,
      showDataEmpty: ['1']
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
    var goodsData = this.data.goodsData.goodsObj[event.currentTarget.dataset.goodsid];
    var _this = this;
    if (goodsData.suitflag === 0) {
      clickgoods.addGoodsToShoppingCart({
        storeid: this.data.options.id,
        goodsdata: goodsData,
        success: function(res) {
          console.log('goodsData', res);
          _this.setData({
            shopCart: res
          })
          _this.reloadData();
        }
      });
    } else {
      this.setData({
        showTop: true,
        showInfoTop: false,
        showData: goodsData
      })
    }

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
