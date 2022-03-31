// pages/myClass/myClass.js
import myrequest from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //搜索内容
        value: '',
        //班级列表
        classList: [],
        //节流阀
        isloading: false,
        //请求目标开始页数
        pageNumber: 1,
        //是否弹出添加班级界面
        showAddClass: false,
        //登陆状态
        isLogin: false,
        //是否是最后一页
        isLast: false,
    },


    //刷新班级列表
    refrashClass() {
        //若没有登录，拒绝请求数据
        if (this.isLogin) {
            wx.showToast({
                title: '请先登录',
                duration: 1500,
                icon: 'error',
            })
            return
        }

        this.setData({
            //开始加载
            isloading: true
        })
        const token = wx.getStorageSync('token')
        const url = "/course/list/" + this.data.pageNumber + "/8"
        myrequest.get(url, {}, {
            'token': token
            //sucess
        }).then(res => {



            this.setData({
                classList: res.data.courses
            })
            this.setData({
                isloading: false
            })
        })
    },

    changeLogin() {

        this.setData({
            isLogin: true
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
        const token = wx.getStorageSync('token')
        if (token !== '') {
            myrequest.get("/isactive", {}, {
                'token': token
            }).then(res => {
                //账号在线
                if (res.code == 200) {
                    this.setData({
                        isLast:false
                    })
                    this.changeLogin();
                }
            })
        }
        this.refrashClass()
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