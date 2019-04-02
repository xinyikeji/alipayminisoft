import http from '/libs/http'
import api from '/libs/api'
const app = getApp();
Page({
    data: {
        userInfo: {},
        storeList: {},
        indexAds: {},
        clickNum: 0,
    },
    onLoad(options) {
     

        const extJson = my.getExtConfigSync();
        var _this = this;
        //获取首页广告
        api.getIndexAds(false, function (indexads) {
            // console.log(indexads)
            _this.setData({
                indexAds: indexads,
                options: options,
                version: extJson.version
            })
        })
        api.uploadBehavior({
            data: {
                mode: "instpage",
                query: options,
                path: '/pages/index/index'
            }
        });
    },
    onUnload() {
        api.uploadBehavior({
            data: {
                mode: "uninstpage",
                query: this.data.options,
                path: '/pages/index/index'
            }
        });
    },
    clearCache() {
        let clickNum = this.data.clickNum + 1;
        this.setData({
            clickNum: clickNum
        })
        if (this.data.clickNum > 3) {
            my.confirm({
                title: '温馨提示',
                content: '你确定要清理缓存吗?清理缓存需要重新登录。',
                confirmButtonText: '确定',
                cancelButtonText: '考虑下',
                success: (result) => {
                    if (result.confirm) {
                        my.clearStorage();
                        my.navigateTo({
                            url: '/pages/login/login'
                        })
                    }
                },
            });
            this.setData({
                clickNum: 0
            })
        }
    },
    showQrcode(event) {
        api.sendFormid({
            openid: this.data.userInfo.openid,
            formid: event.detail.formId
        })
        my.navigateTo({
            url: '../shopping/shopping?id=8&t=100'
        });
    },
    onShareAppMessage() {
        // 返回自定义分享信息
        return {
            title: 'My App',
            desc: 'My App description',
            path: 'pages/index/index',
        };
    },
    onGetAuthorize() {
        my.getPhoneNumber({
            success: (res) => {
                let encryptedData = res.response
                http.post({
                    encryptedData: encryptedData,
                    cachekey: '1111111111',
                    method: "alisoft.Login.bindUser"
                }, function (staus, rest) {

                })

                // console.log(encryptedData)
            },
            fail: (res) => {
                // console.log(res)
                // console.log('getPhoneNumber_fail')
            },
        });
    },
    onAuthError() {
        // console.log('getPhoneNumber_error')
    },
    onPageScroll(e) {
        console.log(e)
        const {
            scrollTop
        } = e;
        let titleOpacity = 1 - scrollTop * 0.02;
        let shadow = false;

        if (titleOpacity < 0) {
            titleOpacity = 0;
        }

        if (titleOpacity > 1) {
            titleOpacity = 1;
        }

        if (scrollTop > 80) {
            my.setNavigationBar({
                title: '自助点餐',
            });
        } else {
            my.setNavigationBar({
                title: ' ',
            });
        }

        if (scrollTop > 320) {
            shadow = true;
        } else {
            shadow = false;
        }

        this.setData({
            shadow,
            titleOpacity,
        });
    },
});
