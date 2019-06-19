<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>修改店铺信息</span>
    </div>
    <el-form ref="form">
      <el-form-item label="店铺名称">
        <el-col :span="10">
          <el-input v-model="name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="店铺图标">
        <el-col :span="6">
          <img :src="img" alt=""  @click="showForm = true">
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
      <el-form-item label="免配送费">
        <el-col :span="5">
          <el-input v-model="full" type="number"></el-input>
        </el-col>
        <el-col :span="7" class="center">元(为0即商家免费配送)</el-col>
      </el-form-item>
      <el-form-item label="配送时间">
        <el-col :span="5">
          <el-input v-model="delivery"></el-input>
        </el-col>
        <el-col :span="7" class="center">分钟</el-col>
      </el-form-item>
      <el-form-item label="店铺公告">
        <el-col :span="10">
          <el-input v-model="notice"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="店铺关闭">
        <el-switch
          v-model="close"
          active-color="#13ce66"
          inactive-color="#ccc">
        </el-switch>
      </el-form-item>
      <el-form-item label="营业时间">
        <el-col :span="10">
          <el-input v-model="bussinessHour"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSubmit">立即修改</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="修改图标" :visible.sync="showForm">
      <div class="upImg">
        <img :src="showIcon" alt="">
        <input type="file" name="icon" @change="getFile($event)" ref="imgIcon">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showForm = false">取 消</el-button>
        <el-button type="primary" @click="changeImg">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      fee: '',
      full: '',
      delivery: '',
      close: true,
      notice: '',
      img: '',
      showIcon: '',
      icon: '',
      bussinessHour: '',
      showForm: false,
      type: 0,
      typeList: []
    }
  },
  created() {
    this.init();
    this.getType();
  },
  methods: {
    init() {
      let self = this;
      self.$axios.get('/shop/infor').then(({status, data}) => {
        console.log(data)
        if(data.code===0){
          self.name = data.data.name;
          self.notice = data.data.notice;
          self.fee=data.data.fee;
          self.full=data.data.full;
          self.delivery=data.data.delivery;
          self.bussinessHour = data.data.bussinessHour;
          self.close = data.data.close;
          self.img = 'upload/'+data.data.icon;
          self.showIcon = 'upload/'+data.data.icon;
          self.type = data.data.type;
        }
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
    changeImg(){
      if(!this.icon){
        this.$message('您还没有上传店铺图标')
        return false;
      }
      let data = new FormData()
      data.append('icon', this.icon, this.icon.name);
      this.$axios.post('/shop/icon', data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }).then(({status, data}) => {
        console.log(data)
        this.showForm=false;
        this.img = this.showIcon
      }).catch((err) => {
        console.log(err)
      })
    },
    toSubmit() {
      let self = this
      if (this.fee < 0) {
        this.$message('商家配送费用不能为负数')
        this.fee = 0
        return false
      }
      if (this.full < 0) {
        this.$message('商家配送的条件不能为负数')
        this.full = 0
        return false
      }
      self.$axios.post('/shop/setShop', {
        name: self.name,
        delivery: self.delivery,
        fee: self.fee,
        full: self.full,
        notice: self.notice,
        close: self.close,
        bussinessHour: self.bussinessHour,
        type: self.type
      })
      .then(({ status, data }) => {
        self.$message(data.msg)
        self.$router.go(0)
      })
      .catch(err => {
        console.log(err)
      })
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
.el-col img{
  width: 120px;
  height: 120px;
}
.amap-page-container {
  position: relative;
  margin-bottom: 20px;
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
</style>
