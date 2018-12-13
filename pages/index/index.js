Page({
  data: {
    title: "尊敬的用户",
    subTitle: "欢迎使用自助点餐服务，请扫码进行点餐！",
    messageButton: {
      mainButton: {
        buttonText: "扫码点餐"
      }
    }
  },
  showQrcode() {
    my.navigateTo({
      url: '../z/ol?id=1&t=100'
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
