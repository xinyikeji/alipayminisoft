import api from '/libs/api'
import php from '/libs/php'
import clickgoods from '/libs/clickgoods'
const app = getApp();
var settab =
  Page({
    data: {
      windowHeight: 0,
      windowWidth: 0,
      avtiveType: 0,
      scrollTop: 0,
      indexMap: {},
      userInfo: {},
      options: {},
      shopCart: {},
      goodsData: {},
      showSelect: false,
      showSelectGoodsData: {},
      showGoodsInfo: false,
      showGoodsInfoData: {},
      showShoppingCart: false,
    },
    onLoad(options) {
      if (!options.id) options.id = 3;
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

      var _this = this;
      app.getUserInfo(function(userinfo) {
        if (userinfo) {

          _this.setData({
            userInfo: userinfo
          })

          // 开始拉取门店基本数据
          my.showLoading({
            content: "数据加载中"
          });
          api.getStoreInfo(_this.data.options.id, function(storeinfo) {
            console.log(storeinfo)
            if (storeinfo) {
              my.getLocation({
                success(res) {
                  storeinfo.longvalue = app.getLong(res.latitude, res.longitude, storeinfo.lat, storeinfo.lng);
                  storeinfo.longvalueFormat = app.getLongFormat(storeinfo.longvalue);
                  _this.setData({
                    storeData: storeinfo
                  })
                  storeinfo.name = storeinfo.storename;
                  userinfo.name = userinfo.nickname;
                  clickgoods.setUserInfo({
                    storeid: _this.data.options.id,
                    user: userinfo,
                    success: function(res) {
                      clickgoods.setStoreInfo({
                        storeid: _this.data.options.id,
                        store: storeinfo,
                        success: function(res) {
                          console.log('showCart ', res)
                          _this.setData({
                            shopCart: res
                          })
                        }
                      })
                    }
                  })

                  api.getGoodsInfo(_this.data.options.id, function(goodsdata) {
                    console.log('all goodsdata', goodsdata)
                    my.hideLoading();
                    //计算分类下每个商品区域的高度
                    _this.setData({
                      goodsData: goodsdata,
                    })
                    var indexMap = [];
                    for (var i in goodsdata.goodstype) {
                      my.createSelectorQuery().select('.goodslist-item' + goodsdata.goodstype[i].gtid).boundingClientRect().exec(function(ret) {
                        indexMap.push(ret[0]);
                      })
                    }
                    _this.setData({
                      indexMap: indexMap
                    })
                  })
                },
                fail() {
                  my.hideLoading();
                  my.alert({ title: '定位失败', content: '请检查是否授权我们使用您的位置信息' });
                },
              })
            } else {
              my.hideLoading();
              my.alert({ title: "错误提示", content: '门店数据获取失败，请重新进入尝试' });
            }
          })

        } else {
          my.alert({
            title: '获取用户信息失败'
          });
        }
      })

    },
    goodsListOnScroll(e) {
      var _this = this;
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }

      this.timerId = setTimeout(function() {
        for (var i in _this.data.indexMap) {
          if (_this.data.indexMap[i].top < (e.detail.scrollTop + 130) && _this.data.indexMap[i].bottom > (e.detail.scrollTop + 130)) {
            _this.setData({
              avtiveType: i
            })
            break;
          }
        }
      }, 200);
    },
    typeHandleClick(e) {
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      this.setData({
        avtiveType: e.currentTarget.dataset.index,
        scrollTop: this.data.indexMap[e.currentTarget.dataset.index].top - 79
      })
    },
    decGoods(event) {
      console.log(event.currentTarget.dataset)
      var _this = this;
      clickgoods.decGoodsByGoodsid({
        storeid: this.data.options.id,
        goodsid: event.currentTarget.dataset.goodsid,
        success: function(res) {
          _this.setData({
            shopCart: res
          })
        }, fail(res) {
          console.log(res)
        }
      })
    },
    plusGoods(event) {
      var goodsData = this.data.goodsData.goodsObj[event.currentTarget.dataset.goodsid];
      var _this = this;
      if (goodsData.suitflag === 0 && goodsData.garnish.length === 0) {
        var goodsTmp = {
          goodsid: goodsData.goodsid,
          gtid: goodsData.gtid,
          goodsname: goodsData.goodsname,
          shoppic: goodsData.shoppic,
          pocket: 1,
          goodsno: 1,
          mprice: goodsData.price,
          discount: 100,
          youhuiprice: 0,
          suitflag: 0,
          is_give: 0,
          is_package: 0,
          is_default_package: 0,
          dabaohe: goodsData.dabaohe,
          remarks: "",
          yprice: goodsData.price,
          sprice: goodsData.price,
          one_sprice: goodsData.price,
          one_yprice: goodsData.price,
          tmp_oneprice: goodsData.price,
          tmpprice: goodsData.price
        };

        clickgoods.addGoodsToShoppingCart({
          storeid: this.data.options.id,
          goodsdata: goodsTmp,
          success: function(res) {
            _this.setData({
              shopCart: res
            })
          }
        });
      } else {
        this.setData({
          showSelect: true,
          showSelectGoodsData: goodsData
        })
      }
    },
    AddToShoppingCart(res) {
      console.log('onAddToShoppingCart', res);
      this.setData({
        showSelect: false,
        shopCart: res
      })
    },
    showGoodsInfo(event) {
      this.setData({
        showGoodsInfo: true,
        showGoodsInfoData: this.data.goodsData.goodsObj[event.currentTarget.dataset.goodsid]
      })

    },
    showShoppingCartPopup() {
      this.setData({
        showShoppingCart: true
      })
    },
    changeShoppingCart(cartData) {
      var _this = this;
      _this.setData({
        shopCart: cartData
      })
      if (cartData.goodsnumber < 1) {
        if (_this.data.showShoppingCart) {
          _this.onShoppingCartlose();
        }
      }
    },
    clearShoppingCart() {
      var _this = this;
      clickgoods.clearShoppingCart({
        storeid: _this.data.options.id,
        success: function(resdata) {
          var userinfo = _this.data.userInfo;
          userinfo.name = userinfo.nickname;
          clickgoods.setUserInfo({
            storeid: _this.data.options.id,
            user: userinfo,
            success: function(res) {
              _this.setData({
                shopCart: res
              })
              if (_this.data.showShoppingCart) {
                _this.onShoppingCartlose();
              }
            }
          })

        }
      })
    },
    onSelectPopupClose() {
      this.setData({
        showSelect: false
      })
    },
    onGoodsInfoPopupClose() {
      this.setData({
        showGoodsInfo: false
      })
    },
    onShoppingCartlose() {
      this.setData({
        showShoppingCart: false
      })
    }
  });
