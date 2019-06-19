<template>
  <div>
    <el-col :span="11" class="dateWrapper">
      <el-date-picker
        type="date"
        placeholder="选择日期"
        v-model="date1"
        style="width: 100%;"
        @change="changeDay"
      ></el-date-picker>
    </el-col>
    <el-table :data="data" border show-summary style="width: 100%">
      <el-table-column prop="time" label="日期" width="180"></el-table-column>
      <el-table-column label="订单号" width="200" sortable>
        <template slot-scope="scope">
          {{scope.row.number}}
        </template>
      </el-table-column>
      <el-table-column label="用户" width="200">
        <template slot-scope="scope">
          {{scope.row.incognito?'匿名用户':scope.row.address.name}}
        </template>
      </el-table-column>
      <el-table-column prop="money" label="订单金额" sortable></el-table-column>
      <el-table-column prop="fee" label="运费" sortable></el-table-column>
      <el-table-column prop="total" label="订单总金额" sortable></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      date1: '',
      data: []
    }
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      this.$axios.get('/order/finish', ).then(({status, data}) => {
        
        if(data.code===0){
          this.data = data.data
        }
      })
    },
    changeDay(){
      let date = new Date(this.date1);
      
      date = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
      
      if(date=='1970-0-1'){
        this.init()
      }else{
        this.$axios.get('/order/getDay',{
          params: {
            day: date
          }
        }).then(({status, data}) => {
          if(data.code===0){
            this.data = data.data
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.dateWrapper {
  margin-bottom: 20px;
}
</style>

