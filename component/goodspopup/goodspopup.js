Component({
  mixins: [],
  data: {
    showSuitSelect: false,
    
    suitData:[]
  },
  props: {
    goodsInfo: {},
    windowWidth: 0,
    windowHeight: 0,
    suitData: [],
    onSelected: (data) => {

    }
  },
  didMount() {
    console.log('11111111111',event)
    console.log(this.props.goodsInfo)
  },
  didUpdate(event) {

    console.log('22222222222222',event)

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
