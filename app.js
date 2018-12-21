App({
  onLaunch(options) {
    //判断本地用户是否已经存在登陆信息
    //
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        my.alert({
          content: res.authCode,
        });
      },
    });

    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        my.getAuthUserInfo({
          success: (userInfo) => {
            my.alert({
              content: userInfo.nickName
            });
            my.alert({
              content: userInfo.avatar
            });
          }
        });
      },
    });

  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
