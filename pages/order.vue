<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" stripe name="first">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-for="item in props.row.product" :key="item._id" class="product">
                  <img :src="'/upload/'+item.img" alt="" class="img">
                  <span>{{item.name}}</span>
                  <span>{{item.size}}</span>
                  <span>￥{{item.price}}</span>
                  <span>x{{item.amount}}</span>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="订单号"></el-table-column>
          <el-table-column prop="time" label="下单时间"></el-table-column>
          <el-table-column prop="address.name" label="姓名"></el-table-column>
          <el-table-column
            label="地址"
            width="180">
            <template slot-scope="scope">
              {{scope.row.address.city}}
              {{scope.row.address.address}}
              {{scope.row.address.houseNum}}
            </template>
          </el-table-column>
          <el-table-column
            label="配送方式"
            width="180">
            <template slot-scope="scope">
              {{scope.row.way==0?'自取':'商家配送'}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="用户备注"></el-table-column>
          <el-table-column
            label="订单状态"
            width="180">
            <template slot-scope="scope">
              <el-button type="primary" plain v-show="scope.row.status===1">待处理</el-button>
              <el-button type="primary" plain v-show="scope.row.status===2">准备中</el-button>
              <el-button type="primary" plain v-show="scope.row.status===3">配送中</el-button>
              <el-button type="primary" plain v-show="scope.row.status===4">已收货</el-button>
              <el-button type="primary" plain v-show="scope.row.status===5">订单完成</el-button>
              <el-button type="primary" plain v-show="scope.row.status===6">申请退款</el-button>
              <el-button type="primary" plain v-show="scope.row.status===7">已退款</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="订单金额"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="未处理订单" name="second">
        <el-card v-for="(item,idx) in list" :key="idx">
          <div class="header">
            <span>希望{{item.arrivalTime}}送达</span>
            <span>等待接单</span>
          </div>
          <div class="personal">
            <div>
              <span class="name bold">{{item.address.name}}</span>
              <i class="el-icon-phone strong"></i>
              <span class="tel bold">{{item.address.phone}}</span>
            </div>
            <div>
              <span class="bold">配送方式：</span>
              {{item.way==0?'用户自取':'商家配送'}}
            </div>
            <div>
              <span class="bold">地址：</span>
              {{item.address.city}}市 {{item.address.address}} {{item.address.houseNum}}
              <i class="el-icon-location strong"></i>
            </div>
            <div>
              <span class="bold">备注：</span>
              <span>{{item.remark}}</span>
            </div>
          </div>
          <div class="productContainer">
            <div class="productTitle">商品</div>
            <div class="product" v-for="product in item.product" :key="product._id">
              <div>
                <span class="name">{{product.name}}</span>
                <span class="size">{{product.size}}</span>
              </div>
              <div>x{{product.amount}}</div>
              <div>{{product.price}}</div>
            </div>
          </div>
          <div class="btnContainer">
            <el-button type="danger" size="small" @click="refuse(idx)">拒绝</el-button>
            <el-button type="primary" size="small" @click="changeOrder(idx, 2)">接受</el-button>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="进行中订单" name="third">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-for="item in props.row.product" :key="item._id" class="product">
                  <img :src="'/upload/'+item.img" alt="" class="img">
                  <span>{{item.name}}</span>
                  <span>{{item.size}}</span>
                  <span>￥{{item.price}}</span>
                  <span>x{{item.amount}}</span>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="订单号"></el-table-column>
          <el-table-column prop="time" label="下单时间"></el-table-column>
          <el-table-column prop="address.name" label="姓名"></el-table-column>
          <el-table-column
            label="地址"
            width="180">
            <template slot-scope="scope">
              {{scope.row.address.city}}
              {{scope.row.address.address}}
              {{scope.row.address.houseNum}}
            </template>
          </el-table-column>
          <el-table-column
            label="配送方式"
            width="180">
            <template slot-scope="scope">
              {{scope.row.way==0?'自取':'商家配送'}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="用户备注"></el-table-column>
          <el-table-column
            label="订单状态"
            width="180">
            <template slot-scope="scope">
              <el-button type="primary" @click="changeOrder(scope.$index, 3)">餐品完成</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="订单金额"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="配送中订单" name="fourth">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-for="item in props.row.product" :key="item._id" class="product">
                  <img :src="'/upload/'+item.img" alt="" class="img">
                  <span>{{item.name}}</span>
                  <span>{{item.size}}</span>
                  <span>￥{{item.price}}</span>
                  <span>x{{item.amount}}</span>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="订单号"></el-table-column>
          <el-table-column prop="time" label="下单时间"></el-table-column>
          <el-table-column prop="address.name" label="姓名"></el-table-column>
          <el-table-column
            label="地址"
            width="180">
            <template slot-scope="scope">
              {{scope.row.address.city}}
              {{scope.row.address.address}}
              {{scope.row.address.houseNum}}
            </template>
          </el-table-column>
          <el-table-column
            label="配送方式"
            width="180">
            <template slot-scope="scope">
              {{scope.row.way==0?'自取':'商家配送'}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="用户备注"></el-table-column>
          <el-table-column
            label="订单状态"
            width="180">
            <template slot-scope="scope">
              <el-button type="primary"  @click="changeOrder(scope.$index, 4)">已收货</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="订单金额"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="成功订单" name="fifth">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-for="item in props.row.product" :key="item._id" class="product">
                  <img :src="'/upload/'+item.img" alt="" class="img">
                  <span>{{item.name}}</span>
                  <span>{{item.size}}</span>
                  <span>￥{{item.price}}</span>
                  <span>x{{item.amount}}</span>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="订单号"></el-table-column>
          <el-table-column prop="time" label="下单时间"></el-table-column>
          <el-table-column prop="address.name" label="姓名"></el-table-column>
          <el-table-column
            label="地址"
            width="180">
            <template slot-scope="scope">
              {{scope.row.address.city}}
              {{scope.row.address.address}}
              {{scope.row.address.houseNum}}
            </template>
          </el-table-column>
          <el-table-column
            label="配送方式"
            width="180">
            <template slot-scope="scope">
              {{scope.row.way==0?'自取':'商家配送'}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="用户备注"></el-table-column>
          <el-table-column prop="total" label="订单金额"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="完成订单(已评价)" name="sixth">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-for="item in props.row.product" :key="item._id" class="product">
                  <img :src="'/upload/'+item.img" alt="" class="img">
                  <span>{{item.name}}</span>
                  <span>{{item.size}}</span>
                  <span>￥{{item.price}}</span>
                  <span>x{{item.amount}}</span>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="订单号"></el-table-column>
          <el-table-column prop="time" label="下单时间"></el-table-column>
          <el-table-column prop="address.name" label="姓名"></el-table-column>
          <el-table-column prop="remark" label="用户备注"></el-table-column>
          <el-table-column prop="address.address" label="地址"></el-table-column>
          <el-table-column
            label="地址"
            width="180">
            <template slot-scope="scope">
              {{scope.row.address.city}}
              {{scope.row.address.address}}
              {{scope.row.address.houseNum}}
            </template>
          </el-table-column>
          <el-table-column
            label="配送方式"
            width="180">
            <template slot-scope="scope">
              {{scope.row.way==0?'自取':'商家配送'}}
            </template>
          </el-table-column>
          <el-table-column prop="total" label="订单金额"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="申请退款订单" name="seventh">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-for="item in props.row.product" :key="item._id" class="product">
                  <img :src="'/upload/'+item.img" alt="" class="img">
                  <span>{{item.name}}</span>
                  <span>{{item.size}}</span>
                  <span>￥{{item.price}}</span>
                  <span>x{{item.amount}}</span>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="订单号"></el-table-column>
          <el-table-column prop="time" label="下单时间"></el-table-column>
          <el-table-column prop="address.name" label="姓名"></el-table-column>
          <el-table-column
            label="地址"
            width="180">
            <template slot-scope="scope">
              {{scope.row.address.city}}
              {{scope.row.address.address}}
              {{scope.row.address.houseNum}}
            </template>
          </el-table-column>
          <el-table-column
            label="配送方式"
            width="180">
            <template slot-scope="scope">
              {{scope.row.way==0?'自取':'商家配送'}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="用户备注"></el-table-column>
          <el-table-column
            label="订单状态"
            width="180">
            <template slot-scope="scope">
              <el-button type="primary"  @click="agreeRefund(scope.$index)">同意退款</el-button>
              <el-button type="danger"  @click="changeOrder(scope.$index, 10)">拒绝退款</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="订单金额"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="失败" name="eighth">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-for="item in props.row.product" :key="item._id" class="product">
                  <img :src="'/upload/'+item.img" alt="" class="img">
                  <span>{{item.name}}</span>
                  <span>{{item.size}}</span>
                  <span>￥{{item.price}}</span>
                  <span>x{{item.amount}}</span>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="订单号"></el-table-column>
          <el-table-column prop="time" label="下单时间"></el-table-column>
          <el-table-column prop="address.name" label="姓名"></el-table-column>
          <el-table-column
            label="地址"
            width="180">
            <template slot-scope="scope">
              {{scope.row.address.city}}
              {{scope.row.address.address}}
              {{scope.row.address.houseNum}}
            </template>
          </el-table-column>
          <el-table-column
            label="配送方式"
            width="180">
            <template slot-scope="scope">
              {{scope.row.way==0?'自取':'商家配送'}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="用户备注"></el-table-column>
          <el-table-column prop="total" label="订单金额"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="拒绝订单" name="ninth">
        <el-table :data="list" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-for="item in props.row.product" :key="item._id" class="product">
                  <img :src="'/upload/'+item.img" alt="" class="img">
                  <span>{{item.name}}</span>
                  <span>{{item.size}}</span>
                  <span>￥{{item.price}}</span>
                  <span>x{{item.amount}}</span>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="订单号"></el-table-column>
          <el-table-column prop="time" label="下单时间"></el-table-column>
          <el-table-column prop="address.name" label="姓名"></el-table-column>
          <el-table-column
            label="地址"
            width="180">
            <template slot-scope="scope">
              {{scope.row.address.city}}
              {{scope.row.address.address}}
              {{scope.row.address.houseNum}}
            </template>
          </el-table-column>
          <el-table-column
            label="配送方式"
            width="180">
            <template slot-scope="scope">
              {{scope.row.way==0?'自取':'商家配送'}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="用户备注"></el-table-column>
          <!-- <el-table-column
            label="订单状态"
            width="180">
            <template>
              <el-button type="primary">撤销拒绝</el-button>
            </template>
          </el-table-column> -->
          <el-table-column prop="total" label="订单金额"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      list: []
    }
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      this.$axios.get('/order/getAll').then(({status, data}) => {
        if(status===200&&data.code===0){
          this.list = data.data;
        }else if(data.code===1){
          this.$router.replace('/login')
        }else{
          this.$message('系统出错，请稍后再试')
        }
      })
    },
    getOrder(status){
      this.$axios.get('/order/getOrder',{
        params: {
          status
        }
      }).then(({status, data}) => {
        if(status===200&&data.code===0){
          this.list = data.data;
        }else{
          this.$message('系统出错，请稍后再试')
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab.index)
      let idx = tab.index;
      if(idx==0){
        this.init()
      }else{
        this.getOrder(idx)
      }
    },
    // 拒绝订单退款
    refuse(idx){
      let id = this.list[idx]._id;
      this.$axios.post('/order/refuse', {
        id
      }).then(({status, data}) => {
        if(data.code===1){
          this.$message('尚未登录')
          this.$router.replace('/login')
        }else if(data.code===0){
          this.$message('已拒绝订单')
          this.list.splice(idx,1)
        }else{
          this.$message("系统出错，请稍后再试")
        }
      })
    },
    // 修改订单状态
    changeOrder(idx, status){
      let id = this.list[idx]._id;
      this.$axios.post('/order/change', {
        id,
        status
      }).then(({status, data}) => {
        if(data.code===1){
          this.$message('尚未登录')
          this.$router.replace('/login')
        }else if(data.code===0){
          this.$message('修改成功')
          this.list.splice(idx,1)
        }else{
          this.$message("系统出错，请稍后再试")
        }
      })
    },
    agreeRefund(idx){
      let id = this.list[idx]._id;
      this.$axios.post('/order/agreeRefund', {
        id
      }).then(({status, data}) => {
        if(data.code===1){
          this.$message('尚未登录')
          this.$router.replace('/login')
        }else if(data.code===0){
          this.$message('修改成功')
          this.list.splice(idx,1)
        }else{
          this.$message("系统出错，请稍后再试")
        }
      })
    }
  }
}
</script>

<style scoped>
.el-tab-pane{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.el-card {
  font-size: 14px;
  margin: 12px;
  width: 520px;
}
.header{
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: flex;
  justify-content: space-between;
}
.personal{
  margin-top: 10px;
}
.personal .name{
  padding-right: 20px;
}
.personal div{
  margin-top: 4px;
}
.strong{
  color: rgb(0,145,234);
}
.bold{
  /* color: rgb(0,145,234); */
  font-weight: bold;
}
.productContainer{
  margin-top: 20px;
}
.productTitle{
  font-weight: bold;
}
.product{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btnContainer{
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
.img{
  width: 80px;
  height: 80px;
}
</style>
