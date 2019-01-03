const app = getApp();
import api from '/libs/api'

Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    userInfo: {},
    userAccount: {},
    page: 1,
    havenext: true,
    dataList: []
  },
  onScrollToLower() {
    //开始拉取积分商城数据
    if (!this.data.havenext) {
      return false;
    }
    this.data.page++;
    api.getFinancialflow(this.data.userInfo.openid, this.data.page, function(dataList) {
      console.log(dataList)
      if (dataList) {
        if (dataList.length < 30) {
          _this.setData({
            havenext: false
          })
        }
        var dataListTmp = this.data.dataList.concat(dataList);
        _this.setData({
          page: this.data.page++,
          dataList: dataListTmp
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
        api.getFinancialflow(userinfo.openid, _this.data.page, function(dataList) {
          if (dataList) {
            if (dataList.length < 30) {
              _this.setData({
                havenext: false
              })
            }
            _this.setData({
              page: _this.data.page++,
              dataList: dataList
            })
          }
        })
      }
    })
  },
});
