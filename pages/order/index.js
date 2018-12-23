const app = getApp();
import php from '/libs/php'
import http from '/libs/http'
Page({
  data: {
    loading: true,
    hasnext: true,
    userInfo: {},
    page: 1,
    pagesize: 30,
    year: php.date('Y'),
    windowHeight: 44,
    orderlist: []
  },
  onLoad() {
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    var _this = this;
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        _this.setData({
          userInfo: userinfo
        })
        //开始拉取用户基本数据
        _this.getOrderList();
      }
    })
  },
  getOrderList() {
    var _this = this;
    http.post({
      openid: this.data.userInfo.openid,
      page: this.data.page,
      page_size: this.data.pagesize,
      year: this.data.year,
      method: "member.OpenUser.getOrderlist",
    }, function(status, rest) {
      if (status && rest.data.code === 1) {
        _this.setData({
          loading: false,
          orderlist: rest.data.data,
          hasnext: (rest.data.data.length == 30)
        })
      }
    })
  },
  onScrollToLower() {
    const { items5 } = this.data;
    const newItems = items5.concat(newitems);
    console.log(newItems.length);
    this.setData({
      items5: newItems,
    });
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handlePlusClick() {
    my.alert({
      content: 'plus clicked',
    });
  },
});