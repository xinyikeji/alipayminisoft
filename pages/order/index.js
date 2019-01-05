const app = getApp();
import php from '/libs/php'
import api from '/libs/api'
Page({
  data: {
    loading: true,
    onshow: false,
    userInfo: {},
    years: [],
    activeYear: 0,
    current: 0,
    year: php.date('Y'),
    windowHeight: 0,
    activeOrder: 0,
    orderList: [],
    orderDetail: {}
  },
  onLoad() {
    var years = [];
    for (var i = 2014; i <= this.data.year; i++) {
      years.push({
        title: i
      })
    }
    var activeYear = years.length - 1;
    this.setData({
      years: years,
      activeYear: activeYear
    })
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
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
        _this.getOrderList();
      }
    })
    this.setData({
      onshow: true
    })
  },
  onShow() {
    if (this.data.onshow) {
      this.setData({
        orderList: [],
        year: this.data.years[(this.data.years.length - 1)].title,
        activeYear: (this.data.years.length - 1),
        activeOrder: 0,
        current: 0
      })
      var _this = this;
      setTimeout(function() {
        _this.getOrderList()
      }, 100)
    }
  },
  handleYearClick(event) {
    if (this.data.activeYear == event.index) {
      return false;
    }
    console.log('22222')
    this.setData({
      loading: true,
      orderList: [],
      year: this.data.years[event.index].title,
      activeYear: event.index,
      activeOrder: 0,
      current: 0
    })
    var _this = this;
    setTimeout(function() {
      _this.getOrderList()
    }, 100)

  },
  swiperChange(event) {
    // console.log(event)
    this.setData({
      activeOrder: event.detail.current
    })
    var order = this.data.orderList[event.detail.current]
    var _this = this;
    api.getOrderDetail({
      storeid: order.storeid,
      orderno: order.orderno,
      success: function(res) {
        var orderDetail = _this.data.orderDetail;
        orderDetail[order.orderno] = res;
        _this.setData({
          orderDetail: orderDetail
        })
      }
    })
  },
  getOrderList() {
    var _this = this;
    _this.setData({
      loading: true
    })
    api.getOrderList({
      openid: _this.data.userInfo.openid,
      year: _this.data.year,
      success: (res) => {

        _this.setData({
          loading: false,
          orderList: res
        })
        if (_this.data.orderList.length > 0) {
          var order = _this.data.orderList[0]
          api.getOrderDetail({
            storeid: order.storeid,
            orderno: order.orderno,
            success: function(res) {
              var orderDetail = _this.data.orderDetail;
              orderDetail[order.orderno] = res;
              console.log(res);
              _this.setData({
                orderDetail: orderDetail
              })
            }
          })
        }

      }
    })
  },
  gotoShopping(){
    my.navigateTo({
      url:"/pages/shopping/shopping"
    });
  },
});