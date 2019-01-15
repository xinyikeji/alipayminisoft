const app = getApp();
import api from '/libs/api'

Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    userInfo: {},
    userAccount: {},
    page: 1,
    integralData: []
  },
  onScrollToLower() {
    //开始拉取积分商城数据
    this.data.page++;
    api.getIntegralList(this.data.userInfo.openid, this.data.page, function(integralList) {
      console.log(integralList)
      if (integralList) {
        var integralListData = this.data.integralList.concat(integralList);
        _this.setData({
          page: this.data.page++,
          integralList: integralListData
        })
      }
    })
  },
  onUnload() {
    api.uploadBehavior({ data: { openid: this.data.userInfo.openid, mode: "uninstpage", query: this.data.options, path: '/pages/member/integral/integral' } });
  },
  onLoad(options) {
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    var _this = this;
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/member/integral/integral' } });
        _this.setData({
          userInfo: userinfo,
          options: options
        })
        //开始拉取积分
        api.getIntegralList(userinfo.openid, _this.data.page, function(integralList) {
          if (integralList) {
            _this.setData({
              page: _this.data.page++,
              integralList: integralList
            })
          }
        })
      } else {
        api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/member/integral/integral' } });
      }
    })
  },
});
