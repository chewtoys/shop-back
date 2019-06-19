<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未回复评价" name="first">
        <el-table :data="list" style="width: 100%">
          <el-table-column label="订单号" prop="order.number"></el-table-column>
          <el-table-column label="用户">
            <template slot-scope="scope">
              <span v-if="scope.row.incognito">匿名用户</span>
              <span v-else>{{scope.row.order.address.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="评论" width="100" prop="content"></el-table-column>
          <el-table-column label="是否好评">
            <template slot-scope="scope">
              <span v-if="scope.row.like">好评</span>
              <span v-else>差评</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="showModel(scope.$index)"
                v-if="!scope.row.ifreply"
              >回复</el-button>
              <el-button type="primary" size="small" v-else>已回复</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已回复评论" name="second">
        <el-table :data="list" style="width: 100%">
          <el-table-column label="订单号" prop="order.number"></el-table-column>
          <el-table-column label="用户">
            <template slot-scope="scope">
              <span v-if="scope.row.incognito">匿名用户</span>
              <span v-else>{{scope.row.order.address.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="评论" width="100" prop="content"></el-table-column>
          <el-table-column label="是否好评">
            <template slot-scope="scope">
              <span v-if="scope.row.like">好评</span>
              <span v-else>差评</span>
            </template>
          </el-table-column>
          <el-table-column label="商家回复" width="100" prop="reply"></el-table-column>
          <el-table-column label="回复时间" width="100" prop="replyTime"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="全部评价" name="third">
        <el-table :data="list" style="width: 100%">
          <el-table-column label="订单号" prop="order.number"></el-table-column>
          <el-table-column label="用户">
            <template slot-scope="scope">
              <span v-if="scope.row.incognito">匿名用户</span>
              <span v-else>{{scope.row.order.address.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="评论" width="100" prop="content"></el-table-column>
          <el-table-column label="是否好评">
            <template slot-scope="scope">
              <span v-if="scope.row.like">好评</span>
              <span v-else>差评</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="showModel(scope.$index)"
                v-if="!scope.row.ifreply"
              >回复</el-button>
              <el-button type="primary" size="small" v-else>已回复</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 模态框 -->
    <el-dialog title="商家回复" :visible.sync="show">
      <el-form>
        <el-form-item label="回复">
          <el-input v-model="reply" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="toReply">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      list: [],
      search: '',
      idx: '',
      show: false,
      reply: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getReview('/review/unanswered')
    },
    handleClick(tab, event) {
      console.log(tab.index)
      switch (tab.index) {
        case '0':
          this.getReview('/review/unanswered')
          break
        case '1':
          this.getReview('/review/replied')
          break
        default:
          this.getReview('/review/getAll')
      }
    },
    getReview(url) {
      this.$axios.get(url).then(({ status, data }) => {
        if (data.code === 0) {
          this.list = data.data
        }else{
          this.$router.replace('/login')
        }
      })
    },
    showModel(idx) {
      this.idx = idx
      this.show = true
    },
    toReply(){
      let id = this.list[this.idx]._id;
      if(this.reply){
        this.$axios.post('/review/reply',{
          id: id,
          reply: this.reply
        }).then(({status, data}) => {
          this.$router.go(0)
        })
      }else{
        this.$message('您还没有填写回复')
      }
    }
  }
}
</script>

<style>
</style>
