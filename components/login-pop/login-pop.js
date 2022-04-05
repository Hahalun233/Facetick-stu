import myrequest from "../../utils/request";

// components/login-pop/login-pop.js
Component({



  /**
   * 组件的属性列表
   */
  properties: {


  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup() {
      this.setData({
        show: true
      });
    },

    onClose() {
      this.setData({
        show: false
      });
    },



    onGetUserInfo() {
      wx.showLoading({
        title: '正在登录',
      })

      wx.login({
        timeout: 3000,
        success: login_res => {
          // 2. 小程序通过wx.request()发送code到开发者服务器
          myrequest.post("/login", {
            code: login_res.code, //临时登录凭证
            
          }, {
            'content-type': 'application/x-www-form-urlencoded'
          }).then(hres => {
            if (hres.code == 200) {
              // 7.小程序存储skey（自定义登录状态）到本地
              wx.setStorageSync('token', hres.data.token);
            } else {
              console.log('服务器异常');
              wx.showToast({
                title: '登录失败',
                duration: 1500,
              })
            }
            wx.showToast({
              title: '登录成功',
              duration: 1500,
            })
          })
        },
        fail: res => {

        }
      })


      this.onClose()
     

    },
  }
})