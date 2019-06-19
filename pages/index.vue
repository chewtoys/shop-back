<template>
  <div>
    <div class="row">
      <el-card class="box-card first">
        <div slot="header" class="clearfix">
          <span>待处理订单</span>
        </div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col>
            <div class="num">{{newOrderLen}}</div>
            <div class="description">新订单</div>
          </el-col>
          <el-col>
            <div class="num yellow">{{hurryOrderLen}}</div>
            <div class="description">催单</div>
          </el-col>
          <el-col>
            <div class="num" style="color: #ccc;">{{failOrderLen}}</div>
            <div class="description">退单</div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card second">
        <div slot="header" class="clearfix">
          <span>待处理反馈</span>
        </div>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col>
            <div class="num grey">{{badReview}}</div>
            <div class="description">待回复差评</div>
          </el-col>
          <el-col>
            <div class="num yellow">{{review}}</div>
            <div class="description">待回复评价</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>今日总览</span>
      </div>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col>
          <div class="num">{{orderLen}}</div>
          <div class="description">今日订单</div>
        </el-col>
        <el-col>
          <div class="num yellow">￥{{total}}</div>
          <div class="description">今日营业额</div>
        </el-col>
      </el-row>
    </el-card>
    
  </div>
</template>

<script>
export default {
  data(){
    return{
      newOrderLen: 0,
      failOrderLen: 0,
      hurryOrderLen: 0,
      badReview: 0,
      review: 0,
      orderLen: 0,
      total: 0
    }
  },
  created(){
    this.init();
  },
  methods: {
    init(){
      let self = this;
      self.$axios.get('/shop/infor').then(({status, data}) => {
        if(data.code===1){
          self.$message('暂未登录')
          self.$router.replace('/login')
          return;
        }
        if(!data.data.name){
          self.$message('商家暂未完善个人信息')
          self.$router.replace('/perInfo')
          return;
        }
        self.getData();
      }).catch((err) => {
        console.log(err)
      })
    },
    getData(){
      this.$axios.get('/order/home').then(({status, data}) => {
        if(data.code===0){
          this.newOrderLen=data.newOrderLen;
          this.failOrderLen=data.failOrderLen;
          this.hurryOrderLen=data.hurryOrderLen;
          this.badReview=data.badReview;
          this.review=data.review;
          this.orderLen=data.orderLen;
          this.total=data.total;
        }
      })
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
  font-size: 14px;
  padding-bottom: 20px;
}
.row{
  display: flex;
  flex-wrap: wrap;
}
.first{
  width: 700px;
  margin-right: 20px;
}
.second{
  flex: 1;
}
.row-bg div {
  text-align: center;
}
.num {
  font-size: 44px;
  font-weight: 600;
  color: #0091ea;
}
.grey{
  color: #666;
}
.yellow{
  color: rgb(255,190,0);
}
.description {
  font-size: 12px;
  color: #555;
}
</style>
