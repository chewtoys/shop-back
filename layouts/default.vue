<template>
  <el-container id="layout">
    <el-aside :width="asideHide?'64px':'202px'">
      <slide-bar :aside="asideHide" />
    </el-aside>
    <el-container>
      <el-header>
        <menu-bar />
      </el-header>
      <el-main><nuxt /></el-main>
    </el-container>
  </el-container>
</template>
<script>
import slideBar from '~/components/public/sideBar.vue'
import menuBar from '~/components/public/menuBar.vue'
export default {
  data(){
    return{
      asideHide: false
    }
  },
  mounted(){
    this._resize();
  },
  methods: {
    // 改变窗口大小时，侧边栏的隐藏或显示
    _resize(){
      const that = this;
      that.clientWidth = document.documentElement.clientWidth;
      if(that.clientWidth<900){
        that.asideHide = true
      }else{
        that.asideHide = false
      }
      window.onresize = function temp(){
        that.clientWidth = `${document.documentElement.clientWidth}`;
        if(that.clientWidth<900){
          that.asideHide = true
        }else{
          that.asideHide = false
        }
      }   
    },
    
  },
  components: {
    slideBar,
    menuBar
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
#layout{
  height: 100%;
}
.el-aside{
  background-color:#545c64;
}

</style>
