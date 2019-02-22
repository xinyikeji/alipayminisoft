import http from '/libs/http'
import api from '/libs/api'
App({
    onLaunch(options) {
        const extJson = my.getExtConfigSync();
        var version = my.getStorageSync({
            key: "version"
        });
        console.log(version)
        if (version.data) {
            if (version.data != extJson.version) {
                my.clearStorage();
                my.setStorage({
                    key: 'version', // 缓存数据的key
                    data: extJson.version
                });
            }
        } else {
            my.clearStorage();
            my.setStorage({
                key: 'version', // 缓存数据的key
                data: extJson.version
            });
        }
        my.setStorage({
            key: 'appkey', // 缓存数据的key
            data: this.getUUID()
        });
        options.mode = 'onLaunch';
        var systemInfo = my.getSystemInfoSync();
        options.systemInfo = systemInfo;
        api.uploadBehavior({ data: options });

        const UserCache = my.getStorageSync({
            key: 'userinfo', // 缓存数据的key
        });

        if (!UserCache.data || UserCache.data.length == 0) {
            my.alert({
                title: '提示',
                content: '你还没有登录，请登录~'
            })
            my.navigateTo({
                url: '/pages/login/login'
            })
            return false;
        }



    },
    getUserInfo(callback) {
        const UserCache = my.getStorageSync({
            key: 'userinfo', // 缓存数据的key
        });
        console.log(UserCache, 'de');
        if (UserCache.data) {
            console.log(UserCache);
            callback(UserCache.data);
            return;
        }
        const extJson = my.getExtConfigSync();
        var _this = this;
        my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
                http.post({
                    authcode: res.authCode,
                    alipayappid: extJson.aliappid,
                    method: "alisoft.Login.codeToinfo"
                }, function (status, rest) {
                    // console.log(status, rest);
                    if (status && rest.data.code === 1) {
                        my.setStorageSync({
                            key: 'userinfo', // 缓存数据的key
                            data: rest.data.data, // 要缓存的数据
                        });
                        callback(rest.data.data);
                    } else {
                        callback(false);
                    }
                })
            },
            fail: function (res) {
                my.alert({
                    title: '错误提示',
                    content: '由于您拒绝了我们获取授权信息,我们将无法为你提供任何服务!'
                })
            }
        });
    },

    getUUID: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    getLong: function (lat1, lng1, lat2, lng2) {
        /**
         * 根据两个地图坐标计算两点间的直线距离
         */
        //获取两点距离
        lat1 = lat1 || 0;
        lng1 = lng1 || 0;
        lat2 = lat2 || 0;
        lng2 = lng2 || 0;

        var rad1 = lat1 * Math.PI / 180.0;
        var rad2 = lat2 * Math.PI / 180.0;
        var a = rad1 - rad2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

        var r = 6378137;
        var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));

        /*if (distance > 1000){
          distance = Math.round(distance / 1000);
        }*/
        return distance;


    },
    getLongFormat: function (long) {
        /**
         * 对距离进行格式化
         */
        //格式化距离
        if (long > 1000) {
            return (long / 1000).toFixed(2) + 'km';
        } else {
            return long.toFixed(2) + 'm';
        }
    },
    dataInfo: {
        runkey: null
    },
    onShow(options) {
        // 从后台被 scheme 重新打开
        // options.query == {number:1}
    },
});
