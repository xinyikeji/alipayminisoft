const newitems = [
  {
    title: '2018年01月',
    sticky: true,
  },
  {
    title: '和合谷阜成门店',
  },
  {
    title: '标题文字换行',

  },
  {
    title: '标题文字',

  },
  {
    title: '标题文字很',
  },
  {
    title: '标题文字',

  },
  {
    title: '标题文字',
  },
  {
    title: '标题文字很',
  },
  {
    title: '标题文字',
  },
  {
    title: '标题文字很',
  },
  {
    title: '标题文字长',
  },
  {
    title: '标题文字',
  },
  {
    title: '标题文字长',
  },
  {
    title: '标题文字很长',
  },
];

Page({
  data: {
    windowHeight:44,
    items5: [
      {
        title: '2018年02月',
        sticky: true,
      },
      {
        title: '小杨生煎XX点',
        extra: '109.00',
      },
      {
        title: '标题文字换行长',
         extra: '109.00',
      },
      {
        title: '标题文字很长',
         extra: '109.00',
      },
      {
        title: '标题文字很',
         extra: '109.00',
      },
      {
        title: '标题文字换行',
         extra: '109.00',
      },
      {
        title: '标题文字很长',
         extra: '109.00',
      },
      {
        title: '标题文字很长',
         extra: '109.00',
      },
      {
        title: '标题文字换长',
         extra: '109.00',
      },
      {
        title: '标题文字很长',
         extra: '109.00',
      },
      {
        title: '标题文字很长长',
         extra: '109.00',
      },
      {
        title: '标题文字换很长',
         extra: '109.00',
      },
      {
        title: '标题文字很',
         extra: '109.00',
      },
      {
        title: '标题文字很',
         extra: '109.00',
      },
    ],
  },
  onLoad(){
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
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