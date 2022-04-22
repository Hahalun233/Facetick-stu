// pages/home/home.js
import myrequest from "../../utils/request";
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否弹出完善信息界面
    showGetInfo: false,
    //图片路径
    fileList: [],
    //学生名
    stuName: null,
    //学号
    stuNo: null,
    //班级id
    classId: null,

    showLogin: false,
    token: null
  },
  //弹出层功能
  showPopup() {
    this.setData({
      showGetInfo: true
    });
  },
  onClose() {
    this.setData({
      showGetInfo: false
    });
  },


  afterRead(event) {
    var url = getApp().globalData.baseurl;
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({

      url: url + '/face/upload',
      filePath: file.url,
      name: 'filePic',
      formData: {},
      header: {
        token: wx.getStorageSync('token')
      },
      success: (res) => {


        let url = 'fileList[0].url'
        let isImage = 'fileList[0].isImage'
        this.setData({
          [url]: res.data,
          [isImage]: true
        })
        // 上传完成需要更新 fileList
        // const { fileList = [] } = this.data;
        // fileList.push({ ...file, url: res.data });
        // this.setData({ fileList });
      },
    });
  },

  //取消上传
  delete(event) {
    this.setData({
      fileList: []
    })
  },

  upLoadInfo() {

    var token = wx.getStorageSync('token')
    if (this.data.stuName == null || this.data.stuNo == null) {
      wx.showToast({
        title: '请完善个人信息',
        duration: 1500,
        icon: 'error',
      })
    } else(

      myrequest.post("/student/profile", {
        url: this.data.fileList[0].url,
        name: this.data.stuName,
        number: this.data.stuNo
      }, {
        token: token
      }).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '添加成功',
            duration: 1500,
            icon: 'success',
            image: 'image',
          })
          this.onClose();
        }
      })
    )





  },

  showLoginPopup() {
    this.setData({
      showLogin: true
    })
  },

  onCloseLogin() {
    this.setData({
      showLogin: false
    })
  },


  onGetUserInfo() {
    wx.showLoading({
      title: '正在登陆',
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


    this.onCloseLogin()


  },

  onChangeNo(event) {
    // event.detail 为当前输入的值
    this.setData({
      stuNo: event.detail
    })
  },


  onStuChangeName(event) {
    this.setData({
      stuName: event.detail
    })
  },

  onScanCode() {
    var courseId
    var token = wx.getStorageSync('token')
    wx.scanCode({

      success: res => {

        courseId = res.result
        var url = '/course/name/' + res.result
        myrequest.get(url, {}, {
          token: token
        }).then(res => {
            wx.showModal({
              title: '提示',
              content: '是否加入 ' + res.data.teacher + ' 的 ' + res.data.name,
              success: function (res) {
                if (res.confirm) {
                  var url = '/course/join/' + courseId
                  myrequest.get(url, {}, {
                    token: token
                  }).then(res => {
                    if (res.code == 200) {
                      wx.showToast({
                        title: '加入成功',
                      })
                    }
                    console.log(res)
                  })
                } else {
                  console.log('取消')
                }
              }

            })


          }

        )


      }
    })

  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: wx.getStorageSync('token')
    })

    var url = "/student/profile"
    myrequest.get(url, {}, {
      token: this.data.token
    }).then(res => {
      if (res.code == "200") {                           
        console.log("info", res)
        this.setData({
          fileList: res.data.avatar,
          stuName: res.data.name
        })
      }

    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})