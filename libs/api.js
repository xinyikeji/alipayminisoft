import http from './http'
import php from './php'
import libsCommon from './common'
export default {

    // 获取会员券码详情
    getCouponDetail(xyopenid, code, type, callback) {
        http.post({
            method: "member.OpenUser.getCouponDetail",
            xyopenid: xyopenid,
            code: code,
            type: type
        }, function (status, res) {
            callback(status, res)
        })
    },

    // 拉取门店停售商品信息
    getStopList(storeid, callback) {
        http.post({
            method: "goods.Storestopgoods.getStopList",
            storeid: storeid,
        }, function (status, res) {
            // console.log(res1, '停售信息',res2)
            callback(status, res)
        })
    },
    // 拉取门店售罄商品信息
    getCompleteList(storeid, callback) {
        http.post({
            method: "goods.Storeclear.getCompleteList",
            storeid: storeid,
        }, function (restatuss3, res) {
            // console.log(res3, '售罄信息',res4)
            callback(status, res)
        })
    },
    /**
     * 获取指定页面URL 或者 URL+参数
     */
    fnCurrentPageUrlOrParam(opt = {
        type: 1,
        delta: 1,
    }) {
        let delta = opt.delta ? opt.delta : 1;
        var pages = getCurrentPages() //获取加载的页面
        let indexNum = pages.length > delta ? pages.length - delta : pages.length - 1;
        var currentPage = pages[indexNum] //获取当前页面的对象
        var url = '/' + currentPage.route //当前页面url
        var options = currentPage.options //如果要获取url中所带的参数可以查看options
        if (opt.type == 1) {

            return url;
        }
        if (opt.type == 2) {
            //拼接url的参数
            var urlWithArgs = url + '?'
            for (var key in options) {
                var value = options[key]
                urlWithArgs += key + '=' + value + '&'
            }
            urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

            return urlWithArgs
        }
    },
    /**
     * 获取手机微信手机号一键授权登录
     * @param callback
     */
    fnOneKeyLogin(opt = {}) {
        let _this = this;
        if (!opt.success) {
            opt.success = function () { }
        };
        if (!opt.fail) {
            opt.fail = function () { }
        };
        if (!opt.complete) {
            opt.complete = function () { }
        };

        const extJson = my.getExtConfigSync();
        // let encryptedData = encodeURIComponent(opt.encryptedData);
        let encryptedData = opt.encryptedData;
        let iv = encodeURIComponent(opt.iv);
        let code = opt.code ? opt.code : '';

        http.post({
            method: "alisoft.Login.getPhoneKeyToUserInfo",
            third_appid: extJson.aliappid,//第三方应用appid
            code: code,
            encryptedData: encryptedData,
            // iv: iv,
        }, function (status, rest) {
            // console.log(rest);
            if (status && rest.data.code == 1) {

                opt.success(rest.data.data);
                return false;
            } else {
                opt.fail(rest.data)
            }

        })
    },




    //账号密码登录
    fnAccountLogin(opt = {}) {
        let _this = this;
        if (!opt.success) {
            opt.success = function () { }
        };
        if (!opt.fail) {
            opt.fail = function () { }
        };
        if (!opt.complete) {
            opt.complete = function () { }
        };
        const extJson = my.getExtConfigSync();
        let code = opt.code ? opt.code : '';//微信用户登录授权码
        let account = opt.account ? opt.account : '';//账号（用户编码或手机号）
        let password = opt.password ? opt.password : '';//密码


        http.post({
            method: "alisoft.Login.AccountLogin",
            third_appid: extJson.aliappid,//第三方应用appid
            code: code,
            account: account,
            password: password
        }, function (status, rest) {

            // console.log(rest);
            if (status && rest.data.code == 1) {

                opt.success(rest.data.data);
                return false;
            } else {
                opt.fail(rest.data)
            }



        })
    },
    /**
     * 手机验证码登录
     */
    fnPhoneLogin(opt = {}) {
        let _this = this;
        if (!opt.success) {
            opt.success = function () { }
        };
        if (!opt.fail) {
            opt.fail = function () { }
        };
        if (!opt.complete) {
            opt.complete = function () { }
        };
        const extJson = my.getExtConfigSync();
        let phone = opt.phone ? opt.phone : '';//手机号
        let code = opt.code ? opt.code : '';//微信用户登录授权码
        let verify_code = opt.verify_code ? opt.verify_code : '';//短信验证码

        http.post({
            method: "alisoft.Login.SmsLogin",
            third_appid: extJson.aliappid,//第三方应用appid
            code: code,
            phone: phone,
            verify_code: verify_code,
        }, function (status, rest) {
            // console.log(rest);
            if (status && rest.data.code == 1) {

                opt.success(rest.data.data);
                return false;
            } else {
                opt.fail(rest.data)
            }
        })
    },

    /**
 * 发送短信验证码
 * 1、用户登录2、密码找回3、用户注册4、获取已存在用户5、验证手机号是否存在
 */
    fnSendSmsVerifiCode(opt = {}) {
        let _this = this;
        if (!opt.success) {
            opt.success = function () { }
        };
        if (!opt.fail) {
            opt.fail = function () { }
        };
        if (!opt.complete) {
            opt.complete = function () { }
        };

        let phone = opt.phone ? opt.phone : '';
        let type = opt.type ? opt.type : 1;

        http.post({
            method: "member.OpenUser.sendSmsVerifiCode",
            phone: phone,
            type: type
        }, function (status, rest) {
            // console.log(rest);
            if (status && rest.data.code == 1) {

                opt.success(rest.data.data);
                return false;
            } else {
                opt.fail(rest.data)
            }
        })
    },





    getSerial(option) {
        if (!option.success) option.success = function (res) { console.log('getSerial success ', res) }
        if (!option.fail) option.fail = function (res) { console.log('getSerial fail ', res) }
        if (!option.storeid) {
            option.fail({ error: true, message: "没有设置storeid" })
            return;
        }
        http.post({
            method: "miniapp.MiniOther.getSerial",
            storeid: option.storeid,
            isDaily: 1,
            isEachStoreCode: 0,
            codeLength: 4
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                option.success(rest.data.data.code)
            } else {
                option.fail({ error: true, message: "数据读取失败" })
            }
        })
    },
    uploadBehavior(option) {
        if (!option.success) option.success = function (res) { console.log('uploadBehavior success ', res) }
        if (!option.fail) option.fail = function (res) { console.log('uploadBehavior fail ', res) }
        if (!option.data) {
            option.fail({ error: true, message: "没有设置data" })
            return;
        }

        const extJson = my.getExtConfigSync();
        var appkey = my.getStorageSync({
            key: 'appkey'
        });

        option.data.key = appkey.data;
        option.data.time = php.time();
        option.data.version = extJson.version;

        var postdata = {
            method: "miniapp.Activity.uploadUserAction",
            third_appid: extJson.aliappid,
            source: 2,
            data: JSON.stringify(option.data)
        };
        // console.log(postdata)
        http.post(postdata, function (status, rest) {
            if (status && rest.data.code === 1) {
                option.success(rest.data.data)
            } else {
                option.fail({ error: true, message: "数据读取失败" })
            }
        })
    },
    getOrderCancleRemarks(option) {
        if (!option.success) option.success = function (res) { console.log('getOrderCancleRemarks success ', res) }
        if (!option.fail) option.fail = function (res) { console.log('getOrderCancleRemarks fail ', res) }
        var info = my.getStorageSync({
            key: 'getOrderCancleRemarks', // 缓存数据的key
        });
        if (info.data) {
            option.success(info.data);
            return;
        }
        const extJson = my.getExtConfigSync();
        var postdata = {
            method: "bussiness.Sysconfig.getDictionariesItems",
            type: 32
        };
        http.post(postdata, function (status, rest) {
            if (status && rest.data.code === 1) {
                my.setStorage({
                    key: 'getOrderCancleRemarks',
                    data: rest.data.data
                })
                option.success(rest.data.data)
            } else {
                option.fail({ error: true, message: "数据读取失败" })
            }
        })
    },
    //取消订单
    cancelOrder(option) {
        if (!option.success) option.success = function (res) { console.log('getOrderDetail success ', res) }
        if (!option.fail) option.fail = function (res) { console.log('getOrderDetail fail ', res) }
        if (!option.orderno) {
            option.fail({ error: true, message: "没有设置orderno" })
            return;
        }


        // const extJson = my.getExtConfigSync();
        var postdata = {
            method: "order.ordercancel.setOrderCancel",
            orderno: option.orderno
        };

        postdata.storeid = option.storeid;//	门店ID
        postdata.orderno = option.orderno;//	订单编号
        postdata.dociid = option.dociid;//	取消理由ID 拉取销单理由接口
        postdata.canceltype = option.canceltype;//	订单编号

        http.post(postdata, function (status, rest) {
            if (status && rest.data.code === 1) {
                option.success(rest.data.data)
            } else {
                option.fail(rest.data)
            }
        })
    },

    //取消理由
    getCancelReason(option) {
        if (!option.success) option.success = function (res) { console.log('getOrderDetail success ', res) }
        if (!option.fail) option.fail = function (res) { console.log('getOrderDetail fail ', res) }


        // const extJson = my.getExtConfigSync();
        var postdata = {
            method: "order.cancelreason.getCancelReason",
        };


        http.post(postdata, function (status, rest) {
            if (status && rest.data.code === 1) {
                option.success(rest.data.data)
            } else {
                option.fail({ error: true, message: "数据读取失败" })
            }
        })
    },



    getOrderDetail(option) {
        if (!option.success) option.success = function (res) { console.log('getOrderDetail success ', res) }
        if (!option.fail) option.fail = function (res) { console.log('getOrderDetail fail ', res) }
        if (!option.orderno) {
            option.fail({ error: true, message: "没有设置orderno" })
            return;
        }
        if (!option.cache) {
            var info = my.getStorageSync({
                key: 'getOrderDetail' + option.orderno, // 缓存数据的key
            });
            if (info.data) {
                option.success(info.data);
                return;
            }
        }

        const extJson = my.getExtConfigSync();
        var postdata = {
            method: "order.orderinfo.getOrderInfoByOrderno",
            orderno: option.orderno
        };
        if (option.storeid) {
            postdata.storeid = option.storeid
        }
        http.post(postdata, function (status, rest) {
            if (status && rest.data.code === 1) {
                my.setStorage({
                    key: 'getOrderDetail' + option.orderno,
                    data: rest.data.data
                })
                option.success(rest.data.data)
            } else {
                option.fail({ error: true, message: "数据读取失败" })
            }
        })
    },
    getOrderList(option) {
        if (!option.success) option.success = function (res) { console.log('getOrderList success ', res) }
        if (!option.fail) option.fail = function (res) { console.log('getOrderList fail ', res) }
        if (!option.openid) {
            option.fail({ error: true, message: "没有设置openid" })
            return;
        }
        if (!option.year) {
            option.fail({ error: true, message: "没有设置year" })
            return;
        }
        const extJson = my.getExtConfigSync();
        var postdata = {
            method: "order.orderinfo.getUserOrderList",
            openid: option.openid,
            year: option.year
        };
        if (option.status) postdata.status = option.status;
        if (typeof (option.isfinish) != 'undefined') postdata.isfinish = option.isfinish;
        http.post(postdata, function (status, rest) {
            if (status && rest.data.code === 1) {
                option.success(rest.data.data)
            } else {
                option.fail({ error: true, message: "数据读取失败" })
                return;
            }
        })
    },
    sendFormid(option) {
        if (!option.success) option.success = function (res) { console.log('sendFormid success ', res) }
        if (!option.fail) option.fail = function (res) { console.log('sendFormid fail ', res) }
        if (!option.openid) {
            option.fail({ error: true, message: "没有设置openid" })
            return;
        }
        if (!option.formid) {
            option.fail({ error: true, message: "没有设置formid" })
            return;
        }
        const extJson = my.getExtConfigSync();
        var postdata = {
            method: "miniapp.MiniOther.uploadFormid",
            openid: option.openid,
            third_appid: extJson.aliappid,
            source: 2,
            formidtype: 2,
            formid: option.formid
        };
        http.post(postdata, function (status, rest) {
            if (status && rest.data.code === 1) {
                option.success(rest.data.data)
            } else {
                option.fail({ error: true, message: "数据读取失败" })
                return;
            }
        })
    },
    getStoreInfo(storeid, callback) {
        var storeinfo = my.getStorageSync({
            key: 'storeinfo-' + storeid, // 缓存数据的key
        });
        if (storeinfo.data) {
            callback(storeinfo.data);
            return;
        }
        const extJson = my.getExtConfigSync();
        http.post({
            method: "miniapp.StoreInfo.getStoreInfo",
            third_appid: extJson.aliappid,
            type: 1,
            ptype: 2,
            storeid: storeid
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                my.setStorageSync({
                    key: "storeinfo-" + storeid,
                    data: rest.data.data
                })
                callback(rest.data.data);
            } else {
                callback(false);
            }
        })
    },
    getStoreList(callback) {
        var storeinfo = my.getStorageSync({
            key: 'storeinfo-all', // 缓存数据的key
        });
        if (storeinfo.data) {
            callback(storeinfo.data);
            return;
        }
        const extJson = my.getExtConfigSync();
        http.post({
            method: "miniapp.StoreInfo.getStoreList",
            third_appid: extJson.aliappid,
            ptype: 2,
            type: 1
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                my.setStorageSync({
                    key: "storeinfo-all",
                    data: rest.data.data
                })
                callback(rest.data.data);
            } else {
                console.log(status, rest)
                callback(false);
            }
        })
    },

    getIntegralList(openid, page, callback) {
        http.post({
            method: "member.OpenUser.getIntegralWater",
            xyopenid: openid,
            page: page,
            page_size: 30
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                callback(rest.data.data);
            } else {
                console.log(status, rest)
                callback(false);
            }
        })
    },
    getFinancialflow(openid, page, callback) {
        http.post({
            method: "member.MemberInfo.getFinancialflow",
            openid: openid,
            page: page,
            page_size: 30
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                callback(rest.data.data.rowdata);
            } else {
                console.log(status, rest)
                callback(false);
            }
        })
    },
    getUserGiveGoods(openid, storeid, callback) {
        const extJson = my.getExtConfigSync();
        http.post({
            method: "miniapp.Activity.getUserGiveGoods",
            openid: openid,
            storeid: storeid,
            third_appid: extJson.aliappid,
            ptype: 2
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                callback(rest.data.data);
            } else {
                console.log(status, rest)
                callback(false);
            }
        })
    },
    getIndexAds(openid, callback) {
        // console.log(this)
        var datainfo = my.getStorageSync({
            key: 'indexads-all', // 缓存数据的key
        });
        if (datainfo.data) {
            callback(datainfo.data);
        }
        const extJson = my.getExtConfigSync();
        var postdata = {
            method: "miniapp.Activity.getIndexActivityLink",
            third_appid: extJson.aliappid,
            ptype: 2
        }
        if (openid) {
            postdata.openid = openid;
        }
        http.post(postdata, function (status, rest) {
            if (status && rest.data.code === 1) {
                my.setStorageSync({
                    key: "indexads-all",
                    data: rest.data.data
                })
                callback(rest.data.data);
            } else {
                console.log(status, rest)
                callback(false);
            }
        })
    },
    getRemarks(callback) {
        var datainfo = my.getStorageSync({
            key: 'remarks-all', // 缓存数据的key
        });
        if (datainfo.data) {
            callback(datainfo.data);
            return false;
        }
        const extJson = my.getExtConfigSync();
        var postdata = {
            method: "goods.goodsinfo.getAllGoodsRemarks"
        }
        http.post(postdata, function (status, rest) {
            if (status && rest.data.code === 1) {
                var obj = {}, typeobj = {};
                for (var i in rest.data.data) {
                    for (var j in rest.data.data[i].child) {
                        rest.data.data[i].child[j].gptid = rest.data.data[i].gptid;
                        obj[rest.data.data[i].child[j].grid] = rest.data.data[i].child[j];
                    }
                    typeobj[rest.data.data[i].gptid] = rest.data.data[i].name;
                }
                var backdata = {
                    obj: obj,
                    typeobj: typeobj,
                    data: rest.data.data
                };
                my.setStorageSync({
                    key: "remarks-all",
                    data: backdata
                })
                callback(backdata);
            } else {
                console.log(status, rest)
                callback(false);
            }
        })
    },


    //获取用户订单优惠券
    fnGetUserOrderCoupons(opt) {
        let _this = this;
        if (!opt.success) opt.success = function (res) { console.log('setOrderComplete success ', res) }
        if (!opt.fail) opt.fail = function (res) { console.log('setOrderComplete fail ', res) }

        //门店ID
        let storeid = opt.storeid ? opt.storeid : 0;
        //芯易openid
        let xyopenid = opt.xyopenid ? opt.xyopenid : 0;
        //订单应付价格
        let price = opt.price ? opt.price : 0;
        //订单商品数据
        let goodsdata = opt.goodsdata ? opt.goodsdata : [];
        let page = opt.page ? opt.page : 1;
        let pagesize = opt.pagesize ? opt.pagesize : 600;
        const extJson = my.getExtConfigSync();



        http.post({
            method: "member.WeixinOrder.getWxUseableCashCoupons",
            storeid: storeid, //门店ID
            xyopenid: xyopenid, //芯易openid
            price: price,
            type: '1,2,4,5',
            wxappid: extJson.appid, //微信小程序APPID
            page: page,
            pagesize: pagesize
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                let couponsData = rest.data.data.data;
                console.log(couponsDatas);
                for (let i = 0; i < couponsData.length; i++) {
                    //商品现金券
                    if (couponsData[i].type == 1) {
                        for (let g in goodsdata) {
                            couponsData[i].price = libsCommon.fnPriceFormat(couponsData[i].price, 2);
                            if (goodsdata[g].goodsid == couponsData[i].goodsids) {
                                let offerPrice = Number(couponsData[i].price);
                                couponsData[i].offerPrice = Math.round(offerPrice);
                                couponsData[i].offerPrice_format = libsCommon.fnPriceFormat(offerPrice);
                                couponsData[i].showname = '优惠' + couponsData[i].offerPrice_format + '元,商品现金券';
                                couponsData[i].goodscode = goodsdata[g].goodscode;
                                break;
                            }
                        }

                    }
                    //全单现金券
                    if (couponsData[i].type == 2) {
                        couponsData[i].price = libsCommon.fnPriceFormat(couponsData[i].price, 2);
                        couponsData[i].sprice = libsCommon.fnPriceFormat(couponsData[i].sprice, 2);
                        couponsData[i].sprice_format = libsCommon.fnPriceFormat(couponsData[i].sprice);
                        if (price >= couponsData[i].sprice) {
                            let offerPrice = Number(couponsData[i].price);
                            couponsData[i].offerPrice = Math.round(offerPrice);
                            couponsData[i].offerPrice_format = libsCommon.fnPriceFormat(offerPrice);
                            couponsData[i].showname = '优惠' + couponsData[i].offerPrice_format + '元,全单现金券';
                        }
                    }
                    //兑换券
                    if (couponsData[i].type == 3) {

                    }
                    //商品折扣券
                    if (couponsData[i].type == 4) {
                        couponsData[i].maxdiscount = libsCommon.fnPriceFormat(couponsData[i].maxdiscount, 2);
                        for (let g in goodsdata) {
                            if (goodsdata[g].goodsid == couponsData[i].goodsids) {

                                //计算优惠金额（分）
                                let offerPrice = libsCommon.fnOperation(goodsdata[g].STotalPrice, libsCommon.fnOperation(libsCommon.fnOperation(
                                    100,
                                    couponsData[i].discount, '-'), 100, '/'), '*');

                                if (offerPrice >= couponsData[i].maxdiscount && couponsData[i].maxdiscount !== 0) {
                                    offerPrice = couponsData[i].maxdiscount;
                                }
                                couponsData[i].offerPrice = Math.round(offerPrice);
                                couponsData[i].offerPrice_format = libsCommon.fnPriceFormat(offerPrice);
                                couponsData[i].goodscode = goodsdata[g].goodscode;

                                couponsData[i].showname = '优惠' + couponsData[i].offerPrice_format + '元,商品折扣券';
                                break;

                            }
                        }
                    }
                    //全单折扣券
                    if (couponsData[i].type == 5) {
                        couponsData[i].price = libsCommon.fnPriceFormat(couponsData[i].price, 2);
                        couponsData[i].sprice = libsCommon.fnPriceFormat(couponsData[i].sprice, 2);
                        couponsData[i].sprice_format = libsCommon.fnPriceFormat(couponsData[i].sprice);
                        couponsData[i].maxdiscount = libsCommon.fnPriceFormat(couponsData[i].maxdiscount, 2);
                        //判断满多少可以使用
                        if (price >= couponsData[i].sprice) {
                            couponsData[i].discount = libsCommon.fnOperation(100, couponsData[i].discount, '-');

                            couponsData[i].discount = libsCommon.fnOperation(couponsData[i].discount, 100, '/');

                            //计算优惠金额（分）
                            let offerPrice = libsCommon.fnOperation(price, couponsData[i].discount, '*');

                            if (offerPrice >= couponsData[i].maxdiscount && couponsData[i].maxdiscount !== 0) {
                                offerPrice = couponsData[i].maxdiscount;
                            }
                            couponsData[i].offerPrice = Math.round(offerPrice);
                            couponsData[i].offerPrice_format = libsCommon.fnPriceFormat(offerPrice);
                            couponsData[i].showname = '优惠' + couponsData[i].offerPrice_format + '元,全单折扣券';
                        }
                    }
                    Object.assign(couponsData[i], couponsType[couponsData[i].type]);
                    if (!couponsData[i].offerPrice || couponsData[i].offerPrice == 0) {
                        couponsData.splice(i--, 1);
                    }
                }



                opt.success(couponsData);
            } else {
                console.log(status, rest)
                opt.fail(rest);
            }
        })

    },
    setOrderComplete(option) {
        if (!option.success) option.success = function (res) { console.log('setOrderComplete success ', res) }
        if (!option.fail) option.fail = function (res) { console.log('setOrderComplete fail ', res) }
        if (!option.storeid) {
            option.fail({ error: true, message: "没有设置storeid" })
            return;
        }
        if (!option.orderno) {
            option.fail({ error: true, message: "没有设置orderno" })
            return;
        }
        if (!option.price) {
            option.fail({ error: true, message: "没有设置price" })
            return;
        }
        http.post({
            method: "order.weborder.setOrderComplete",
            storeid: option.storeid,
            status: 1,
            orderno: option.orderno,
            yprice: option.price,
            sprice: option.price,
            cprice: 0
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                option.success(rest.data.data);
            } else {
                console.log(status, rest)
                option.fail(rest);
            }
        })

    },
    getIntegralShoppingList(openid, callback) {
        var storeinfo = my.getStorageSync({
            key: 'getIntegralList-all', // 缓存数据的key
        });
        if (storeinfo.data) {
            callback(storeinfo.data);
            return;
        }
        const extJson = my.getExtConfigSync();
        http.post({
            method: "member.OpenIntegralMall.getIntegralList",
            openid: openid,
            page: 1
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                my.setStorageSync({
                    key: "getIntegralList-all",
                    data: rest.data.data
                })
                callback(rest.data.data);
            } else {
                console.log(status, rest)
                callback(false);
            }
        })
    },
    getMemberConfigInfo(storeid, callback) {
        var info = my.getStorageSync({
            key: 'member.MemberInfo.memberAccount', // 缓存数据的key
        });
        if (info.data) {
            callback(info.data);
            return;
        }
        const extJson = my.getExtConfigSync();
        http.post({
            method: "member.MemberInfo.memberAccount",
            storeid: storeid.toString(),
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                my.setStorageSync({
                    key: "member.MemberInfo.memberAccount",
                    data: rest.data.data
                })
                callback(rest.data.data);
            } else {
                console.log(status, rest)
                callback(false);
            }
        })
    },
    /**
     * 获取 商品售罄 、停售
     * @param callback
     */
    fnGetGoodsSales(opt = {}) {
        let _this = this;
        if (!opt.success) {
            opt.success = function () { }
        };
        if (!opt.fail) {
            opt.fail = function () { }
        };
        if (!opt.complete) {
            opt.complete = function () { }
        };

        let type = opt.type ? opt.type : 1; //查询类型 1自助 2外卖
        let storeid = opt.storeid ? opt.storeid : 1; //查询类型 1自助 2外卖
        let saletype = opt.saletype ? opt.saletype : '1,2'; //1售罄 、2停售

        //请求获取 
        http.post({
            method: 'member.WeixinGoods.getGoodsClear',
            storeid: storeid, //门店ID
            type: type,
            saletype: saletype
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                opt.success(rest.data.data);
            } else {
                console.log(status, rest)
                _this.postError({ postdata: data, restback: rest })
                opt.fail(false);
            }
        });
    },

    uploadOrder(data, callback) {
        data.method = "order.xinyiorder.uploadOrder";
        var _this = this;
        http.post(data, function (status, rest) {
            if (status && rest.data.code === 1) {
                callback(rest.data.data);
            } else {
                console.log(status, rest)
                _this.postError({ postdata: data, restback: rest })
                callback(false);
            }
        })
    },
    postError(error) {
        let data = {};
        data.method = "bussiness.Writeloginfo.uploadLogInfo";
        data.loginfo = JSON.stringify(error);
        http.post(data, function (status, rest) { })
    },
    createAlipay(data, callback) {
        data.method = "miniapp.OnlinePay.getAliPayPaymentOrderno";
        var _this = this;
        http.post(data, function (status, rest) {
            if (status && rest.data.code === 1) {
                callback(rest.data.data);
            } else {
                _this.postError({ postdata: data, restback: rest })
                console.log(status, rest)
                callback(false);
            }
        })
    },
    getGoodsInfo(storeid, callback) {
        var datainfo = my.getStorageSync({
            key: 'store-goods-all-' + storeid, // 缓存数据的key
        });
        var dataobjinfo = my.getStorageSync({
            key: 'store-goods-goods-obj-' + storeid, // 缓存数据的key
        });
        var dataTypeobjinfo = my.getStorageSync({
            key: 'store-goods-type-obj-' + storeid, // 缓存数据的key
        });

        this.fnGetGoodsSales({
            storeid: storeid,
            success(salesData) {
                console.log(salesData, 'salesData');
                if (datainfo.data && dataobjinfo.data && dataTypeobjinfo.data) {
                    //处理数据
                    var goodsObj = {}, goodsTypeData = {};
                    for (var i in datainfo.data.goodsdata) {


                        let goods = datainfo.data.goodsdata[i];
                        //检测商品是否在可售时间范围
                        goods.issales = false;
                        if (goods.sales.length > 0) {

                            for (let i in goods.sales) {
                                let sales = libsCommon.fnCheckTimeScope(goods.sales[i].stime, goods.sales[i].ttime);

                                if (sales == true) {
                                    goods.issales = false;
                                    break;
                                }
                                if (sales == false) {
                                    goods.issales = true;
                                }
                            }
                        }



                        for (let j in salesData[goods.goodsid]) {
                            let sales = libsCommon.fnCheckTimeScope(
                                salesData[goods.goodsid][j].stime,
                                salesData[goods.goodsid][j].ttime,
                                2
                            );

                            if (
                                salesData[goods.goodsid][j].type == 1 &&
                                sales
                                // &&
                                // storeGoods[salesData[i][j].goodsid]
                            ) {
                                goods.sellout = sales;
                            }

                            if (
                                salesData[goods.goodsid][j].type == 2 &&
                                sales
                                // &&
                                // storeGoods[salesData[i][j].goodsid]
                            ) {
                                goods.haltsales = sales;
                            }
                        }

                        datainfo.data.goodsdata[i] = goods;





                        goodsObj[datainfo.data.goodsdata[i]['goodsid']] = datainfo.data.goodsdata[i];
                        if (!goodsTypeData[datainfo.data.goodsdata[i]['gtid']]) goodsTypeData[datainfo.data.goodsdata[i]['gtid']] = [];
                        goodsTypeData[datainfo.data.goodsdata[i]['gtid']].push(datainfo.data.goodsdata[i]);
                    }

                    callback({
                        goodstype: datainfo.data.goodstype,
                        goodsdata: datainfo.data.goodsdata,
                        goodsObj: goodsObj,
                        goodsTypeData: goodsTypeData
                    });
                    return;
                }
                const extJson = my.getExtConfigSync();
                http.post({
                    method: "miniapp.GoodsInfo.getGoodsTypeList",
                    third_appid: extJson.aliappid,
                    type: 1,
                    ptype: 2,
                    storeid: storeid
                }, function (status, rest) {
                    if (status && rest.data.code === 1) {
                        http.post({
                            method: "miniapp.GoodsInfo.getGoodsInfo",
                            third_appid: extJson.aliappid,
                            type: 1,
                            ptype: 2,
                            storeid: storeid
                        }, function (status, restgoods) {
                            if (status && restgoods.data.code === 1) {
                                //处理数据
                                var goodsObj = {}, goodsTypeData = {};
                                for (var i in restgoods.data.data) {
                                    restgoods.data.data[i].priceFormat = (restgoods.data.data[i].price / 100).toFixed(2)


                                    let goods = restgoods.data.data[i];
                                    //检测商品是否在可售时间范围
                                    goods.issales = false;
                                    if (goods.sales.length > 0) {

                                        for (let i in goods.sales) {
                                            let sales = libsCommon.fnCheckTimeScope(goods.sales[i].stime, goods.sales[i].ttime);

                                            if (sales == true) {
                                                goods.issales = false;
                                                break;
                                            }
                                            if (sales == false) {
                                                goods.issales = true;
                                            }
                                        }
                                    }

                                    for (let j in salesData[goods.goodsid]) {
                                        let sales = libsCommon.fnCheckTimeScope(
                                            salesData[goods.goodsid][j].stime,
                                            salesData[goods.goodsid][j].ttime,
                                            2
                                        );

                                        if (
                                            salesData[goods.goodsid][j].type == 1 &&
                                            sales
                                            // &&
                                            // storeGoods[salesData[i][j].goodsid]
                                        ) {
                                            goods.sellout = sales;
                                        }

                                        if (
                                            salesData[goods.goodsid][j].type == 2 &&
                                            sales
                                            // &&
                                            // storeGoods[salesData[i][j].goodsid]
                                        ) {
                                            goods.haltsales = sales;
                                        }
                                    }


                                    restgoods.data.data[i] = goods;





                                    goodsObj[restgoods.data.data[i]['goodsid']] = restgoods.data.data[i];
                                    if (!goodsTypeData[restgoods.data.data[i]['gtid']]) goodsTypeData[restgoods.data.data[i]['gtid']] = [];
                                    goodsTypeData[restgoods.data.data[i]['gtid']].push(restgoods.data.data[i]);
                                }
                                my.setStorage({
                                    key: "store-goods-all-" + storeid,
                                    data: {
                                        goodstype: rest.data.data,
                                        goodsdata: restgoods.data.data,
                                    },
                                    fail: function (res) {
                                        my.alert({ content: '1' + res.errorMessage });
                                    }
                                })
                                my.setStorage({
                                    key: "store-goods-goods-obj-" + storeid,
                                    data: {
                                        goodsObj: goodsObj,
                                    },
                                    fail: function (res) {
                                        my.alert({ content: '2' + res.errorMessage });
                                    }
                                })
                                my.setStorage({
                                    key: "store-goods-type-obj-" + storeid,
                                    data: {
                                        goodsTypeData: goodsTypeData,
                                    },
                                    fail: function (res) {
                                        my.alert({ content: '3' + res.errorMessage });
                                    }
                                })
                                callback({
                                    goodstype: rest.data.data,
                                    goodsdata: restgoods.data.data,
                                    goodsObj: goodsObj,
                                    goodsTypeData: goodsTypeData
                                });
                            } else {
                                console.log(status, restgoods)
                                callback(false);
                            }
                        })
                    } else {
                        callback(false);
                    }
                })
            }
        });
    },
    getUserAccount(openid, callback) {
        http.post({
            openid: openid,
            usercoupon: '1',
            method: "member.MemberInfo.getMemberInfoDetail",
        }, function (status, rest) {
            if (status && rest.data.code === 1) {
                callback(rest.data.data);
            } else {
                callback(false);
            }
        })
    },
}