const app = getApp();
import api from '/libs/api'

Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    userInfo: {},
    tabs: [
      {
        title: '未使用',
      },
      {
        title: '已过期',
      },
      { title: '已使用',
      },
    ],
    coupons0:[],
    coupons1:[],
    coupons2:[],
    activeTab: 0,
    userAccount: {},
    showUserCoupon:[]
  },
  // 切换优惠券状态
  handleTabClick({ index }) {
    let coupons = [
      this.data.coupons0,
      this.data.coupons1,
      this.data.coupons2
    ]
    this.setData({
      showUserCoupon:coupons[index],
      activeTab: index,
    });
  },
  onUnload() {
    api.uploadBehavior({ data: { openid: this.data.userInfo.openid, mode: "uninstpage", query: this.data.options, path: '/pages/member/coupon' } });
  },
  onLoad(options) {
    var _this = this;
    app.getUserInfo(function(userinfo) {
      // if (userinfo) {
        api.uploadBehavior({ data: { openid: userinfo.openid, mode: "instpage", query: options, path: '/pages/member/coupon' } });
        _this.setData({
          userInfo: userinfo
        })
        //开始拉取用户基本数据
        api.getUserAccount(userinfo.openid, function(userAccount) {
          if (userAccount) {
            _this.setData({
              userAccount: userAccount
            })
          }
          // console.log(_this.data.userAccount)
          let usercoupon = _this.data.userAccount.usercoupon;
          let currentdate = new Date()
          let coupons0 = []
          let coupons1 = []
          let coupons2 = []
          usercoupon.forEach((item,index)=>{
            let enddate = new Date(Date.parse(item.enddate.replace("-","/")));
            if(item.status == 1 && enddate - currentdate > 0){
              // 如果未使用
              coupons0.push(item);
            } else if (enddate - currentdate < 0) {
              // 如果已过期
              coupons1.push(item);
            }else if (item.status == 2){
              // 如果已使用
              coupons2.push(item);
            }
          })
          _this.setData({
            showUserCoupon:coupons0,
            coupons0,
            coupons1,
            coupons2,
          })
          // console.log(_this.data.coupons0,_this.data.coupons1,_this.data.coupons2)
        })
      // } else {
      //   api.uploadBehavior({ data: { mode: "instpage", query: options, path: '/pages/member/coupon' } });
      // }
    }) 
  }
})
