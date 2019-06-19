<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>完善商家信息</span>
    </div>
    <el-form ref="form">
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
</template>

<script>
export default {
  data() {
    return {
      owner: '',
      tel: '',
      address: '',
      detail: '',
      city: '',
      markers: [
        [116.126328,24.325626]
      ],
      searchOption: {
        city: '全国',
        citylimit: true
      },
      mapCenter: [116.126328,24.325626],
      longitude: 116.126328,
      latitude: 24.325626
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let self = this;
      self.$axios.get('/shop/infor').then(({status, data}) => {
        if(data.code===0){
          self.owner = data.data.owner;
          self.tel=data.data.tel;
          self.longitude=data.data.longitude;
          self.latitude=data.data.latitude;
          self.address=data.data.address;
          self.detail=data.data.detail;
          self.mapCenter=[self.longitude,self.latitude]
          self.markers[0]=self.mapCenter;
          self.city = data.data.city;
          self.searchOption.city=data.data.city;
        }
      })
    },
    changeCity(e) {
      if (e) {
        this.searchOption.city = e
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
        this.longitude = pois[0].lng
        this.latitude = pois[0].lat
        this.address = pois[0].name
      }
    },
    toSubmit() {
      let self = this
      if (this.owner && this.tel && this.address) {
        self.$axios
          .post('/shop/setting', {
            city: self.city,
            owner: self.owner,
            tel: self.tel,
            address: self.address,
            detail: self.detail,
            longitude: self.longitude,
            latitude: self.latitude
          })
          .then(({ status, data }) => {
            self.$message(data.msg)
            if (data.code === 0) {
              self.$router.go(0)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$message('商家信息填写不完全')
      }
    }
  }
}
</script>

<style>
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

.amap-page-container {
  position: relative;
  margin-bottom: 20px;
}
</style>
