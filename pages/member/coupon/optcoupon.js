const app = getApp();
import api from '/libs/api'
let aOptions = {};
Page({
    data: {
        couponsData: [], //券码数据
        couponsCount: 0,//统计
        ccbid: 0, //已选择的优惠券
    },
    onLoad(options) {
        let _this = this;
        aOptions = options;
        this.getUserOrderCoupons();
    },
    //获取用户可用优惠券
    getUserOrderCoupons() {
        let _this = this;
        app.getUserInfo(function (userinfo) {
            if (userinfo) {
                api.fnGetUserOrderCoupons({
                    storeid: aOptions.storeid,
                    xyopenid: userinfo.openid,
                    price:aOptions.price,
                    goodsdata:[],
                    pagesize: 60,
                    success(rest) {
                        console.log(rest);
                        _this.setData({
                            couponsData: rest
                        })
                    }
                });
            }
        })





    }
});
