// pages/mycoupons/detail.js
var app = getApp();
import api from '/libs/api';

// var coupontype;
Page({
  data: {
    icon: '',
    title: '',
    background: '',
    starttime: '',
    endtime: '',
    qrcode: '',
    brcode: '',
    loading: true,
    userInfo:{},
    options:{},
  },
  onUnload: function () {
  },
  onLoad: function (options) {
    let _this = this;
    // console.log(options);
    this.setData({
      options:options
    })
    
    // 获取用户信息
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/member/coupon' } });
        _this.setData({
          userInfo: userinfo
        })
      } else {
        api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/member/coupon' } });
      }
    })

    // 获取会员码详情
    // console.log(this.data.userInfo.openid)
    // console.log(options.id)
    // console.log(options.type)
    api.getCouponDetail(_this.data.userInfo.openid, options.id, options.type, function(status,res){
      console.log(status,res)
     if (res.status == 200 && status == true) {
          //因为本地不存储支付相关的配置，接口必须返回以下参数timeStamp，nonceStr，package，signType，paySign
          if(res.data.data.status!='1'){
            my.alert({
              title: '温馨提示',
              content: '您已经使用过这张券了，请换张使用哦！',
              showCancel:false,
              confirmText: "确定",
              success: function (res) {
                if (res.confirm) {
                  my.navigateBack({
                    delta: 1
                  })
                }
              }
            });
          }else{
            // 获取二维码和条形码
            _this.setData({
              icon: res.data.data.icon,
              title: res.data.data.title,
              background: res.data.data.background,
              starttime: res.data.data.starttime,
              endtime: res.data.data.endtime,
              loading: false,
              qrcode: 'http://api.yunshouyin.com.cn/open/qrcode?text=' + res.data.data.code,
              brcode: 'http://api.yunshouyin.com.cn/open/barcode?text=' + res.data.data.code
            })
          }
        } else {
          my.alert({
            title: '哎呀出错了！',
            content: '现金券加载出错了，是否重试？',
            confirmText: "再试试",
            cancelText: "不试了",
            success: function (res) {
              if (res.confirm) {
                _this.loadData();
              } else {
                my.navigateBack({
                  delta: 1
                })
              }
            }
          });
        }
    })
  },
})
