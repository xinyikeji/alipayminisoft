import http from '/libs/http'

Page({
  data: {
    loading: true,
    windowHeight: 80,
    storeData: {

    },
    goodsData: {

    },
    clickgooddnumber:1,
    value: 9,
    activeTab: 0,
    tabs: [
      { title: '生煎', anchor: 'a', badgeType: 'dot' },
      { title: '汤品', anchor: 'b', badgeType: 'text', badgeText: '新' },
      { title: '小吃', anchor: 'c' },
    ],
    items5: [
      {
        title: "分类",
        brief: '描述信息',
        arrow: true,
        sticky: true,
      },
      {
        thumb: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
        title: '标题文字不标题文字不标题文字不',
        price: "10.22",
        brief: '描述信息',
        align: 'middle',
      },
      {
        thumb: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
        title: '标题字换行',
        price: "10.22",
        brief: '测试',
        align: 'top',
      },
      {
        title: '标题文字不',
        brief: '描述信息',
        price: "10.22",
        align: 'middle',
      },
      {
        title: '标题字换行',
        brief: '测试',
        price: "10.22",
        align: 'top',
      },
      {
        title: '标题文字不',
        brief: '描述信息',
        price: "10.22",
        align: 'middle',
      },
      {
        title: '标题字换行',
        brief: '测试',
        price: "10.22",
        align: 'top',
      },
    ],
  },
  handleChange(index) {
    this.setData({
      activeTab: index,
    });
  },
  onChange(index) {
    console.log('onChange', index);
    this.setData({
      activeTab: index,
    });
  },
  onLoad(query) {
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    //判断是否已经授信

    //加载商品数据和门店数据

  },
  getGoodsData() {
    // 获取数据

  },
  callBackFn(value) {
    console.log(value);
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
