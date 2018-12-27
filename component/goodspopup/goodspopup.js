Component({
  mixins: [],
  data: {
    showSuitSelect: false,
    windowWidth: 0,
    windowHeight: 0,
    suitData:[]
  },
  props: {
    goodsInfo: {},
    suitData: [],
    onSelected: (data) => {

    }
  },
  didMount() {

    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  didUpdate() {
    console.log('3333333333333333333')
  },
  didUnmount() {
    console.log('2222222222222222')
   },
  methods: {
    showSuitSelectPopup(event) {
      // console.log(event.currentTarget, this.props.goodsInfo.child[event.currentTarget.dataset.index])
      this.setData({
        showSuitSelect: true,
        suitData: this.props.goodsInfo.child[event.currentTarget.dataset.index]
      })
    }
  },
});
