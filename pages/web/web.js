Page({
  data: {
    websrc: '',
  },
  onUnload() {
    api.uploadBehavior({ data: { openid: this.data.userInfo.openid, mode: "uninstpage", query: this.data.options, path: '/pages/web/web' } });
  },
  onLoad(options) {
    this.setData({
      options: options,
      websrc: options.url
    })
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/web/web' } });
        _this.setData({
          userInfo: userinfo
        })
      } else {
        api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/web/web' } });
      }
    })
  },
});
