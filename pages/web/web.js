Page({
  data: {
    websrc: '',
  },
  onLoad(option) {
    this.setData({
      websrc: option.url
    })
  },
});
