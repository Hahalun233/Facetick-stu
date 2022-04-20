// pages/history/history.js
import myrequest from "../../utils/request";
Page({

    /**
     * 页面的初始数据
     */
    data: {

        show: true,


        //判断登录状态
        isLogin: false,
        //
        classList: [],
        //请求目标开始页数
        pageNumber: 1,
        //是否是最后一页
        isLast: false,
       



    },

    requestSubscribeMessage() {
        wx.requestSubscribeMessage({
            tmplIds: ['mGxTggVFi7YwmiTbVhQAEMa1Bv9EmVcXHOeL3HOPvnc'],
            success(res) {
                console.log("可以给用户推送一条通知了。。。", res);
            }
        })
    },



    onGetUserInfo() {

        //顺序执行
        setTimeout(() => {

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

            })
            setTimeout(() => {
                this.reFreshClass()
            }, 2000)

        }, 1000)





        this.onClose()


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
        const token = wx.getStorageSync('token')
        if (token !== '') {
            myrequest.get("/isactive", {}, {
                'token': token
            }).then(res => {
                //账号在线
                if (res.code == 200) {
                    this.changeLogin();
                }
            })

        }
    },


    getClass() {
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
        const url = "/record/list/" + this.data.pageNumber + "/8"
        myrequest.get(url, {}, {
            token: token
        }).then(res => {
            console.log(res)
            console.log(this.data.pageNumber)
            if (res.data.hasNextPage == false) {
                this.setData({
                    isLast: true
                })
            }

            const newClassList = this.data.classList.concat(res.data.list)


            this.setData({
                classList: newClassList
            })

           
        })

    },

    reFreshClass() {
     
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
            isloading: true,
            pageNumber: "1"
        })
        const token = wx.getStorageSync('token')
        const url = "/record/list/" + this.data.pageNumber + "/8"
        myrequest.get(url, {}, {
            token: token
        }).then(res => {
            console.log(res)
            this.setData({
                classList: res.data.list
            })
           
        })

    },



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


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (this.data.token == "") {
            const token = wx.getStorageSync('token')

            this.setData({
                token: token
            })
        }



        this.reFreshClass()
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
        if (this.data.isLast == true) {
            return
        }
        this.setData({

            pageNumber: parseInt(this.data.pageNumber) + parseInt(1),

        })

        this.getClass()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})