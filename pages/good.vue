<template>
  <div>
    <!-- 商品列表 -->
    <el-table
      :data="tableData.filter(tableData => !search || tableData.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">
      <el-table-column label="商品名" width="100" prop="name"></el-table-column>
      <el-table-column label="描述" prop="description"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img
            :src="'upload/'+item"
            alt
            v-for="item in scope.row.imgs"
            :key="item"
          >
        </template>
      </el-table-column>
      <el-table-column label="商品分类" width="200">
        <template slot-scope="scope">
          <span>{{typeList[scope.row.type]}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" label="销量" prop="sales"></el-table-column>
      <el-table-column width="80" label="好评" prop="like"></el-table-column>
      <el-table-column label="规格" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showSize(scope.$index,scope.row)">查看规格</el-button>
        </template>
      </el-table-column>
      <el-table-column label="下架">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" v-if="scope.row.invalid" @click="invalid(scope.$index, scope.row, false)">上架</el-button>
          <el-button size="mini" v-else @click="invalid(scope.$index, scope.row,true)">下架</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      
    </el-table>
    <!-- 编辑商品 -->
    <el-dialog title="修改商品" :visible.sync="dialogForm">
      <div class="line">
        <span class="label">商品名</span>
        <el-input v-model="name" name="name" placeholder="请输入商品名"></el-input>
      </div>
      <div class="line">
        <span class="label">商品描述</span>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5}"
          placeholder="请输入内容"
          name="description"
          v-model="description"
        ></el-input>
      </div>
      <div class="line">
        <span class="label">商品分类</span>
        <el-select v-model="newType" placeholder="请选择">
          <el-option
            v-for="(item,idx) in typeList"
            :key="idx"
            :label="item"
            :value="idx"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 上传商品图片 -->
      <div class="line">
        <span class="label">上传商品图片</span>
        <div class="imgContainer">
          <div v-for="(item,idx) in imgList" :key="idx" class="outImg">
            <img :src="item">
            <i class="el-icon-error" @click="delImg(idx)"></i>
          </div>
          <img src="img/add.png" @click="addImg" alt>
          <input
            type="file"
            class="none"
            v-for="item in img"
            :key="item"
            name="file"
            @change="getFile($event)"
            :class="'img'+item"
          >
        </div>
      </div>
      <!-- <div class="line">
        <div class="float">
          <span class="label">是否推荐</span>
          <input type="text" name="home" v-model="home" class="none">
          <el-switch v-model="home" active-color="#13ce66" inactive-color="#ccc"></el-switch>
        </div>
      </div> -->
      <div class="addBtn">
        <el-button @click="clear">清 空 数 据</el-button>
        <el-button type="primary" @click="toSubmit">确 认 修 改</el-button>
      </div>
    </el-dialog>
    <!-- 查看规格 -->
    <el-dialog title="查看规格" :visible.sync="sizeForm">
      <el-table :data="sizeList" style="width: 100%">
        <el-table-column label="规格名" prop="name"></el-table-column>
        <el-table-column label="规格价格">
          <template slot-scope="scope">
            <span>￥{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格余量" prop="amount"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delSize(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="line">
        <span class="label">商品规格名称</span>
        <el-input v-model="size"  placeholder="请输入商品规格名称"></el-input>
      </div>
      <div class="line">
        <span class="label">商品规格价格</span>
        <el-input v-model="price" placeholder="请输入商品规格价格"></el-input>
      </div>
      <div class="line">
        <span class="label">商品规格余量</span>
        <el-input v-model="amount" type="number" placeholder="请输入商品规格余量"></el-input>
      </div>
      <div class="addBtn">
        <el-button @click="sizeForm=false">取 消 修 改</el-button>
        <el-button type="primary" @click="sizeSubmit">添 加 数 据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {imgUrl} from '../assets/js/util'
export default {
  data() {
    return {
      tableData: [],
      dialogForm: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      search: '',
      formLabelWidth: '120px',
      current: '',
      name: '',
      description: '',
      home: false,
      img: 1,
      oldImg: [],
      imgList: [],
      upImg: [],
      sizeForm: false,
      sizeList: [],
      size: '',
      amount: 1,
      price: '',
      product_id: '',
      editSize: false,
      typeList: [],
      newType: 0
    }
  },
  created() {
    this.init()
    this.getType()
  },
  methods: {
    init() {
      let self = this
      this.$axios
        .get('/product/getAll')
        .then(({ status, data }) => {
          console.log(data.data)
          if(data.code===0){
            self.tableData = data.data
          }else{
            this.$router.replace('/login')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getType(){
      console.log('12')
      this.$axios.get('/shop/infor').then(({status, data}) => {
        console.log(data)
        if(data.code===0){
          this.typeList=data.data.goodType;
        }else{
          this.$router.replace('/login')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(index, row) {
      this.dialogForm = true
      this.current = row._id;
      this.name = row.name;
      this.description = row.description;
      this.home = row.home;
      this.oldImg = row.imgs;
      this.newType = row.type;
      let imgList = [];
      row.imgs.forEach(item => {
        imgList.push('upload/'+item)
      })
      this.imgList = imgList;
    },
    handleDelete(index, row) {
      let self = this;
      this.$confirm('此操作将删除商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$axios.get('/product/del',{
          params: {
            id:row._id
          }
        }).then(({status, data}) => {
          self.$message(data.msg)
          if(data.code===0){
            self.tableData.splice(index,1)
          }
        })
      }).catch(() => {

      })
    },
    addImg() {
      let img = 'img' + this.img
      console.log(document.getElementsByClassName(img))
      document.getElementsByClassName(img)[0].click()
      this.img++
    },
    delImg(idx) {
      this.$confirm('此操作将删除图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.imgList.splice(idx,1)
        let nowIdx = idx-this.oldImg.length;
        if(idx<this.oldImg.length){
          console.log('删除旧照片',idx)
          this.oldImg.splice(idx,1)
        }else{
          console.log('删除新照片',nowIdx)
          this.upImg.splice(nowIdx, 1)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    toSubmit() {
      let self = this;
      let file = this.upImg;
      if(this.imgList.length<1){
        this.$message('您还没有上传商品图片')
        return false;
      }
      if(this.name&&this.description){
        let rate=""
        if(this.discount){
          rate = parseFloat(this.rate).toFixed(2)
        }
        let data = new FormData();
        for(var item of file){
          data.append('file', item, item.name)
        }
        data.append('id', this.current)
        data.append('name', this.name)
        data.append('description', this.description)
        data.append('home', this.home)
        data.append('oldImg', this.oldImg)
        data.append('type', this.newType)
        self.$axios.post('/product/edit', data,{
          headers: {
            "content-type": 'multipart/form-data'
          }
        }).then(({status, data}) => {
          console.log(data);
          self.$message(data.msg)
          if(data.code===0){
            self.$router.go(0)
          }
        }).catch((err) => {
          console.log(err)
        })
      }else{
        this.$message('信息填写不完全')
      }
    },
    getFile(e) {
      let self = this
      const files = e.target.files[0]
      self.upImg.push(files)
      if (!e || !window.FileReader) return // 看支持不支持FileReader
      let reader = new FileReader()
      reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
      reader.onloadend = function() {
        self.imgList.push(this.result)
      }
    },
    invalid(idx, item, invalid){
      this.$axios.get('/product/invalid',{
        params: {
          id:item._id,
          invalid
        }
      }).then(({status, data}) => {
        this.$message(data.msg)
        if(data.code===0){
          this.tableData[idx].invalid=invalid
        }
      })
    },
    clear(){
      this.name = ""
      this.description=""
      this.home=false
      this.img=1
      this.imgList=[]
      this.upImg=[]
    },
    showSize(idx, item){
      let self = this;
      let id = item._id;
      this.sizeForm=true;
      this.product_id = id;
      this.$axios.get('/product/getSize',{
        params: {
          id
        }
      }).then(({status, data}) => {
        console.log(data)
        self.sizeList = data.data;
      })
    },
    // 删除规格
    delSize(idx,row){
      let self = this;
      this.$confirm('此操作将删除商品规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$axios.get('/product/delSize',{
          params: {
            id:row._id
          }
        }).then(({status, data}) => {
          self.$message(data.msg)
          if(data.code===0){
            self.sizeList.splice(idx,1)
          }
        })
      }).catch(() => {

      })
    },
    sizeSubmit(){
      let self = this;
      let id = this.product_id;
      let name = this.size;
      let price = this.price;
      let amount = this.amount;
      if(id&&name&&price&&amount){
        self.$axios.post('/product/addSize',{
          id:this.product_id,
          name:this.size,
          price:this.price,
          amount:this.amount
        }).then(({status, data}) => {
          console.log(data)
          self.$message(data.msg)
          if(data.code===0){
            self.sizeList.push(data.data)
            self.product_id=''
            self.size=""
            self.price=""
            self.amount=1
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
<style scoped>
.cell img {
  width: 80px;
  height: 80px;
  margin: 0px 2px;
}
.none {
  display: none;
}
.line {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
}
.line > .label {
  display: inline-block;
  color: #333;
  margin-bottom: 10px;
}
.float {
  margin-bottom: 10px;
  margin-right: 20px;
  display: flex;
  align-items: center;
}
.float .label {
  display: inline-block;
  color: #333;
  margin-right: 20px;
}
.float .el-input {
  width: 80px;
  margin-right: 10px;
}
.imgContainer {
  width: 100%;
}
.outImg{
  position: relative;
  display: inline-block;
}
.outImg i{
  position: absolute;
  top: -6px;
  right: -2px;
  z-index: 100;
}
.imgContainer img {
  width: 120px;
  height: 120px;
  margin-right: 4px;
}
.addBtn {
  text-align: center;
}
.addBtn button {
  width: 200px;
  letter-spacing: 4px;
  font-size: 15px;
}
</style>
