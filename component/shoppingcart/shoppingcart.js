import clickgoods from '/libs/clickgoods'

Component({
  mixins: [],
  data: {
    shopCart: {}
  },
  props: {
    storeid: null,
    billPath: '',
    windowWidth: 0,
    windowHeight: 0,
    scrollHeight: 400,
    onChang: () => { }
  },
  didMount() {
    var cartData = clickgoods.getShoppingCart(this.props.storeid);
    this.setData({
      shopCart: cartData
    })
    console.log(cartData)
  },
  methods: {

  },
});
