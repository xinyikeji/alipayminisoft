import api from '/libs/api'
const app = getApp();
Page({
    data: {
        merchantName: '', //商户名称
        logo: '', //商户LOGO
        loginCode: '', //登陸code
        loginWay: 'oneKey', //默认 oneKey：一键登录 ，phone:手机号登录，account:账号密码登录
        phone: '',
        smsVode: 0,
        vcode_text: '获取验证码',
        isAgree: true
    },
    onLoad() {
        this.getLoginCode();
    },
    /**
     * 手机号输入失去焦点
     * @param {*} e 
     */
    onInputPhoneBlur(e) {
        this.setData({
            phone: e.detail.value
        });
        console.log(e);
    },
    /**
     * 获取登录CODE
     */
    getLoginCode() {
        let _this = this;
        my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
                _this.setData({
                    loginCode: res.authCode,
                })
            },
        });
    },

    /**
		 * 切换登录方式
		 */
    switchLoginWay(e) {
        console.log(e);
        my.setNavigationBar({
            title: e.currentTarget.dataset.text
        });

        this.setData({
            loginWay: e.currentTarget.dataset.type
        })
    },
    /**
     * 账号密码登录
     */
    accountLogin(e) {
        let _this = this;

        my.showLoading({
            content: '登录中...',
        });

        api.fnAccountLogin({
            code: _this.data.loginCode,
            account: e.detail.value.user,
            password: e.detail.value.pass,
            success(rest) {
                console.log(rest);
                _this.toBack();
            },
            fail(err) {
                my.hideLoading();
                console.log(err);
                if (typeof err !== 'undefined') {
                    my.alert({
                        title: '错误',
                        content: err.msg,
                        buttonText: '我知道了',
                    });
                }
                 _this.getLoginCode();

            }
        });
    },
    /**
		 * 发送短信验证码
		 */
    sendSmsVerifiCode(e) {
        let _this = this;
        if (_this.data.vcode_text !== '获取验证码') {
            return false;
        }
        my.showLoading({
            content: '请求中...',
        });
        api.fnSendSmsVerifiCode({
            phone: this.data.phone,
            type: 5,
            success(rest) {
                my.hideLoading();
                console.log(rest);
                _this.setData({
                    smsVode: rest.smscode,
                    vcode_text: 60,
                });

                let setIntVCode = setInterval(function () {
                    _this.setData({
                        vcode_text: Number(_this.data.vcode_text) - 1,
                    });

                    if (_this.data.vcode_text == 0) {
                        _this.setData({
                            vcode_text: '获取验证码',
                        });

                        clearInterval(setIntVCode);
                    }
                }, 1000);
                my.showToast({
                    type: 'success',
                    content: '发送成功',
                    duration: 1500,
                })
            },
            fail(err) {
                console.log(err);
                my.hideLoading();
                my.alert({
                    title: '错误',
                    content: err.msg,
                    buttonText: '我知道了',
                });
                 _this.getLoginCode();
            }
        });
    },
    /**
     * 手机号登录
     */
    phoneLogin(e) {
        let _this = this;

        console.log(e);
        let phone = e.detail.value.phone;
        let vcode = e.detail.value.vcode;
        let ret = /^1\d{10}$/;
        if (!ret.test(phone)) {
            my.showToast({

                content: '手机号输入错误',
                duration: 1500,

            });

            return false;
        }
        if (vcode !== _this.data.smsVode && _this.data.smsVode == 0) {
            my.showToast({
                content: '验证码输入错误',
                duration: 1500,
            });
            return false;
        }
        my.showLoading({
            content: '请求中...',
        });
        api.fnPhoneLogin({
            phone: phone,
            code: _this.data.loginCode,
            verify_code: vcode,
            success(rest) {
                _this.toBack();
            },
            fail(err) {
                my.hideLoading();
                my.alert({
                    title: '错误',
                    content: err.msg,
                    buttonText: '我知道了',
                });
                _this.getLoginCode();
            }
        });
    },

    /**
     * 获取用户手机号一键登录
     * @param e
     */
    oneKeyLogin(e) {
        let _this = this;
        my.showLoading({
            content: '登录中...',
        });

        my.getPhoneNumber({
            success: (res) => {
                console.log(res);

                //根据手机号加密数据进行注册并登录
                api.fnOneKeyLogin({
                    encryptedData: res.response,
                    iv: res.sign,
                    code: _this.data.loginCode,
                    success(userInfo) {
                        _this.toBack();
                    },
                    fail(err) {
                        my.hideLoading();
                        console.log('err', err);
                        _this.getLoginCode();
                        my.alert({
                            title: '错误',
                            content: err.msg,
                            buttonText: '我知道了',
                        });
                    }
                });
            },
            fail: (err) => {
                my.hideLoading();
                console.log(err)
                _this.getLoginCode();
                my.alert({
                    title: '错误',
                    content: err.msg,
                    buttonText: '我知道了',
                });
                console.log('getPhoneNumber_fail')
            },
        });


    },

    toBack() {
        let _this = this;
        app.getUserInfo(function (res) {
            console.log(res);
            my.hideLoading();
            my.showToast({
                type: 'success',
                content: '登录成功',
                duration: 1500,
                success: () => {
                    let pages = getCurrentPages();
                    console.log(pages, 'getCurrentPages');
                    if (pages.length == 1) {
                        my.redirectTo({
                            url: '/pages/index/index'
                        });
                    } else {
                        console.log(pages);
                        //返回上一页
                        my.navigateBack({
                            delta: 1
                        });
                    }
                },
            });
        });


    }

});
