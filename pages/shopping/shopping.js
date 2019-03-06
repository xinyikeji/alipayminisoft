import api from '/libs/api'
import php from '/libs/php'
import clickgoods from '/libs/clickgoods'
const app = getApp();
var settab =
    Page({
        data: {
            windowHeight: 0,
            windowWidth: 0,
            avtiveType: 0,
            scrollTop: 0,
            indexMap: {},
            userInfo: {},
            options: {},
            shopCart: {},
            goodsData: {},
            showSelect: false,
            showGoodsInfo: false,
            showShoppingCart: false,
            showSelectGoodsData: {},
            showGoodsInfoData: {},
            // 停售和售罄商品信息
            stopIdList: [],
            completeIdList: [],
        },
        onUnload() {
            api.uploadBehavior({ data: { openid: this.data.userInfo.openid, mode: "uninstpage", query: this.data.options, path: '/pages/shopping/shopping' } });
        },
        onLoad(options) {
            var _this = this
            if (!options.id) {
                options.id = 3;
            }
            this.setData({
                options: options
            })

            my.getSystemInfo({
                success: (res) => {
                    this.setData({
                        brand: res.brand.toLowerCase(),
                        windowHeight: res.windowHeight,
                        windowWidth: res.windowWidth
                    })
                },
            });
            api.fnGetUpdataCacheData({
                complete(rest) {
                    _this.loadData();
                }
            });

            // console.log('goodsData',this.data.goodsData)
        },
        onShow() {
            if (this.data.show) {
                this.setData({
                    showSelect: false,
                    showGoodsInfo: false,
                    showShoppingCart: false,
                })
                this.loadData();
            } else {
                this.setData({
                    show: true
                })
            }
        },
        loadData() {
            var _this = this;
            my.showLoading({
                content: "商品数据加载中"
            })
            // 开始拉取门店基本数据
            app.getUserInfo(function (userinfo) {
                if (userinfo) {
                    api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: _this.data.options, path: '/pages/shopping/shopping' } });
                    _this.setData({
                        userInfo: userinfo
                    })
                    api.getGoodsInfo(_this.data.options.id, function (goodsdata) {
                        if (Object.keys(goodsdata.goodsObj).length !== 0) {
                            // 如果门店有商品信息
                            // console.log('all goodsdata', goodsdata)
                            my.hideLoading();
                            //计算分类下每个商品区域的高度
                            _this.setData({
                                goodsData: goodsdata,
                            })
                            my.showLoading({
                                content: "门店数据加载中"
                            })
                            console.log(_this.data.goodsData.goodsTypeData)
                            api.getStoreInfo(_this.data.options.id, function (storeinfo) {
                                // console.log("门店信息",storeinfo)
                                my.hideLoading();
                                if (storeinfo) {
                                    _this.setData({
                                        storeData: storeinfo
                                    })
                                    my.getLocation({
                                        success(res) {
                                            // console.log('getLocation',res);
                                            storeinfo.longvalue = app.getLong(res.latitude, res.longitude, storeinfo.lat, storeinfo.lng);
                                            storeinfo.longvalueFormat = app.getLongFormat(storeinfo.longvalue);
                                            storeinfo.name = storeinfo.storename;
                                            _this.setData({
                                                storeData: storeinfo
                                            })
                                            userinfo.name = userinfo.nickname;
                                            clickgoods.setUserInfo({
                                                storeid: _this.data.options.id,
                                                user: userinfo,
                                                success: function (res) {
                                                    clickgoods.setStoreInfo({
                                                        storeid: _this.data.options.id,
                                                        store: storeinfo,
                                                        success: function (res) {
                                                            my.hideLoading();
                                                            _this.setData({
                                                                shopCart: res
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                            var indexMap = [];
                                            for (var i in goodsdata.goodstype) {
                                                my.createSelectorQuery().select('.goodslist-item' + goodsdata.goodstype[i].gtid).boundingClientRect().exec(function (ret) {
                                                    // console.log(ret)
                                                    indexMap.push(ret[0]);
                                                })
                                            }
                                            // console.log(indexMap)
                                            _this.setData({
                                                indexMap: indexMap
                                            })
                                        },
                                        fail(err) {
                                            my.hideLoading();
                                            my.alert({ title: '定位失败', content: '请检查是否授权我们使用您的位置信息' });
                                            my.reLaunch({
                                                url: '/pages/index/index'
                                            });
                                        },
                                    })

                                } else {
                                    my.hideLoading();
                                    my.alert({ title: "错误提示", content: '门店数据获取失败，请尝试重新进入' });
                                    // my.reLaunch({
                                    //   url: '/pages/index/index'
                                    // });
                                }
                            })
                        } else {
                            // 如果门店没有商品信息
                            my.alert({
                                title: '错误提示',
                                content: "该门店暂无商品",
                                success: function () {
                                    my.redirectTo({
                                        url: '/pages/store/store'
                                    })
                                }
                            })
                        }
                    })
                } else {
                    my.hideLoading();
                    my.alert({
                        title: '获取用户信息失败，请重新进入页面尝试'
                    });
                    // my.reLaunch({
                    //   url: '/pages/index/index'
                    // });
                }
            })
        },
        // 在商品列表界面点击去结算
        goShopping() {
            console.log(this.data.shopCart.goods)
            console.log(this.data.shopCart.goodsnumber)
            console.log(this.data.options)
            let goodsArr = this.data.shopCart.goods;
            let goodsIdArr = [];
            goodsArr.forEach((item) => {
                goodsIdArr.push(item.gtid);
            });
            if (goodsIdArr.indexOf(999999999) == -1 && this.data.goodsData.goodsTypeData['999999999']) {
                my.showToast({
                    type: "fail",
                    content: "请选择必点商品"
                });
                this.setData({
                    scrollTop: 1
                })
            } else if (this.data.shopCart.goodsnumber && this.data.shopCart.goodsnumber > 0) {
                my.navigateTo({
                    url: 'bill/bill?id=' + this.data.options.id
                });
            } else {
                my.showToast({
                    type: "fail",
                    content: "还没有点餐"
                });
            }
        },
        goodsListOnScroll(e) {
            var _this = this;
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = null;
            }

            this.timerId = setTimeout(function () {
                for (var i in _this.data.indexMap) {
                    if (_this.data.indexMap[i].top < (e.detail.scrollTop + 130) && _this.data.indexMap[i].bottom > (e.detail.scrollTop + 130)) {
                        _this.setData({
                            avtiveType: i
                        })
                        break;
                    }
                }
            }, 200);
        },
        typeHandleClick(e) {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = null;
            }
            this.setData({
                avtiveType: e.currentTarget.dataset.index,
                scrollTop: this.data.indexMap[e.currentTarget.dataset.index].top - 79
            })
        },
        // 在商品列表界面减少商品
        decGoods(event) {
            // console.log(event.currentTarget.dataset)
            var _this = this;
            clickgoods.decGoodsByGoodsid({
                storeid: this.data.options.id,
                goodsid: event.currentTarget.dataset.goodsid,
                success: function (res) {
                    _this.setData({
                        shopCart: res
                    })
                }, fail(res) {
                    // console.log(res)
                }
            })
        },
        // 函数:当前时间是否在两个时间点之间
        timeRange(beginTime, endTime) {
            var strb = beginTime.split(":");
            var stre = endTime.split(":");
            var b = new Date();
            var e = new Date();
            var n = new Date();
            b.setHours(strb[0]);
            b.setMinutes(strb[1]);
            e.setHours(stre[0]);
            e.setMinutes(stre[1]);
            if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
                // 如果当前时间在开始时间和结束时间之间,返回true
                return true;
            } else {
                // 如果不在,返回false
                return false;
            }
        },
        // 在商品列表界面增加商品
        plusGoods(event) {
            // console.log('停售商品goodsid数组',this.data.stopIdList)
            // console.log('售罄商品goodsid数组',this.data.completeIdList)
            console.log('event',event)
            console.log(this.data.goodsData)
            // goodsData.goodsTypeData[typeGoodsItemName.gtid]
            this.setData({
                showGoodsInfo: false,
            });
            let currentId = event.currentTarget.dataset.goodsid;
            




            var goodsData = this.data.goodsData.goodsObj[event.currentTarget.dataset.goodsid];
            console.log(this.data.goodsData.goodsObj[event.currentTarget.dataset.goodsid])
            var _this = this;
            if (goodsData.suitflag === 0 && goodsData.garnish.length === 0 && goodsData.remarks[0].data.length == 0 && _this.data.storeData.is_packageboxopen == 0) {
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
                    suitflag: 0,
                    is_give: 0,
                    is_package: 0,
                    is_default_package: 0,
                    dabaohe: goodsData.dabaohe,
                    remarks: "",
                    yprice: goodsData.price,
                    sprice: goodsData.price,
                    one_sprice: goodsData.price,
                    one_yprice: goodsData.price,
                    tmp_oneprice: goodsData.price,
                    tmpprice: goodsData.price
                };
                clickgoods.addGoodsToShoppingCart({
                    storeid: this.data.options.id,
                    goodsdata: goodsTmp,
                    success: function (res) {
                        _this.setData({
                            shopCart: res
                        })
                    }
                });
            } else {
                this.setData({
                    showSelect: true,
                    showSelectGoodsData: goodsData
                })
            }
        },
        AddToShoppingCart(res) {
            // console.log('onAddToShoppingCart', res);
            this.setData({
                showSelect: false,
                shopCart: res
            })
        },
        showGoodsInfo(event) {
            this.setData({
                showGoodsInfo: true,
                showGoodsInfoData: this.data.goodsData.goodsObj[event.currentTarget.dataset.goodsid]
            })

        },
        showShoppingCartPopup() {
            this.setData({
                showShoppingCart: true
            })
        },
        // 在购物车组件内加减商品
        changeShoppingCart(cartData) {
            var _this = this;
            _this.setData({
                shopCart: cartData
            })
            if (cartData.goodsnumber < 1) {
                if (_this.data.showShoppingCart) {
                    _this.onShoppingCartlose();
                }
            }
        },
        clearShoppingCart(e) {
            var _this = this;
            my.confirm({
                title: '温馨提示',
                content: '你确定要清空购物车吗?',
                confirmButtonText: '清空购物车',
                cancelButtonText: '暂不需要',
                success: (result) => {
                    if (result.confirm) {
                        clickgoods.clearShoppingCart({
                            storeid: _this.data.options.id,
                            success: function (resdata) {
                                var userinfo = _this.data.userInfo;
                                userinfo.name = userinfo.nickname;
                                clickgoods.setUserInfo({
                                    storeid: _this.data.options.id,
                                    user: userinfo,
                                    success: function (res) {
                                        clickgoods.setStoreInfo({
                                            storeid: _this.data.options.id,
                                            store: _this.data.storeData,
                                            success: function (res) {
                                                // console.log('showCart ', res)
                                                _this.setData({
                                                    shopCart: res
                                                })
                                            }
                                        })
                                        if (_this.data.showShoppingCart) {
                                            _this.onShoppingCartlose();
                                        }
                                    }
                                })
                            }

                        })
                    }
                },
            });
        },
        onSelectPopupClose() {
            this.setData({
                showSelect: false
            })
        },
        onGoodsInfoPopupClose() {
            this.setData({
                showGoodsInfo: false
            })
        },
        onShoppingCartlose() {
            this.setData({
                showShoppingCart: false
            })
        }
    });
