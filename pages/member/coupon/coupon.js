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
    showUserCoupon:[],
    isShow:false
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
  onLoad(options) {
    var _this = this;
    app.getUserInfo(function(userinfo) {
      if (userinfo) {
        //开始拉取用户基本数据
        api.getUserAccount(userinfo.openid, function(userAccount) {
          if (userAccount) {
            _this.setData({
              userAccount: userAccount
            })
            // console.log(_this.data.userAccount)
            let usercoupon = _this.data.userAccount.usercoupon;
            let coupons0 = []
            let coupons1 = []
            let coupons2 = []
            for(let i = 0; i < usercoupon.length; i++){
              let currentdate = new Date()
              let enddate = new Date(Date.parse(usercoupon[i].enddate.replace(/-/g,"/")));
              if(usercoupon[i].status == 1 && enddate - currentdate > 0){
                // 如果未使用
                coupons0.push(usercoupon[i]);
              } else if (enddate - currentdate < 0) {
                // 如果已过期
                coupons1.push(usercoupon[i]);
              }else if (usercoupon[i].status == 2){
                // 如果已使用
                coupons2.push(usercoupon[i]);
              } else {
                console.log("不属于三种类型")
              }
            }
            _this.setData({
              showUserCoupon:coupons0,
              coupons0:coupons0,
              coupons1,
              coupons2,
            })
          }
        })
      }
    }) 
  }
})
