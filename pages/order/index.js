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
    onUnload() {
        api.uploadBehavior({ data: { openid: this.data.userInfo.openid, mode: "uninstpage", query: this.data.options, path: '/pages/order/index' } });
    },
    onLoad(options) {
        var years = [];
        for (var i = 2019; i <= this.data.year; i++) {
            years.push({
                title: i
            })
        }
        var activeYear = years.length - 1;
        this.setData({
            years: years,
            activeYear: activeYear,
            options: options
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
        app.getUserInfo(function (userinfo) {
            if (userinfo) {
                api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/order/index' } });
                _this.setData({
                    userInfo: userinfo
                })
                //开始拉取用户基本数据
                _this.getOrderList();
            } else {
                api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/order/index' } });
            }
        })
        this.setData({
            onshow: true
        })
    },
    onShow() {
        if (this.data.onshow) {
            this.setData({
                year: this.data.years[(this.data.years.length - 1)].title,
                activeYear: (this.data.years.length - 1),
                activeOrder: 0,
                current: 0
            })
            var _this = this;
            _this.getOrderList()
        }
    },
    handleYearClick(event) {
          // console.log('activeYear',this.data.activeYear)
          // console.log('index',event.index)
          // console.log('loading',this.data.loading)
          // console.log(this.data.activeYear == event.index)
        if (this.data.activeYear == event.index || this.data.loading) {
            return false;
        }
        this.setData({
            loading: true,
            orderList: [],
            year: this.data.years[event.index].title,
            activeYear: event.index,
            activeOrder: 0,
            current: 0
        })
        var _this = this;
         _this.getOrderList()

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
            success: function (res) {
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
                        success: function (res) {
                            var orderDetail = _this.data.orderDetail;
                            orderDetail[order.orderno] = res;
                            // console.log(res);
                            _this.setData({
                                orderDetail: orderDetail
                            })
                        }
                    })
                }

            },
            fail(err) {
                my.alert({
                    title: '错误',
                    content: err.message,
                    buttonText: '我知道了',
                    success: () => {
                       
                    },
                });
            }
        })
    },
    gotoShopping() {
        my.navigateTo({
            url: "/pages/shopping/shopping"
        });
    },
});