import api from '/libs/api'
import php from '/libs/php'
const app = getApp();

Page({
  data: {
    onshow: false,
    loading: true,
    brand: 'iphone',
    orderList: [],
    userInfo: '',
    options: ''
  },
  onUnload() {
    api.uploadBehavior({ data: { openid: this.data.userInfo.openid, mode: "uninstpage", query: this.data.options, path: '/pages/takemeals/takemeals' } });
  },
  onLoad(options) {
    let _this = this;
    this.options = options
    // // 判断是否登录
    // const UserCache = my.getStorageSync({
    //   key: 'userinfo', // 缓存数据的key
    // });
    // console.log("取餐列表的userinfo-onLoad时", UserCache)
    // if (UserCache.data === null) {
    //   my.alert({
    //     title: '提示',
    //     content: '你还没有登录，请登录~',
    //     success() {
    //       my.navigateTo({
    //         url: '/pages/login/login'
    //       })
    //     }
    //   })
    //   return false;
    // }

    my.showLoading({
      content: "加载中.."
    });
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          brand: res.brand.toLowerCase()
        })
      },
    });
    app.getUserInfo(function (userinfo) {
      if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/takemeals/takemeals' } });
        _this.setData({
          onshow: true,
          options: options,
          userInfo: userinfo
        })
        _this.reloadData();
      } else {
        api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/takemeals/takemeals' } });
      }
    })
  },
  onShow() {
    let _this = this;
    let options = this.options
    // 判断是否登录
    const UserCache = my.getStorageSync({
      key: 'userinfo', // 缓存数据的key
    });
    console.log("取餐列表的userinfo-onShow时", UserCache)
    if (!UserCache.data || typeof UserCache.data == undefined) {
      my.alert({
        title: '提示',
        content: '你还没有登录，请登录~',
        success() {
          my.navigateTo({
            url: '/pages/login/login'
          })
        }
      })
      return false;
    }

    app.getUserInfo(function (userinfo) {
      if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/takemeals/takemeals' } });
        _this.setData({
          onshow: true,
          options: options,
          userInfo: userinfo
        })
        _this.reloadData();
      } else {
        api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/takemeals/takemeals' } });
      }
    })
  },
  onPullDownRefresh() {
    this.reloadData();
  },
  setOrderComplete(event) {
    my.showLoading({
      content: "处理中...",
    });
    var _this = this;
    var index = event.currentTarget.dataset.index;
    api.setOrderComplete({
      storeid: this.data.orderList[index].storeid,
      orderno: this.data.orderList[index].orderno,
      price: this.data.orderList[index].price,
      success: (res) => {
        my.hideLoading();
        _this.reloadData();
        // console.log(res)
      }
    })
  },
  reloadData() {
    var _this = this;
    api.getOrderList({
      openid: _this.data.userInfo.openid,
      year: php.date('Y'),
      isfinish: 0,
      success: (res) => {
        my.stopPullDownRefresh();
        my.hideLoading();
        _this.setData({
          loading: false,
          orderList: res
        })
      }
    })
  },
});
