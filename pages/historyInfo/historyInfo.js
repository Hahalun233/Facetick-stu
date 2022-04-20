import myrequest from "../../utils/request"

// pages/historyInfo/historyInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        className: "课程名",
        time: "时间",
        courseId: null,
        token: null,
        classRoom: "教室",
        result:false,
        end:null,
        id:null,
        appeal:"未申诉",
    },

    showAppealPop() {
        wx.showModal({
          title:'即将向任课老师发出申诉申请',
          content:'请确认已和老师提前沟通',
          success:(res)=>{
              if(res.confirm){
                //  确认
                var url = "/record/problem/"+ this.data.id
                myrequest.get(url,{},{token:this.data.token}).then(res=>{
                    if(res.code==200){
                        wx.showToast({
                          title: '申诉成功',
                        })
                    }else{
                        wx.showToast({
                            title: '申诉失败',
                          })
                    }
                })
              }else{
                  //取消
              }
          }
        })
    },
   

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.result)
        this.setData({
            token: wx.getStorageSync('token'),
            courseId: options.courseId,
            className: options.className,
            time: options.time,
            classRoom: options.classRoom,
            id:options.courseId,
            
            
        })
        if(options.result=='1'){
            
            this.setData({
                result: true,
                end: "已到"
            })
        }
        if(options.result=='2'){
            
            this.setData({
                result: false,
                appeal:"已申诉"
            })
        }
        if(options.result=='0'){
            
            this.setData({
                result: false,
                end: "未到"
            })
        }
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