import clickgoods from '/libs/clickgoods'

Component({
  mixins: [],
  data: {
    scrollHeight: 0,
    shopCart: {}
  },
  props: {
    storeid: null,
    billPath: '',
    windowWidth: 0,
    windowHeight: 0,
    goodsTypeData: [],
    onChang: function (res) { },
    onClearShoppingCart: function () { },
  },
  didMount() {
    var cartData = clickgoods.getShoppingCart(this.props.storeid);
    // console.log(cartData)
    this.setData({
      shopCart: cartData
    })
    this.reloadScHeight();
  },
  methods: {
    // 在购物车点击去结算
    cartGoShopping() {
      // 判断是否登录
      const UserCache = my.getStorageSync({
        key: 'userinfo', // 缓存数据的key
      });
      console.log("购物车结算时的userinfo", UserCache)
      if (!UserCache.data === null) {
        my.alert({
          title: '提示',
          content: '你还没有登录，请登录~',
          success() {
            my.navigateTo({
              url: '/pages/login/login'
            })
          }
        })
        return false;
      }


      let storeid = this.data.shopCart.store.storeid;
      // console.log(storeid)
      let goodsArr = this.data.shopCart.goods;
      let goodsIdArr = [];
      goodsArr.forEach((item) => {
        goodsIdArr.push(item.gtid);
      });
      if (this.props.goodsTypeData['999999999'] && goodsIdArr.indexOf(999999999) == -1) {
        my.showToast({
          type: "fail",
          content: "请选择必点商品"
        });
      } else if (this.data.shopCart.goodsnumber && this.data.shopCart.goodsnumber > 0) {
        my.navigateTo({
          url: 'bill/bill?id=' + storeid
        });
      } else {
        my.showToast({
          type: "fail",
          content: "还没有点餐"
        });
      }
    },
    reloadScHeight() {
      var _this = this;
      my.createSelectorQuery().select('.shopping-cart-goodslist-view').boundingClientRect().exec(function (ret) {
        if (ret[0]) {
          var height = ret[0].height > (_this.props.windowHeight - 200) ? (_this.props.windowHeight - 200) : ret[0].height;
          _this.setData({
            scrollHeight: height
          })
        }

      })
    },
    clearShoppingCart() {
      this.props.onClearShoppingCart();
    },
    // 在购物车组件内减少商品
    decGoods(event) {
      console.log("在购物车里删除", event)
      var _this = this;
      clickgoods.decGoodsToShoppingCart({
        storeid: _this.props.storeid,
        key: event.currentTarget.dataset.key,
        success: function (res) {
          _this.setData({
            shopCart: res
          })
          _this.props.onChang(res);
          _this.reloadScHeight();
        }
      })
    },
    // 在购物车组件内增加商品
    incGoods(event) {
      console.log("在购物车里增加", event)
      var _this = this;
      clickgoods.incGoodsToShoppingCart({
        storeid: _this.props.storeid,
        key: event.currentTarget.dataset.key,
        success: function (res) {
          _this.setData({
            shopCart: res
          })
          _this.props.onChang(res);
          _this.reloadScHeight();
        }
      })
    }
  },
});
