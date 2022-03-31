// pages/home/home.js
import myrequest from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否弹出完善信息界面
    showGetInfo: false,
    //图片路径
    fileList:[],
    //学生名
    stuName: null,
    //学号
    stuNo: null,
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

    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'http://192.168.43.188:8085/api/v1/sd/face/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'filePic',
      formData: {},
      header: {
        'token': wx.getStorageSync('token')
      },
      success: (res) => {
       

        let url = 'fileList[0].url'
        let isImage = 'fileList[0].isImage'
        this.setData({
          [url]:res.data,
          [isImage]:true
        })
        // 上传完成需要更新 fileList
        // const { fileList = [] } = this.data;
        // fileList.push({ ...file, url: res.data });
        // this.setData({ fileList });
      },
    });
  },



  upLoadInfo() {

    var token = wx.getStorageSync('token')
    if(this.data.stuName==null||this.data.stuNo==null){
      wx.showToast({
        title: '请完善个人信息',
        duration: 1500,
        icon: 'error',
      })
    }else(

      myrequest.post("/url",{
        url:this.data.filePath,
        name:stuName,
        number:stuNo
      },{
        token:token
      }).then(res=>{
        if(res.code==200){
          wx.showToast({
            title: '添加成功',
            duration: 1500,
            icon: 'success',
            image: 'image',
          })
          this.setData({
            showGetInfo:false
          })
        }
      })
    )

    


    
  },


  onChangeNo(event) {
    // event.detail 为当前输入的值
    this.setData({
      stuNo: event.detail
    })
  },


  onChangeName(event) {
    // event.detail 为当前输入的值
    this.setData({
      stuName: event.detail
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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