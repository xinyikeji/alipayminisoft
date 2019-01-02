const app = getApp();
import php from '/libs/php'
import http from '/libs/http'
Page({
  data: {
    loading: true,
    hasnext: true,
    userInfo: {},
    years: [],
    activeYear: 0,
    page: 1,
    pagesize: 30,
    year: php.date('Y'),
    windowHeight: 44,
    orderlist: []
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
        _this.getOrderList();
      }
    })
  },
  handleYearClick(event) {
    if (this.data.activeYear == event.index) {
      return false;
    }
    this.setData({
      page: 0,
      hasnext: true,
      orderlist: [],
      year: this.data.years[event.index].title,
      activeYear: event.index
    })
    this.getOrderList()
  },
  getOrderList() {
    var _this = this;
    http.post({
      openid: this.data.userInfo.openid,
      page: this.data.page,
      page_size: this.data.pagesize,
      year: this.data.year,
      method: "member.OpenUser.getOrderlist",
    }, function(status, rest) {
      console.log(rest)
      my.stopPullDownRefresh();
      if (status && rest.data.code === 1) {
        if (rest.data.data.rowdata) {
          var orderlist = _this.data.orderlist;
          orderlist = orderlist.concat(rest.data.data.rowdata)

          _this.setData({
            loading: false,
            orderlist: orderlist,
            hasnext: (rest.data.data.rowdata.length == 30)
          })
        } else {
          _this.setData({
            loading: false,
            hasnext: false
          })
        }
      }
    })
  },
  onScollPullDownRefresh() {
    if(!this.data.hasnext){
      return ;
    }
    this.setData({
      page: (this.data.page + 1),
    })
    this.getOrderList()
  }
});