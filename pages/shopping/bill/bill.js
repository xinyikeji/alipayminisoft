
import api from '../../../libs/api'
import php from '/libs/php'
import libscommon from '/libs/common'
import clickgoods from '/libs/clickgoods'
const app = getApp();
var giveGoodsDataLog = [];
Page({
    data: {
        shopCart: {},
        userInfo: {},
        userAccount: {},
        memberConfig: {},
        jifenmax: 0,
        jifenmax_default: 0,
        scrollHeight: 0,
        storeInfo: {},
        account_balance: 0,
        account_integral: 0,
        couponData: {},
        windowWidth: 0,
        windowHeight: 0,
        giveGoodsData: [],
        giveGoodsDataIndex: -1,
        giveGoodsDataSelected: {},

    },
    onUnload() {
        api.uploadBehavior({ data: { openid: this.data.userInfo.openid, mode: "uninstpage", query: this.data.options, path: '/pages/shopping/bill/bill' } });
    },
    onLoad(options) {
        var _this = this;
        this.setData({
            options: options
        })
        // console.log(options)
        if (!options.id) {
            api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/shopping/bill/bill' } });
            my.alert({
                title: "错误提示",
                content: "参数错误，请重新进入当前页面重试！",
                buttonText: '返回首页',
                success: () => {
                    my.reLaunch({
                        url: '/pages/index/index'
                    });
                }
            })
            return false;
        };
        my.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            },
        });

        my.showLoading({
            content: "优惠加载中"
        })
        app.getUserInfo(function (userinfo) {
            if (userinfo) {
                api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/shopping/bill/bill' } });
                _this.setData({
                    userInfo: userinfo
                })
                api.getStoreInfo(_this.data.options.id, function (storeinfo) {
                    // console.log('storeinfo', storeinfo)
                    _this.setData({
                        storeInfo: storeinfo
                    })
                    clickgoods.setStoreInfo({
                        storeid: _this.data.options.id,
                        store: storeinfo,
                        success: function (res) {
                        }
                    })

                    //获取赠送的商品
                    api.getUserGiveGoods(userinfo.openid, storeinfo.storeid, function (rest) {
                        if (rest) {
                            // console.log(rest)
                            _this.setData({
                                giveGoodsData: rest.goods_data
                            })
                            api.getUserAccount(userinfo.openid, function (userAccount) {
                                if (userAccount) {
                                    // console.log(userAccount.account_balance)
                                    api.getMemberConfigInfo(storeinfo.storeid, function (memberConfig) {

                                        //计算最多可以用多少积分,并且设置积分的步进长度
                                        var jifenmax = parseInt(userAccount.account_integral / memberConfig.jifennum) * memberConfig.jifennum;
                                        _this.setData({
                                            jifenmax_default: jifenmax,
                                            jifenmax: 0,
                                            memberConfig: memberConfig,
                                            userAccount: userAccount
                                        })
                                        _this.relaodData();
                                    })
                                }
                            })
                        } else {
                            my.hideLoading();
                            my.alert({
                                title: '错误',
                                content: '获取赠送的商品错误',
                                buttonText: '我知道了',
                                success: () => {

                                },
                            });
                        }
                    })


                })
            } else {
                my.hideLoading()
                my.showToast({
                    type: 'fail',
                    content: "获取用户数据失败",
                });
            }
        })
    },
    relaodData() {
        // console.log('function')
        var _this = this;
        clickgoods.clearPaylist({
            storeid: _this.data.options.id,
            success: function (res) {
                clickgoods.addPaylist({
                    storeid: _this.data.options.id,
                    paytype: [{
                        ptid: -1,
                        price: res.sprice,
                        paytype: 1,
                        isonline: 1
                    }],
                    success: function (res) {
                        console.log(res,'clearPaylistclearPaylist');
                        // console.log('function', res)
                        var jifenmax = _this.data.jifenmax_default;
                        if (res.sprice / 100 < 1) {
                            jifenmax = 0;
                        } else {
                            if ((res.sprice / 100 * 20) < jifenmax) {
                                jifenmax = (res.sprice / 100 * 20);
                            }
                        } my.hideLoading();
                        if (_this.data.couponData.ccbid) {
                            if ( _this.data.couponData.offerPrice > 0) {
                                res.sprice = libscommon.fnOperation( res.sprice,_this.data.couponData.offerPrice,'-');
                                // console.log( res.sprice,'=====1=',_this.data.couponData,libscommon.fnOperation( res.sprice,_this.data.couponData.offerPrice,'-'));
                            }
                            _this.setData({
                                shopCart: res,
                            })
                            return false;
                        }
                        api.fnGetUserOrderCoupons({
                            storeid: _this.data.options.id,
                            xyopenid: _this.data.userInfo.openid,
                            price: res.sprice,
                            goodsdata:res.goods,
                            pagesize: 600,
                            success(couponsrest) {

                                console.log(couponsrest);


                                // //开始计算最优券码
                                var goodCoupon, couponList = couponsrest, userAccount = _this.data.userAccount;
                                console.log(_this.data.userAccount, res)
                                // for (var c in userAccount.usercoupon) {
                                //     if (userAccount.usercoupon[c].type == 2 && (userAccount.usercoupon[c].minprice) < res.sprice) {
                                //         couponList.push(userAccount.usercoupon[c]);
                                //     }
                                // }
                                couponList = couponList.sort(function (x, y) {
                                    return y.price - x.price
                                })
                                if (couponList.length > 0 && couponList[0].offerPrice > 0) {
                                   res.sprice = libscommon.fnOperation( res.sprice,couponList[0].offerPrice,'-');
                                }

                                _this.setData({
                                    jifenmax: jifenmax.toFixed(2),
                                    shopCart: res,
                                    couponList: couponList,
                                    couponData: couponList[0] || {}
                                })
                                _this.setScHeight();

                            }
                        });
                        // console.log(_this.data.couponlist)
                    },
                    fail: function (res) { }
                })
            }, fail: function (res) {
                // console.log('function22222', res)

            }
        })
    },
    onReady() {
        this.setScHeight();
    },

    // 步进器余额加减（不含输入）
    callBlanaceBackFn(event) {
        console.log('设置余额', event)
        // console.log('原余额',this.data.account_balance)
        // console.log('？',this.data.userAccount)
        this.setData({
            account_balance: event
        })
    },
    // 步进器积分加减（不含输入）
    callJifenBackFn(event) {
        console.log('设置积分', event)
        // console.log('原积分',this.data.account_integral)
        // if(event === this.data.account_integral+this.data.memverConfig){
        //   // 当赠加使用20积分，则减少使用1余额
        //   console.log("+积分")
        //   this.setData({
        //     account_balance: this.data.account_balance-1
        //   })
        // }else if(event === this.data.account_integral-this.data.memverConfig){
        //   console.log('-积分')
        //   // 当减少使用20积分，则增加使用1余额
        //   this.setData({
        //     account_balance: this.data.account_balance+1
        //   })
        // }else{
        //   // 当无法再增加或减少20积分，则余额不变
        //   console.log('无变动')
        //   return
        // }
        this.setData({
            account_integral: event
        })
    },
    selectCoupon(event) {
        let _this = this;
        if (this.data.couponList.length > 0) {
            console.log(_this.data.options.id),
                console.log(_this.data.shopCart.sprice)
            my.navigateTo({
                url: '/pages/member/coupon/optcoupon?storeid=' + _this.data.options.id + '&ccbid=' + _this.data.couponData.ccbid + '&price=' + _this.data.shopCart.total_price
            })
        }

    },

    setScHeight() {
        var _this = this;
        my.createSelectorQuery().select('#goodslistview').boundingClientRect().exec(function (ret) {
            var height = (ret[0].height > 240) ? 240 : ret[0].height;
            _this.setData({
                scrollHeight: height
            })
        })
    },
    setTangshi() {
        // 设置堂食
        var _this = this;
        clickgoods.setTangshi({
            storeid: this.data.storeInfo.storeid,
            success: function (res) {
                clickgoods.removePaylist({
                    storeid: _this.data.options.id,
                    ptid: -1,
                    success: function () {
                        clickgoods.addPaylist({
                            storeid: _this.data.options.id,
                            paytype: [{
                                ptid: -1,
                                price: res.sprice,
                                paytype: 1,
                                isonline: 1,
                            }],
                            success: function (resdata) {
                                _this.setData({
                                    shopCart: resdata
                                })
                                _this.setScHeight();
                            }
                        })
                    }, fail: function () {
                        clickgoods.addPaylist({
                            storeid: _this.data.options.id,
                            paytype: [{
                                ptid: -1,
                                price: res.sprice,
                                paytype: 1,
                                isonline: 1,
                            }],
                            success: function (resdata) {
                                _this.setData({
                                    shopCart: resdata
                                })
                                _this.setScHeight();
                            }
                        })
                    }
                })
            }
        });

    },
    setWaidai() {
        // 设置外带
        var _this = this;
        clickgoods.setWaidai({
            storeid: this.data.storeInfo.storeid,
            success: function (res) {
                clickgoods.removePaylist({
                    storeid: _this.data.options.id,
                    ptid: -1,
                    success: function () {
                        clickgoods.addPaylist({
                            storeid: _this.data.options.id,
                            paytype: [{
                                ptid: -1,
                                price: res.sprice,
                                paytype: 1,
                                isonline: 1,
                            }],
                            success: (resdata) => {
                                _this.setData({
                                    shopCart: resdata
                                })
                                _this.setScHeight();
                            }
                        })
                    }, fail: function () {
                        clickgoods.addPaylist({
                            storeid: _this.data.options.id,
                            paytype: [{
                                ptid: -1,
                                price: res.sprice,
                                paytype: 1,
                                isonline: 1,
                            }],
                            success: (resdata) => {
                                _this.setData({
                                    shopCart: resdata
                                })
                                _this.setScHeight();
                            }
                        })
                    }
                })

            }
        });

    },
    setGiveGoods(event) {
        // 选择赠送商品
        var _this = this;
        if (this.data.giveGoodsDataIndex == event.currentTarget.dataset.index) {
            //取消选择
            giveGoodsDataLog.push({
                event: 'unselect',
                goods: this.data.giveGoodsData[event.currentTarget.dataset.index]
            })
            this.setData({
                giveGoodsDataIndex: -1,
                giveGoodsDataSelected: {}
            })
            clickgoods.removePaylist({
                storeid: _this.data.options.id,
                ptid: _this.data.memberConfig.youhui_paytype
            })
        } else {
            giveGoodsDataLog.push({
                event: 'select',
                goods: this.data.giveGoodsData[event.currentTarget.dataset.index]
            })
            this.setData({
                giveGoodsDataIndex: event.currentTarget.dataset.index,
                giveGoodsDataSelected: this.data.giveGoodsData[event.currentTarget.dataset.index]
            })
            clickgoods.removePaylist({
                storeid: _this.data.options.id,
                ptid: _this.data.memberConfig.youhui_paytype,
                success: function () {
                    clickgoods.addPaylist({
                        storeid: _this.data.options.id,
                        paytype: [{
                            ptid: _this.data.memberConfig.youhui_paytype,
                            price: _this.data.giveGoodsDataSelected.price * 1,
                            paytype: 1,
                            isonline: 1
                        }]
                    })
                }, fail: function () {
                    clickgoods.addPaylist({
                        storeid: _this.data.options.id,
                        paytype: [{
                            ptid: _this.data.memberConfig.youhui_paytype,
                            price: _this.data.giveGoodsDataSelected.price,
                            paytype: 1
                        }]
                    })
                }
            })
        }
        console.log(giveGoodsDataLog)
    },
    setOrder() {
        var _this = this;
        my.showLoading({
            content: "处理中..."
        })
        var orderData = clickgoods.getShoppingCart(this.data.storeInfo.storeid);
        // console.log(orderData,'setOrder');
        // return false;
        clickgoods.getOrderId({
            storeid: this.data.options.id,
            storecode: this.data.storeInfo.storecode,
            success: function (orderNoData) {

                //提交赠品日志数据
                api.uploadBehavior({
                    data: {
                        openid: _this.data.userInfo.openid,
                        mode: "activity_give_goods",
                        path: '/pages/shopping/bill/bill',
                        orderno: orderNoData.order_id,
                        giveGoodsDataLog: giveGoodsDataLog,
                        giveGoods: _this.data.giveGoodsDataSelected
                    }
                });


                var uploadData = {};
                orderData.order_id = orderNoData.order_id;
                orderData.orderindex = orderNoData.orderindex;
                // orderData.orderindex = order_id;
                uploadData.goods = orderData.goods;
                delete orderData.goods;
                uploadData.paylist = php.json_encode(orderData.paylist);
                delete orderData.paylist;
                uploadData.user = php.json_encode(orderData.user);
                delete orderData.user;
                uploadData.store = php.json_encode(orderData.store);
                delete orderData.store;
                //删除一些临时用来显示用的数据
                delete orderData.goodsnumbers;
                delete orderData.goodsnumber;
                delete orderData.typenumbers;
                if (orderData.total_price != orderData.sprice) {
                    orderData.total_price = orderData.sprice
                }

                orderData.ctime = php.time();
                orderData.yytime = php.time();//预约时间
                //赠品活动
                if (_this.data.giveGoodsDataIndex >= 0) {
                    var goodsTmp = {
                        goodsid: _this.data.giveGoodsDataSelected.goodsid,
                        goodsname: _this.data.giveGoodsDataSelected.goodsname,
                        zopenid: _this.data.userInfo.openid,
                        pocket: 1,
                        goodsno: 1,
                        mprice: _this.data.giveGoodsDataSelected.price,
                        discount: 0,
                        youhuiprice: _this.data.giveGoodsDataSelected.price,
                        suitflag: 0,
                        is_give: 1,
                        is_package: 0,
                        dabaohe: 0,
                        remarks: "",
                        yprice: _this.data.giveGoodsDataSelected.price,
                        sprice: 0
                    };
                    uploadData.goods.push(goodsTmp)
                    orderData.total_price += parseInt(_this.data.giveGoodsDataSelected.price);
                    orderData.discount_price += parseInt(_this.data.giveGoodsDataSelected.price);
                }
                uploadData.order = php.json_encode(orderData);
                uploadData.goods = php.json_encode(uploadData.goods);

                // 计算需要追加的数据
                // 如果有券码
                var consumption = {}, userprice = 0, consumptionstatus = false, memberConfig = _this.data.memberConfig;

                if (_this.data.account_integral > 0) {
                    if (!consumption.user) consumption.user = {
                        openid: _this.data.userInfo.openid
                    };
                    consumption.user.integral = _this.data.account_integral;
                    userprice += _this.data.account_integral / memberConfig.jifennum * 100
                    consumptionstatus = true;
                }
                if (_this.data.account_balance > 0) {
                    if (!consumption.user) consumption.user = {
                        openid: _this.data.userInfo.openid
                    };
                    consumption.user.amount = _this.data.account_balance * 100;
                    userprice += consumption.user.amount;
                    consumptionstatus = true;
                }
                if (_this.data.couponData.code) {
                    consumption.coupon = [{
                        type: _this.data.couponData.type,
                        code: _this.data.couponData.code,
                        ptid: _this.data.couponData.ptid,
                        price: _this.data.couponData.price < (orderData.sprice - userprice) ? _this.data.couponData.price : orderData.sprice
                    }];
                    consumptionstatus = true;
                }


                // 设置使用券码或者会员积分余额等
                if (consumptionstatus) {
                    uploadData.consumption = php.json_encode(consumption)
                }

                // console.log(uploadData)
                my.hideLoading();
                my.showLoading({
                    content: "正在创建订单",
                });
                api.uploadOrder(uploadData, function (res) {
                    my.hideLoading();
                    if (res) {
                        const extJson = my.getExtConfigSync();
                        // console.log(orderData);
                        if (typeof res.waiting_payment == 'undefined') {
                            res.waiting_payment = orderData.sprice;
                        }
                        if (res.waiting_payment > 0) {
                            my.showLoading({
                                content: "正在提交支付",
                            });
                            clickgoods.clearShoppingCart({
                                storeid: _this.data.storeInfo.storeid,
                                success: function () {
                                    api.createAlipay({
                                        orderno: res.order_no,
                                        third_appid: extJson.aliappid,
                                        openid: _this.data.userInfo.openid,
                                        storeid: _this.data.storeInfo.storeid,
                                        ptid: _this.data.storeInfo.ptid,
                                        type: 1,
                                        price: res.waiting_payment / 100,
                                    }, function (respay) {
                                        my.hideLoading();
                                        if (respay) {
                                            my.tradePay({
                                                tradeNO: respay.trade_no,
                                                success: function (resdata) {
                                                    my.redirectTo({
                                                        url: '/pages/orderinfo/orderinfo?orderno=' + res.order_no
                                                    });
                                                },
                                                fail: function (resdata) {
                                                    my.redirectTo({
                                                        url: '/pages/orderinfo/orderinfo?orderno=' + res.order_no
                                                    });
                                                },
                                            });
                                        }
                                    })
                                }
                            })

                        } else {
                            my.hideLoading();
                            clickgoods.clearShoppingCart({
                                storeid: _this.data.storeInfo.storeid,
                                success: function () {
                                    my.redirectTo({
                                        url: '/pages/orderinfo/orderinfo?orderno=' + res.order_no
                                    });
                                }
                            })

                        }
                    }
                })
            }
        })
    },
    sendOrderToServer(event) {
        var _this = this;
        api.sendFormid({
            openid: this.data.userInfo.openid,
            formid: event.detail.formId
        })
        // 获取赠品设置
        if (this.data.giveGoodsData.length > 0) { //如果存在赠送商品
            if (this.data.giveGoodsDataIndex < 0) {
                my.confirm({
                    title: "温馨提示",
                    content: "您还没有选择赠品，确定要下单吗？",
                    confirmButtonText: "立即下单",
                    cancelButtonText: "选择赠品",
                    success: (res) => {
                        // console.log(res);
                        if (res.confirm) {
                            _this.setOrder()
                        }
                    },
                });
                return;
            }
        }
        _this.setOrder()
    }
});
