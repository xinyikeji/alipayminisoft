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
    onChang: function(res) { },
    onClearShoppingCart: function() { }
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
    reloadScHeight() {
      var _this = this;
      my.createSelectorQuery().select('.shopping-cart-goodslist-view').boundingClientRect().exec(function(ret) {
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
    decGoods(event) {
      var _this = this;
      clickgoods.decGoodsToShoppingCart({
        storeid: _this.props.storeid,
        key: event.currentTarget.dataset.key,
        success: function(res) {
          _this.setData({
            shopCart: res
          })
          _this.props.onChang(res);
          _this.reloadScHeight();
        }
      })
    },
    incGoods(event) {
      var _this = this;
      clickgoods.incGoodsToShoppingCart({
        storeid: _this.props.storeid,
        key: event.currentTarget.dataset.key,
        success: function(res) {
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
