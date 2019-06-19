<template>
  <div>
    <el-card>
      <el-table :data="type" style="width: 100%">
        <el-table-column label="分类id">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类名">
          <template slot-scope="scope">
            <span>{{scope.row}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加 -->
    <el-button class="btn" type="primary" @click="formVisible = true">添加商品分类</el-button>
    <el-dialog title="添加商品分类" :visible.sync="formVisible">
      <el-form>
        <el-form-item label="分类名称">
          <el-input v-model="name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="添加商品分类" :visible.sync="editForm">
      <el-form>
        <el-form-item label="分类名称">
          <el-input v-model="val" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editForm = false">取 消</el-button>
        <el-button type="primary" @click="editType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      formVisible: false,
      name: '',
      type: [],
      editForm: false,
      val: '',
      index: 0
    }
  },
  mounted(){
    this.init()
  },
  methods: {
    init(){
      let id = localStorage.getItem('user_id')
      this.id = id;
      this.$axios.get('/shop/infor',{
        params: {
          id
        }
      }).then(({status, data}) => {
        console.log(data)
        if(data.code===0){
          this.type = data.data.goodType;
        }else{
          this.$router.replace('/login')
        }
      })
    },
    addType() {
      if (this.name) {
        this.$axios
          .post('/shop/addType', {
            id:this.id,
            name: this.name
          })
          .then(({ status, data }) => {
            console.log(data)
            this.$message(data.msg)
            if(data.code===0){
              this.formVisible=false
              this.type.push(this.name)
              this.name=''
            }
          })
          .catch(err => {
            this.$message('系统出错，请稍后再试')
          })
      } else {
        this.$message('你还没有填写商品分类')
      }
    },
    handleEdit(index, row) {
      this.editForm=true;
      this.val = row;
      this.index = index;
    },
    editType(){
      if (this.val) {
        this.$axios
          .post('/shop/editType', {
            id:this.id,
            idx: this.index,
            name: this.val
          })
          .then(({ status, data }) => {
            this.$message(data.msg)
            if(data.code===0){
              this.editForm=false;
              this.type[this.index]=this.val
              this.val = ''
            }
          })
          .catch(err => {
            this.$message('系统出错，请稍后再试')
          })
      } else {
        this.$message('你还没有填写商品分类')
      }
    },
    handleDelete(index, row) {
      let self = this;
      this.$confirm('是否删除此分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
        .post('/shop/delType', {
          id: self.id,
          idx: index
        })
        .then(({ status, data }) => {
          this.$message(data.msg)
          if(data.code===0){
            this.type.splice(index,1)
          }
        })
        .catch(err => {
          this.$message('系统出错，请稍后再试')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  }
}
</script>

<style scoped>
.btn{
  margin: 20px auto;
  position: relative;    
  left: 50%;
  transform: translateX(-50%);
}
</style>

