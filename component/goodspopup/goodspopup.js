import clickgoods from '/libs/clickgoods'

Component({
  mixins: [],
  data: {
    selectRemarksItem: {},
    selectGarnish: {},
    selectSuitData: {},
    selectGroupSuitNumber: {},
    selectGroupSuitData: {},
    showSuitSelect: false,
    suitIndex: -1,
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
    _this.setData({
      selectRemarksItem: {},
      selectGarnish: {},
      selectSuitData: {},
      selectGroupSuitNumber: {},
      selectGroupSuitData: {},
      showSuitSelect: false,
      suitIndex: -1,
      suitData: []
    })
    // 根据商品数据转化出默认加入购物车的数据
    var goodsData = this.props.goodsInfo;
    var goodsTmp = {
      goodsid: goodsData.goodsid,
      gtid: goodsData.gtid,
      goodsname: goodsData.goodsname,
      shoppic: goodsData.shoppic,
      dabaohe: goodsData.dabaohe,
      pocket: 1,
      goodsno: 1,
      discount: 100,
      suitflag: goodsData.suitflag,
      is_give: 0,
      is_package: 0,
      is_default_package: 0,
      remarks: "",
      mprice: goodsData.price,
      youhuiprice: 0,
      sprice: goodsData.price,
      yprice: goodsData.price,
      one_sprice: goodsData.price,
      one_yprice: goodsData.price,
      tmpprice: goodsData.price,
      tmp_oneprice: goodsData.price,
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
              remarks: '',
              youhuiprice: 0,
              one_price: goodsData.child[i].price,
              mprice: goodsData.child[i].price,
              sprice: goodsData.child[i].price,
              addprice: goodsData.child[i].price,
              yprice: goodsData.child[i].price
            }];
            break;
          }
        }
      } else if (goodsData.suitflagtype == 2) { // 组合套餐
        console.log(goodsData)

        goodsTmp.tmpprice = goodsData.price;
        goodsTmp.tmp_oneprice = goodsData.price;
        goodsTmp.child = [];
        if (goodsData.pricetype == 2) {
          goodsTmp.tmpprice = 0;
          goodsTmp.tmp_oneprice = 0;
          goodsTmp.mprice = 0
          goodsTmp.youhuiprice = 0
          goodsTmp.sprice = 0
          goodsTmp.yprice = 0
          goodsTmp.one_sprice = 0
          goodsTmp.one_yprice = 0
        }

      } else if (goodsData.suitflagtype == 1) { // 普通套餐
        console.log(goodsData)
        var selectSuitData = {};
        goodsTmp.tmpprice = goodsData.price;
        goodsTmp.tmp_oneprice = goodsData.price;
        goodsTmp.child = [];
        for (var i in goodsData.child) {
          for (var j in goodsData.child[i]) {
            if (goodsData.child[i][j].default == 1) {
              selectSuitData[i] = goodsData.child[i][j].goodsid;
              goodsTmp.tmpprice += goodsData.child[i][j].addprice;
              goodsTmp.tmp_oneprice += goodsData.child[i][j].addprice;
              goodsTmp.child.push({
                goodsid: goodsData.child[i][j].goodsid,
                goodsno: goodsData.child[i][j].goodsno,
                goodsname: goodsData.child[i][j].goodsname,
                shoppic: goodsData.child[i][j].shoppic,
                one_goodsno: goodsData.child[i][j].goodsno,
                one_price: goodsData.child[i][j].addprice,
                youhuiprice: 0,
                mprice: goodsData.child[i][j].addprice,
                sprice: goodsData.child[i][j].addprice,
                addprice: goodsData.child[i][j].addprice,
                remarks: '',
                yprice: goodsData.child[i][j].addprice
              });
              continue;
            }
          }
        }
        this.setData({
          selectSuitData: selectSuitData
        })
      }
    }
    console.log('goodsTmp', goodsTmp)
    this.setData({
      goodsTmp: goodsTmp
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
  methods: {
    setPackage() {
      var goodsTmp = this.data.goodsTmp;
      goodsTmp.is_package = goodsTmp.is_default_package = goodsTmp.is_default_package ? 0 : 1;
      this.setData({
        goodsTmp: goodsTmp
      })
    },
    //添加一个配菜
    incGarnish(event) {
      var goodsData = this.props.goodsInfo;
      var goodsid = event.currentTarget.dataset.goodsid;
      var index = event.currentTarget.dataset.index;
      var goodsTmp = this.data.goodsTmp;
      var selectGarnish = this.data.selectGarnish;

      //加入菜单
      if (!goodsTmp.garnish) {
        goodsTmp.garnish = [];
      }
      if (!selectGarnish[goodsid]) {
        selectGarnish[goodsid] = 1;
        //如果不存在就直接追加
        goodsTmp.garnish.push({
          goodsid: goodsData.garnish[index].goodsid,
          goodsno: 1,
          one_goodsno: 1,
          goodsname: goodsData.garnish[index].goodsname,
          one_price: goodsData.garnish[index].price,
          youhuiprice: 0,
          remarks: '',
          is_package: 0,
          is_give: 0,
          mprice: goodsData.garnish[index].price,
          sprice: goodsData.garnish[index].price,
          yprice: goodsData.garnish[index].price
        })
        goodsTmp.tmpprice += goodsData.garnish[index].price;
        goodsTmp.tmp_oneprice += goodsData.garnish[index].price;

      } else {
        selectGarnish[goodsid]++;
        //如果存在就找到并且修改
        for (var i in goodsTmp.garnish) {
          if (goodsid == goodsTmp.garnish[i].goodsid) {
            goodsTmp.tmpprice += goodsTmp.garnish[i].one_price;
            goodsTmp.garnish[i].goodsno++;
            goodsTmp.garnish[i].one_goodsno++;
            goodsTmp.garnish[i].sprice = goodsTmp.garnish[i].one_price * goodsTmp.garnish[i].goodsno;
            goodsTmp.garnish[i].yprice = goodsTmp.garnish[i].one_price * goodsTmp.garnish[i].goodsno;
            goodsTmp.tmp_oneprice += goodsTmp.garnish[i].one_price;
          }
        }
      }
      this.setData({
        goodsTmp,
        selectGarnish
      })
      console.log('incGarnish', goodsTmp);
    },
    //配菜减1
    decGarnish(event) {
      var goodsid = event.currentTarget.dataset.goodsid;
      var index = event.currentTarget.dataset.index;
      var goodsTmp = this.data.goodsTmp;
      var selectGarnish = this.data.selectGarnish;
      //加入菜单
      if (!goodsTmp.garnish) {
        goodsTmp.garnish = [];
      }
      if (selectGarnish[goodsid]) {
        selectGarnish[goodsid]--;
        //如果存在就找到并且修改
        for (var i in goodsTmp.garnish) {
          if (goodsid == goodsTmp.garnish[i].goodsid) {
            goodsTmp.tmpprice -= goodsTmp.garnish[i].one_price;
            goodsTmp.tmp_oneprice -= goodsTmp.garnish[i].one_price;
            if (selectGarnish[goodsid] === 0) {
              delete selectGarnish[goodsid];
              goodsTmp.garnish.splice(i, 1);
            } else {
              goodsTmp.garnish[i].goodsno--;
              goodsTmp.garnish[i].sprice = goodsTmp.garnish[i].one_price * goodsTmp.garnish[i].goodsno;
              goodsTmp.garnish[i].yprice = goodsTmp.garnish[i].one_price * goodsTmp.garnish[i].goodsno;
            }
          }
        }
        this.setData({
          goodsTmp,
          selectGarnish
        })
        console.log('decGarnish', goodsTmp);
      }
    },
    //修改规格
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
    //修改备注
    setRemarks(event) {
      var grid = event.currentTarget.dataset.grid;
      var title = event.currentTarget.dataset.title;
      var selectRemarksItem = this.data.selectRemarksItem;
      var goodsTmp = this.data.goodsTmp;
      if (selectRemarksItem[grid]) {
        delete selectRemarksItem[grid];
      } else {
        selectRemarksItem[grid] = title;
      }
      var remarks = [], remarksText = [];
      for (var i in selectRemarksItem) {
        remarks.push(i);
        remarksText.push(selectRemarksItem[i])
      }
      goodsTmp.remarks = remarks.join(',')
      goodsTmp.remarksText = remarksText.join(',');
      this.setData({
        selectRemarksItem: selectRemarksItem,
        goodsTmp: goodsTmp
      })
    },
    plusGoods() {
      var _this = this;
      //组合套餐需要在这里做检测
      var goodsData = this.props.goodsInfo;
      var selectGroupSuitNumber = this.data.selectGroupSuitNumber;
      console.log(goodsData);
      if (goodsData.suitflag === 1 && goodsData.suitflagtype == 2) {
        //检测必选商品
        for (var i in goodsData.info) {
          if (goodsData.info[i].isselect === 0) {
            if (selectGroupSuitNumber[i] && selectGroupSuitNumber[i] > 0 && selectGroupSuitNumber[i] != goodsData.info[i].selectnum) {
              my.showToast({
                type: 'fail',
                content: goodsData.info[i].gziname + '必须选择' + goodsData.info[i].selectnum + '件或不选',
                duration: 1000,
              });

              return false;
            }
          } else if (goodsData.info[i].isselect === 1) {
            if (selectGroupSuitNumber[i]) {
              if (selectGroupSuitNumber[i] != goodsData.info[i].selectnum) {
                my.showToast({
                  type: 'fail',
                  content: goodsData.info[i].gziname + '必须选择' + goodsData.info[i].selectnum + '件',
                  duration: 1000,
                });
                return false;
              }
            } else {
              my.showToast({
                type: 'fail',
                content: goodsData.info[i].gziname + '尚未选择',
                duration: 1000,
              });
              return false;
            }
          }
        }
      }
      //加入购物车
      clickgoods.addGoodsToShoppingCart({
        storeid: this.props.storeid,
        goodsdata: this.data.goodsTmp,
        success: function(res) {
          _this.props.onAddToShoppingCart(res);
        }
      });
    },
    showSuitSelectPopup(event) {
      if (this.data.suitIndex === event.currentTarget.dataset.index) {
        this.setData({
          showSuitSelect: false,
          suitIndex: -1,
          suitData: []
        })
      } else {
        var goodsData = this.props.goodsInfo;
        if (goodsData.child[event.currentTarget.dataset.index].length == 1) {
          my.showToast({
            type: 'fail',
            content: '没有可换项',
            duration: 1000,
          });
          return;
        }
        this.setData({
          showSuitSelect: true,
          suitIndex: event.currentTarget.dataset.index,
          suitData: this.props.goodsInfo.child[event.currentTarget.dataset.index]
        })
      }
    },
    clickGroupSuit(event) {
      var goodsData = this.props.goodsInfo;
      var index = event.currentTarget.dataset.index;
      var index2 = event.currentTarget.dataset.indexchild;

      var goodsTmp = this.data.goodsTmp;
      var selectGroupSuitNumber = this.data.selectGroupSuitNumber;
      var selectGroupSuitData = this.data.selectGroupSuitData;
      if (!selectGroupSuitData[index]) {
        selectGroupSuitData[index] = {};
      }
      if (!selectGroupSuitNumber[index]) {
        selectGroupSuitNumber[index] = 0
      }
      //如果已经选择则取消选择
      if (selectGroupSuitData[index][index2]) {
        var goodsGroup = goodsData.info[index];
        var goodsSuitTmp = goodsGroup.list[index2];

        delete selectGroupSuitData[index][index2];
        selectGroupSuitNumber[index]--;
        for (var i in goodsTmp.child) {
          if (goodsTmp.child[i].group_index == index && goodsTmp.child[i].goodsid == goodsSuitTmp.goodsid) {
            goodsTmp.tmpprice -= goodsTmp.child[i].addprice;
            goodsTmp.tmp_oneprice -= goodsTmp.child[i].addprice;
            goodsTmp.child.splice(i, 1);
          }
        }
      } else {

        var goodsGroup = goodsData.info[index];
        var goodsSuitTmp = goodsGroup.list[index2];
        if (goodsGroup.isselect != 2) {
          if (goodsGroup.selectnum == selectGroupSuitNumber[index]) {
            my.showToast({
              type: 'fail',
              content: '只能选择 ' + goodsGroup.selectnum + ' 项',
              duration: 1000,
            });
            return false;
          }
        }

        selectGroupSuitNumber[index]++;
        selectGroupSuitData[index][index2] = true;

        if (goodsData.pricetype == 1) {
          //选择商品

          goodsTmp.child.push({
            goodsid: goodsSuitTmp.goodsid,
            goodsno: 1,
            group_index: index,
            goodsname: goodsSuitTmp.goodsname,
            shoppic: goodsSuitTmp.shoppic,
            one_goodsno: 1,
            one_price: 0,
            youhuiprice: 0,
            mprice: 0,
            sprice: 0,
            addprice: 0,
            remarks: '',
            yprice: 0
          })
        } else {
          goodsTmp.tmpprice += goodsSuitTmp.addprice;
          goodsTmp.tmp_oneprice += goodsSuitTmp.addprice;

          goodsTmp.child.push({
            goodsid: goodsSuitTmp.goodsid,
            goodsno: 1,
            group_index: index,
            goodsname: goodsSuitTmp.goodsname,
            shoppic: goodsSuitTmp.shoppic,
            one_goodsno: 1,
            one_price: goodsSuitTmp.addprice,
            youhuiprice: 0,
            mprice: goodsSuitTmp.addprice,
            sprice: goodsSuitTmp.addprice,
            addprice: goodsSuitTmp.addprice,
            remarks: '',
            yprice: goodsSuitTmp.addprice
          })
        }
      }
      this.setData({
        selectGroupSuitNumber: selectGroupSuitNumber,
        selectGroupSuitData: selectGroupSuitData,
        goodsTmp: goodsTmp
      })
    },
    replaceSuit(event) {
      var goodsData = this.props.goodsInfo;
      var index = event.currentTarget.dataset.index;
      var goodsTmp = this.data.goodsTmp;
      var selectSuitData = this.data.selectSuitData;

      var goodsSuitTmp = goodsData.child[this.data.suitIndex][index];

      if (goodsSuitTmp.addprice > 0) {
        my.showToast({
          type: 'none',
          content: '产生加价￥' + (goodsSuitTmp.addprice / 100).toFixed(2),
          duration: 1000,
        });
      }
      //设置当前的选中项
      selectSuitData[this.data.suitIndex] = goodsSuitTmp.goodsid;
      //更新要加入购物车的数据
      goodsTmp.tmpprice -= goodsTmp.child[this.data.suitIndex].addprice;
      goodsTmp.tmp_oneprice -= goodsTmp.child[this.data.suitIndex].addprice;

      goodsTmp.tmpprice += goodsSuitTmp.addprice;
      goodsTmp.tmp_oneprice += goodsSuitTmp.addprice;

      goodsTmp.child[this.data.suitIndex] = {
        goodsid: goodsSuitTmp.goodsid,
        goodsno: goodsSuitTmp.goodsno,
        goodsname: goodsSuitTmp.goodsname,
        shoppic: goodsSuitTmp.shoppic,
        one_goodsno: goodsSuitTmp.goodsno,
        one_price: goodsSuitTmp.addprice,
        youhuiprice: 0,
        mprice: goodsSuitTmp.addprice,
        sprice: goodsSuitTmp.addprice,
        addprice: goodsSuitTmp.addprice,
        remarks: '',
        yprice: goodsSuitTmp.addprice
      };

      this.setData({
        selectSuitData: selectSuitData,
        goodsTmp: goodsTmp
      })
    }
  },
});
