import api from '/libs/api'
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
    value: 9,
    activeTab: 0,
    items5: [
      {
        title: "分类",
        brief: '描述信息',
        arrow: true,
        sticky: true,
      },
      {
        thumb: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
        title: '标题文字不标题文字不标题文字不',
        price: "10.22",
        brief: '描述信息',
        align: 'middle',
      },
      {
        thumb: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
        title: '标题字换行',
        price: "10.22",
        brief: '测试',
        align: 'top',
      },
      {
        title: '标题文字不',
        brief: '描述信息',
        price: "10.22",
        align: 'middle',
      },
      {
        title: '标题字换行',
        brief: '测试',
        price: "10.22",
        align: 'top',
      },
      {
        title: '标题文字不',
        brief: '描述信息',
        price: "10.22",
        align: 'middle',
      },
      {
        title: '标题字换行',
        brief: '测试',
        price: "10.22",
        align: 'top',
      },
    ],
  },
  handleChange(index) {
    this.setData({
      activeTab: index,
    });
  },
  onChange(index) {
    console.log('onChange', index);
    this.setData({
      activeTab: index,
    });
  },
  onLoad(options) {
    console.log(options)
    this.setData({
      options: options
    })
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    var _this = this;
    app.getUserInfo(function(userinfo) {
      if (userinfo) {

        _this.setData({
          userInfo: userinfo
        })
        //开始拉取用户基本数据
        _this.getStoreInfo();
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
            console.log(res)
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
      _this.setData({
        goodsData: goodsdata
      })
      console.log(goodsdata)
    })
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
