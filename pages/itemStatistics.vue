<template>
  <div>
    <el-table
      :data="data.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      border
      style="width: 100%"
      show-summary
    >
      <el-table-column prop="name" label="商品名"></el-table-column>
      <el-table-column prop="sales" label="销量" sortable></el-table-column>
      <el-table-column prop="total" label="总金额" sortable></el-table-column>
      
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button type="primary" @click="showType(scope.$index)">规格销量</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="查看规格" :visible.sync="show">
      <el-table :data="size" border show-summary style="width: 100%">
      <el-table-column prop="name" label="规格名称"></el-table-column>
      <el-table-column prop="sales" label="销量" sortable></el-table-column>
      <el-table-column prop="price" label="单价" sortable></el-table-column>
      <el-table-column prop="total" label="总金额" sortable></el-table-column>
    </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="show=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      date1: '',
      data: [],
      show: false,
      size: [],
      search: ''
    }
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      this.$axios.get('/product/statistics').then(({status, data}) => {
        if(data.code===0){
          this.data = data.data
          for(var product of data.data){
            let total=0;
            for(var size of product.size){
              total+=size.sales*size.price;
            }
            product.total=total;
          }
        }
      })
    },
    showType(idx){
      this.size = this.data[idx].size;
      for(let size of this.size){

        size.total=size.price*size.sales;
      }
      this.show=true
    }
  }
}
</script>
<style scoped>
.dateWrapper {
  margin-bottom: 20px;
}
</style>

