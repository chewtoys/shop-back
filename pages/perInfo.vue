<template>
  <div class="page">
    <img src="../static/img/bg.jpg" class="bg" alt>
    <el-card>
      <div slot="header" class="clearfix">
        <span>完善信息</span>
      </div>
      <el-form ref="form">
        <el-form-item label="店铺名称">
          <el-col :span="6">
            <el-input v-model="name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="店铺图标">
          <el-col :span="6" class="upImg">
            <img :src="showIcon" alt="">
      <input type="file" name="icon" @change="getFile($event)" ref="imgIcon">
          </el-col>
        </el-form-item>
        <el-form-item label="店铺分类" prop="region">
          <el-select v-model="type" placeholder="请选择店铺分类">
            <el-option 
              v-for="(item,idx) in typeList"
              :key="idx"
              :label="item.name"
              :value="idx"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送费用">
          <el-col :span="5">
            <el-input v-model="fee" type="number"></el-input>
          </el-col>
          <el-col :span="7" class="center">元(为0即商家免费配送)</el-col>
        </el-form-item>
        <el-form-item label="配送门槛">
          <el-col :span="5">
            <el-input v-model="full" type="number"></el-input>
          </el-col>
          <el-col :span="7" class="center">元(为0即商家免费配送)</el-col>
        </el-form-item>
        <el-form-item label="配送时间">
          <el-col :span="5">
            <el-input v-model="delivery" type="number"></el-input>
          </el-col>
          <el-col :span="7" class="center">分钟</el-col>
        </el-form-item>
        <el-form-item label="商家联系人">
          <el-col :span="6">
            <el-input v-model="owner"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商家联系电话">
          <el-col :span="6">
            <el-input v-model="tel"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商家所在城市">
          <el-col :span="6">
            <el-input v-model="city" @input="changeCity"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商家地址">
          <el-col :span="12">
            <el-input v-model="address"></el-input>
          </el-col>
        </el-form-item>
        <div class="amap-page-container">
          <el-amap-search-box
            class="search-box"
            :search-option="searchOption"
            :on-search-result="onSearchResult"
          ></el-amap-search-box>
          <el-amap
            vid="amapDemo"
            :center="mapCenter"
            :zoom="12"
            class="amap-demo"
            style="width: 100%;height:300px;"
          >
            <el-amap-marker v-for="(marker,idx) in markers" :key="idx" :position="marker"></el-amap-marker>
          </el-amap>
        </div>
        <el-form-item label="商家地址门牌号">
          <el-col :span="6">
            <el-input v-model="detail"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toSubmit">立即修改</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  data() {
    return {
      owner: '',
      name: '',
      tel: '',
      fee: '',
      full: '',
      address: '',
      detail: '',
      city: '',
      delivery: '',
      markers: [
        [116.126328,24.325626]
      ],
      searchOption: {
        city: '全国',
        citylimit: true
      },
      mapCenter: [116.126328,24.325626],
      longitude: 116.126328,
      latitude: 24.325626,
      showIcon: 'img/add.png',
      icon: '',
      type: 0,
      typeList: []
    }
  },
  created() {
    this.init()
    this.getType();
  },
  methods: {
    // 获取当前城市和经纬度
    initMap(){
      let self = this;
      console.log('加载了')
      var map = new AMap.Map('container', {
          resizeEnable: true
      });
      AMap.plugin('AMap.Geolocation', function() {
          var geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：5s
              buttonPosition:'RB',    //定位按钮的停靠位置
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
  
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition(function(status,result){
              if(status=='complete'){
                  onComplete(result)
              }else{
                  onError(result)
              }
          });
      });
      //解析定位结果
      function onComplete(data) {
          // document.getElementById('status').innerHTML='定位成功'
          var str = [];
          str.push('定位结果：' + data.position);
          str.push('定位类别：' + data.location_type);
          if(data.accuracy){
               str.push('精度：' + data.accuracy + ' 米');
          }//如为IP精确定位结果则没有精度信息
          str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
          self.city=data.addressComponent.city;
          self.searchOption.city = data.addressComponent.city;
          self.lng = data.position.lng;
          self.lat = data.position.lat;
          self.mapCenter = [self.lng, self.lat];
          self.markers[0] = self.mapCenter;
      }
      //解析定位错误信息
      function onError(data) {
        self.$toast('定位可能不太准确')
      }
    },
    init() {
      let self = this
      self.$axios
        .get('https://elm.cangdu.org/v1/cities?type=guess')
        .then(({status,data}) => {
          console.log(data)
          self.city = data.name
          self.searchOption.city = data.name
          self.longitude = data.longitude
          self.latitude = data.latitude
          self.mapCenter = [data.longitude, data.latitude]
          self.markers[0] = self.mapCenter
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取店铺的分类数据
    getType(){
      this.$axios.get('/shop/getType').then(({status, data}) => {
        if(status===200&&data.code===0){
          this.typeList = data.data;
        }
      })
    },
    changeCity(e){
      if(e){
        this.searchOption.city=e
      }
    },
    addMarker: function() {
      let lng = this.longitude + Math.round(Math.random() * 1000) / 10000
      let lat = this.latitude + Math.round(Math.random() * 500) / 10000
      this.markers.push([lng, lat])
    },
    onSearchResult(pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi
          lngSum += lng
          latSum += lat
          this.markers.push([poi.lng, poi.lat])
        })
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapCenter = [center.lng, center.lat]
        console.log(pois[0])
        this.longitude = pois[0].lng;
        this.latitude = pois[0].lat;
        this.address = pois[0].name;
      }
    },
    getFile(e) {
      let self = this
      const files = e.target.files[0]
      self.icon=files
      if (!e || !window.FileReader) return // 看支持不支持FileReader
      let reader = new FileReader()
      reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        self.showIcon=this.result
      }
    },
    toSubmit(){
      let self = this;
      console.log(this.typeList[this.type])
      if(!this.icon){
        this.$message('您还没有上传店铺图标')
        return false;
      }
      if(this.fee<0){
        this.$message('商家配送费用不能为负数')
        this.fee=0
        return false;
      }
      if(this.full<0){
        this.$message('商家免配送费的条件不能为负数')
        this.full = 0
        return false;
      }
      if(!this.delivery){
        this.$message('商家配送时间不能为空')
        return false;
      }
      if(this.name&&this.tel&&this.address&&this.city&&this.owner){
        let data = new FormData()
        data.append('icon', this.icon, this.icon.name);
        data.append('name', this.name)
        data.append('fee', this.fee)
        data.append('full', this.full)
        data.append('delivery', this.delivery)
        data.append('owner', this.owner)
        data.append('tel', this.tel)
        data.append('type', this.type)
        data.append('city', this.city)
        data.append('address', this.address)
        data.append('longitude', this.longitude)
        data.append('latitude', this.latitude)
        data.append('detail', this.detail)
        this.$axios.post('/shop/perinfo', data, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }).then(({status, data}) => {
          console.log(data)
          if(data.code===0){
            this.$message('信息完善成功')
            this.$router.replace('/')
          }
        }).catch((err) => {
          console.log(err)
        })
      }else{
        this.$message('信息填写不全')
      }
    }
  }
}
</script>

<style>
@media screen and (max-width: 300px) {
  .el-card {
    background-color: lightblue;
  }
}
.page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.page .bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.el-card {
  background-color: #fff;
  width: 90%;
  margin: 5%;
}
.center {
  padding-left: 6px;
}
.amap-page-container .amap-demo {
  height: 300px;
}
.search-box {
  position: absolute !important;
  top: 25px;
  left: 20px;
}
.upImg{
  position: relative;
}
.upImg img{
  width: 120px;
  height: 120px;
}
.upImg input{
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 120px;
  opacity: 0;
}
.amap-page-container {
  position: relative;
  margin-bottom: 20px;
}
</style>
