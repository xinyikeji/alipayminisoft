Page({
  data: {
    thumb: 'https://tfsimg.alipay.com/images/partner/T12rhxXkxcXXXXXXXX',
    list3: [
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
        text: '￥878.98',
        desc: '账户余额',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
        text: '7683',
        desc: '积分余额',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
        text: '5',
        desc: '优惠券码',
      }
    ],
    itemsThumbMultiple: [
      {
        thumb: 'https://paimgcdn.baidu.com/2C6E14EAB0EDF738?src=http%3A%2F%2Fms.bdimg.com%2Fdsp-image%2F1393641007.jpg&rz=urar_2_968_600&v=0',
        title: 'iPad',
        brief: '积分：80000',
      },
      {
        thumb: 'https://paimgcdn.baidu.com/30DD4CE04E61E7F?src=http%3A%2F%2Fms.bdimg.com%2Fdsp-image%2F1420530446.png&rz=urar_2_968_600&v=0',
        title: 'iPone xs max',
        brief: '积分：180000',
      },
      {
        thumb: 'https://i8.mifile.cn/b2c-mimall-media/24b7f3c26569ea91b68551f32109dcb1.jpg',
        title: '小米手机',
        brief: '积分：8000',
      },
    ],
  },
  onCardClick: function(ev) {
    my.navigateTo({
      url:"info/info"
    });
  }
});
