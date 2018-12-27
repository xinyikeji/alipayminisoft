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
  onLoad() {
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
        _this.setData({
          userInfo: userinfo
        })
        //开始拉取积分商城数据
        api.getIntegralList(userinfo.openid, _this.data.page, function(integralList) {
          if (integralList) {
            _this.setData({
              page: _this.data.page++,
              integralList: integralList
            })
          }
        })
      }
    })
  },
});
