<template>
  <el-col class="sideWrapper">
    <el-menu
      :collapse="aside"
      :default-active="active"
      :unique-opened="true"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <div v-for="item in routers" :key="item.idx">
        <el-menu-item class="menuItem" :index="item.idx" @click="linkTo(item)" v-if="!item.child">
          <i :class="item.icon"></i>
          <span v-show="!aside">{{item.text}}</span>
        </el-menu-item>
        <el-submenu class="menuItem" :index="item.idx" v-else>
          <template slot="title">
            <i :class="item.icon"></i>
            <span v-show="!aside">{{item.text}}</span>
          </template>
          <el-menu-item-group :title="item.text">
            <el-menu-item
              :index="child.idx"
              v-for="child in item.child"
              :key="child.idx"
              @click="linkTo(child)"
            >{{child.text}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </div>
      <el-menu-item class="menuItem" @click="exit">
        <i class="el-icon-menu"></i>
        <span v-show="!aside">退出登录</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</template>

<script>
export default {
  props: {
    aside: {
      default: false
    }
  },
  data() {
    return {
      active: "1",
      routers: [
        {
          icon: "el-icon-menu",
          name: "index",
          link: "/",
          text: "首页",
          idx: '1'
        },
        {
          icon: "el-icon-goods",
          text: "商品管理",
          idx: '2',
          child: [
            {
              name: 'addType',
              link: '/addType',
              text: '商品分类',
              idx: '2-1'
            },
            {
              name: 'good',
              link: '/good',
              text: '商品列表',
              idx: '2-2'
            },
            {
              name: 'addGood',
              link: '/addGood',
              text: '添加商品',
              idx: '2-3'
            }
          ]
        },
        {
          icon: "el-icon-tickets",
          name: "order",
          link: "/order",
          text: "订单管理",
          idx: '3'
        },
        {
          icon: "el-icon-bell",
          text: "评价管理",
          link: 'assess',
          idx: "4"
        },
        {
          icon: "el-icon-edit",
          text: "数据统计",
          idx: '5',
          child: [
            {
              name: "itemStatistics",
              link: "/itemStatistics",
              text: "商品统计",
              idx: '5-1'
            },
            {
              name: "orderStatistics",
              link: "/orderStatistics",
              text: "订单统计",
              idx: '5-2'
            }
          ]
        },
        {
          icon: "el-icon-setting",
          text: "店铺管理",
          idx: '6',
          child: [
            {
              name: "setting",
              link: "/setting",
              text: "商家管理",
              idx: '6-1'
            },
            {
              name: "shop",
              link: "/shop",
              text: "店铺管理",
              idx: '6-2'
            }
          ]
        }
      ]
    };
  },
  computed: {
    menuLen() {
      return (this.routers.length + 2).toString();
    }
  },
  mounted() {
    this.currentPage();
  },
  methods: {
    currentPage() {
      let name = this.$route.name;
      let arr = this.routers;
      // console.log(arr);
      for(let i = 0; i < arr.length; i++){
        if(arr[i].child){
          arr[i].child.forEach(item => {
            if(item.name === name){
              this.active = item.idx;
              this.$store.commit("changePage", item.text);
            }
          });
        }else{
          if(arr[i].name === name){
            this.active = arr[i].idx;
            this.$store.commit("changePage", arr[i].text);
          }
        }
      }
    },
    linkTo(item) {
      this.$router.push(item.link);
      this.$store.commit("changePage", item.text);
    },
    exit(){
      this.$axios.get('/shop/exit').then(({status, data}) => {
        console.log(data)
        if(data.code===0){
          this.$message('退出登录')
          this.$router.push('/login')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style scoped>
.menuItem{
  width: 100%;
}
</style>
