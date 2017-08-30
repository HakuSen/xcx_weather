//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    basicdata:{},
    future:{},
    city:'',
    weatherstate:''
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
          url: 'https://v.juhe.cn/weather/index',
          data: {
            cityname: res.data.result.addressComponent.city,
            key: '4875a2834124a91a2acda3b5b1808a88'
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            var weekWeather = [];
            var data = res.data.result.future
            for (var i in data){
              var str = data[i];
              weekWeather.push(str)
            }
            console.log(weekWeather);
            var weatherstate = that.skyVal(res.data.result.today.weather)[1];  //图标转换
            that.setData({
              basicdata: res.data.result,
              future: weekWeather,
              weatherstate: weatherstate
            })
          }
        })

      }
    })
  },
  //判断Skycons取值
  skyVal: function (e) {
    let x, y;
    switch (e) {
      case '晴':
        x = '晴';
        y = 'icon-weather';
        break;
      case '阴':
        x = '阴';
        y = 'icon-yin';
        break;
      case '小雨':
        x = '小雨';
        y = 'icon-weatherrainy';
        break;
      case '小雨转阴':
        x = '小雨转阴';
        y = 'icon-weathercloudy';
        break;
      case '中雨转小雨':
        x = '中雨转小雨';
        y = 'icon-yin';
        break;
      case '中雨':
        x = '中雨';
        y = 'icon-weatherrainy';
        break;
      case '小雨转多云':
        x = '小雨转多云';
        y = 'icon-tianqizitiku33';
        break;
      case '多云转晴':
        x = '多云转晴';
        y = 'icon-weather';
        break;
      case '风':
        x = '风';
        y = 'icon-weatherwindy';
        break;
      case '雾':
        x = '雾';
        y = 'icon-weatherfog';
        break;
      case '霾':
        x = '霾';
        y = 'icon-maihaze';
        break;
    }
    return [x, y];
  },
  onLoad: function () {
    this.basicData()
  }
})
