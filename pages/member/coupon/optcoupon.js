const app = getApp();
import api from '/libs/api'
import clickgoods from '/libs/clickgoods'
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
        this.setData({
            ccbid:options.ccbid
        });
        this.getUserOrderCoupons();
    },
    //获取用户可用优惠券
    getUserOrderCoupons() {
        let _this = this;

        app.getUserInfo(function (userinfo) {
            if (userinfo) {
                 var orderData = clickgoods.getShoppingCart(aOptions.storeid);
             
                api.fnGetUserOrderCoupons({
                    storeid: aOptions.storeid,
                    xyopenid: userinfo.openid,
                    price: aOptions.price,
                    goodsdata: orderData.goods,
                    pagesize: 600,
                    success(rest) {
                        console.log(rest);
                        _this.setData({
                            couponsData: rest
                        })
                    }
                });
            }
        })





    },
    /**
		 * 选择优惠券
		 */
    selectCoupons(e) {
        var ccbid = e.currentTarget.dataset.ccbid;
        var index = e.currentTarget.dataset.index;
        var pages = getCurrentPages();



        var prevPages = pages[pages.length - 2];
        console.log(e, pages, prevPages);

        if (ccbid == '00') {
            prevPages.setData({
                couponData: {
                    balance: 0,
                    ccbid: '00',
                    code: 0,
                    price: 0,
                    showname: '不使用优惠券'
                }
            })
         
        } else {
            prevPages.setData({
                couponData: this.data.couponsData[index]
            })
            // prevPages.$vm.discount = []; //会员折扣
            // prevPages.$vm.integral = []; //积分抵现
            // prevPages.$vm.optCoupons = this.couponsData[index];
            // prevPages.$vm.balanceprice = 0;
        }
        prevPages.relaodData();
        // prevPages.$vm.computeOrder();
        my.navigateBack({ delta: 1 }); //返回上一页
    },

});
