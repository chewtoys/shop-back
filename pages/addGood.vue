<template>
  <el-card>
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
    <div class="line type">
      <span class="label">商品分类</span>
      <el-select v-model="type" placeholder="请选择">
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
        <span class="label">是否设为推荐</span>
        <input type="text" name="home" v-model="home" class="none">
        <el-switch v-model="home" active-color="#13ce66" inactive-color="#ccc"></el-switch>
      </div>
    </div> -->
    <div class="line">
      <el-table :data="size" style="width: 100%">
        <el-table-column prop="name" label="规格名称" width="180"></el-table-column>
        <el-table-column prop="price" label="规格价格" width="180"></el-table-column>
        <el-table-column prop="amount" label="规格余量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showForm(scope.$index, scope.row.name, scope.row.price, scope.row.amount)"
            >编辑</el-button>
            <el-button size="mini" type="danger" @click="delSize(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="line">
      <!-- 添加规格 -->
      <el-button type="primary" @click="showForm(size.length,'','',0)">添加规格</el-button>

      <el-dialog title="添加规格" :visible.sync="dialogForm">
        <el-form>
          <el-form-item label="规格名称">
            <el-input v-model="sizeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="规格价格">
            <el-input v-model="sizePrice"></el-input>
          </el-form-item>
          <el-form-item label="规格余量">
            <el-input v-model="sizeAmount" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm = false">取 消</el-button>
          <el-button type="primary" @click="addSize">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="addBtn">
      <el-button @click="clear">清 空 数 据</el-button>
      <el-button type="primary" @click="toSubmit">添 加 数 据</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      description: '',
      home: false,
      img: 1,
      imgList: [],
      upImg: [],
      typeList: [],
      type: 0,
      size: [],
      sizeIdx: '',
      sizeName: '',
      sizePrice: '',
      sizeAmount: 1,
      dialogForm: false
    }
  },
  computed: {
    nowPrice() {
      let price = parseFloat(this.price ? this.price : 0)
      let rate = parseFloat(this.rate ? this.rate / 10 : 1)
      let nowPrice = price * rate
      return nowPrice.toFixed(2)
    }
  },
  created(){
    this.getType();
  },
  methods: {
    getType(){
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
    addImg() {
      let img = 'img' + this.img
      document.getElementsByClassName(img)[0].click()
      this.img++
    },
    delImg(idx) {
      this.$confirm('此操作将删除图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.imgList.splice(idx, 1)
          this.upImg.splice(idx, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    toSubmit() {
      let self = this
      let file = this.upImg
      if (file.length < 1) {
        this.$message('您还没有上传商品图片')
        return false
      }
      if(this.size.length<1){
        this.$message('请添加商品规格')
        return false;
      }
      if (this.name && this.description) {
        let rate = ''
        if (this.discount) {
          rate = parseFloat(this.rate).toFixed(2)
        }
        let data = new FormData()
        for (var item of file) {
          data.append('file', item, item.name)
        }
        data.append('name', this.name)
        data.append('description', this.description)
        data.append('home', this.home)
        data.append('type',this.type)
        self.$axios
          .post('/product/add', data, {
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
          .then(({ status, data }) => {
            self.$message(data.msg)
            if (data.code === 0) {
              self.appendSize(data.id)
              
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$message('信息填写不完全')
      }
    },
    appendSize(id){
      let self = this;
      let size = this.size;
      if(size.length<1){
        this.$message('请添加商品规格')
        return false;
      }
      for(var i=0;i<size.length;i++){
        let name = size[i].name;
        let price = size[i].price;
        let amount = size[i].amount;
        self.$axios.post('product/addSize', {
          id,
          name,
          price,
          amount
        }).then(({status, data}) => {
        }).catch((err) => {
          console.log(err)
        })
      }
      self.clear();
    },
    // 将选择的图片文件转为base64格式预览
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
    // 清空表单
    clear() {
      this.$router.go(0)
    },
    showForm(idx, name, price, amount) {
      this.sizeIdx = idx
      this.sizeName = name
      this.sizePrice = price
      this.sizeAmount = amount
      this.dialogForm = true
    },
    addSize() {
      let price = parseFloat(this.sizePrice).toFixed(2)
      let size = {
        name: this.sizeName,
        price: price,
        amount: this.sizeAmount
      }
      if(this.sizeAmount<0){
        this.$message('商品余量不能小于0')
        return false;
      }
      this.size.splice(this.sizeIdx, 1, size)
      this.dialogForm = false
    },
    delSize(idx) {
      this.$confirm('是否要删除此规格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.size.splice(idx, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
.none {
  display: none;
}
.el-card {
  width: 900px;
  margin: 0 auto;
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
.type{
  align-items: center;
}
.type .label{
  margin-bottom: 0px;
  padding-right: 10px;
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
.outImg {
  position: relative;
  display: inline-block;
}
.outImg i {
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

