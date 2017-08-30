//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    basicdata:{},
    future:{},
    city:''
  },
  //get basci data
  basicData:function(){
    let that = this;
    //小程序获取坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude + ',' + longitude)
        that.loadCity(longitude, latitude)
      }
    })
  },
  //百度地图api获取city名称
  loadCity: function (longitude, latitude) {
    var that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=m5VfddjUAHr0U80TwMz5GBt27co0BEmY&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success  
        console.log(res);
        that.setData({ 
          city: res.data.result.addressComponent.city
        });

        //小程序获取接口数据
        wx.request({
          url: 'http://v.juhe.cn/weather/index',
          data: {
            cityname: res.data.result.addressComponent.city,
            key: '4875a2834124a91a2acda3b5b1808a88'
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            that.setData({
              basicdata: res.data.result,
              future: res.data.result.future
            })
          }
        })

      }
    })
  },
  onLoad: function () {
    this.basicData()
  }
})
