import http from '/libs/http'

Page({
  data: {
    loading: true,
    windowHeight: 80,
    storeData: {

    },
    goodsData: {

    },
    activeTab: 2,
    tabs: [
      { title: '生煎', anchor: 'a', badgeType: 'dot' },
      { title: '汤品', anchor: 'b', badgeType: 'text', badgeText: '新' },
      { title: '小吃', anchor: 'c' },
      { title: '选项四', anchor: 'd' },
      { title: '选项五', anchor: 'e' },
      { title: '选项六', anchor: 'f' },
      { title: '选项六1', anchor: '1f' },
      { title: '选项六2', anchor: '2f' },
      { title: '选项六3', anchor: '3f' },
      { title: '选项六1', anchor: '11f' },
      { title: '选项六21', anchor: '21f' },
      { title: '选项六32', anchor: '32f' },
      { title: '选项六43', anchor: '43f' },
    ],
    items5: [
      {
        title: '固定到头部',
        brief: '描述信息',
        arrow: true,
        sticky: true,
      },
      {
        title: '标题文字不换行很长很长很长很长很长很长很长很长很长很长',
        arrow: true,
        align: 'middle',
      },
      {
        title: '标题文字换行很长很长很长很长很长很长很长很长很长很长',
        arrow: true,
        align: 'top',
      },
      {
        title: '标题文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        extra: '没有箭头',
        align: 'bottom',
      },
      {
        title: '标题文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        extra: '子元素垂直对齐',
        align: 'top',
      },
      {
        title: '标题文字换行很长很长很长很长很长很长很长很长很长很长',
        arrow: true,
      },
      {
        title: '标题文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        extra: '没有箭头',
      },
      {
        title: '标题文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        extra: '子元素垂直对齐',
        align: 'top',
      },
      {
        title: '标题文字换行很长很长很长很长很长很长很长很长很长很长',
        arrow: true,
      },
      {
        title: '标题文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        extra: '没有箭头',
      },
      {
        title: '标题文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        extra: '子元素垂直对齐',
        align: 'top',
      },
      {
        title: '标题文字换行很长很长很长很长很长很长很长很长很长很长',
        arrow: true,
      },
      {
        title: '标题文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        extra: '没有箭头',
      },
      {
        title: '标题文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        extra: '子元素垂直对齐',
        align: 'middle',
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
    my.setNavigationBar({
      title:"XXX门店",
      success: (res) => {
        
      },
    });

    console.log(http)
    //判断是否已经授信

    //加载商品数据和门店数据

  },
  getGoodsData() {
    // 获取数据

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
