import clickgoods from '/libs/clickgoods'

Component({
  mixins: [],
  data: {
    showSuitSelect: false,
    selectRemarksItem: {},
    suitData: []
  },
  props: {
    storeid: null,
    goodsInfo: {},
    windowWidth: 0,
    windowHeight: 0,
    scrollHeight: 0,
    suitData: [],
    onAddToShoppingCart: (data) => {

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
    // 根据商品数据转化出默认加入购物车的数据
    var goodsData = this.props.goodsInfo;
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
      suitflag: goodsData.suitflag,
      is_give: 0,
      is_package: 0,
      remarks: "",
      sprice: 0,
      yprice: 0,
      one_sprice:0,
      one_yprice:0
    };
    if (goodsData.suitflag === 1) {
      if (goodsData.suitflagtype == 3) { //规格套餐
        for (var i in goodsData.child) {
          if (goodsData.child[i].isdefault == 1) {
            goodsTmp.tmpprice = goodsData.child[i].price;
            goodsTmp.tmp_oneprice = goodsData.child[i].price;
            goodsTmp.child = [{
              goodsid: goodsData.child[i].goodsid,
              goodsno: goodsData.child[i].goodsno,
              goodsname: goodsData.child[i].goodsname,
              one_goodsno: goodsData.child[i].goodsno,
              one_price: goodsData.child[i].price,
              youhuiprice: 0,
              mprice: goodsData.child[i].price,
              sprice: goodsData.child[i].price,
              addprice: goodsData.child[i].price,
              remarks: '',
              yprice: goodsData.child[i].price
            }];
            break;
          }
        }
      }
    }
    this.setData({
      goodsTmp: goodsTmp
    })
    console.log(goodsTmp)
  },
  methods: {
    setSpecifications(event) {
      var goodsData = this.props.goodsInfo;
      var index = event.currentTarget.dataset.index;

      for (var i in goodsData.child) {
        goodsData.child[i].isdefault = 0;
      }

      var goodsTmp = this.data.goodsTmp;
      goodsTmp.child = [{
        goodsid: goodsData.child[index].goodsid,
        goodsno: goodsData.child[index].goodsno,
        one_goodsno: goodsData.child[index].goodsno,
        one_price: goodsData.child[index].price,
        goodsname: goodsData.child[index].goodsname,
        youhuiprice: 0,
        mprice: goodsData.child[index].price,
        sprice: goodsData.child[index].price,
        addprice: goodsData.child[index].price,
        remarks: '',
        yprice: goodsData.child[index].price
      }];
      goodsTmp.tmp_oneprice = goodsData.child[index].price;
      goodsData.child[index].isdefault = 1;
      goodsTmp.tmpprice = goodsData.child[index].price;
      goodsTmp.tmp_oneprice = goodsData.child[index].price;
      console.log(goodsTmp)
      this.setData({
        goodsInfo: goodsData,
        goodsTmp: goodsTmp
      })
    },
    setRemarks(event) {
      var grid = event.currentTarget.dataset.grid;
      var selectRemarksItem = this.data.selectRemarksItem;
      var goodsTmp = this.data.goodsTmp;
      if (selectRemarksItem[grid]) {
        delete selectRemarksItem[grid];
      } else {
        selectRemarksItem[grid] = true;
      }
      var remarks = [];
      for (var i in selectRemarksItem) {
        remarks.push(i);
      }
      goodsTmp.remarks = remarks.join(',')
      this.setData({
        selectRemarksItem: selectRemarksItem,
        goodsTmp: goodsTmp
      })
    },
    plusGoods() {
      var _this = this;
      clickgoods.addGoodsToShoppingCart({
        storeid: this.props.storeid,
        goodsdata: this.data.goodsTmp,
        success: function(res) {
          _this.props.onAddToShoppingCart(res);
        }
      });
    },
    showSuitSelectPopup(event) {
      this.setData({
        showSuitSelect: true,
        suitData: this.props.goodsInfo.child[event.currentTarget.dataset.index]
      })
    }
  },
});
