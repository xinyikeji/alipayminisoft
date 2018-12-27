Component({
  mixins: [],
  data: {
    showSuitSelect: false,

    suitData: []
  },
  props: {
    goodsInfo: {},
    windowWidth: 0,
    windowHeight: 0,
    scrollHeight: 0,
    suitData: [],
    onSelected: (data) => {

    }
  },
  didMount() {
    var _this = this;
    my.createSelectorQuery().select('.datainfoview').boundingClientRect().exec(function(ret) {
      var height = (ret[0].height > (_this.props.windowHeight - 300)) ? (_this.props.windowHeight - 300) : ret[0].height;
      _this.setData({
        scrollHeight: height
      })

    })
  },
  didUpdate(event) {
    var _this = this;
    my.createSelectorQuery().select('.datainfoview').boundingClientRect().exec(function(ret) {
      var height = (ret[0].height > (_this.props.windowHeight - 300)) ? (_this.props.windowHeight - 300) : ret[0].height;
      _this.setData({
        scrollHeight: height
      })
    })
  },
  didUnmount() {
    console.log('33333333333333')
  },
  methods: {
    showSuitSelectPopup(event) {

      this.setData({
        showSuitSelect: true,
        suitData: this.props.goodsInfo.child[event.currentTarget.dataset.index]
      })
    }
  },
});
