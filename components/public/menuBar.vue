<template>
  <div class="menuWrapper">
    <div class="menuLeft">
      <h3>{{$store.state.currentPage}}</h3>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
  }
}
</script>

<style scoped>
.menuWrapper{
  padding: 10px 0;
  vertical-align: middle;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
}
.menuLeft{
  margin-top: 10px;
  flex:1;
}
#headImg{
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
.el-dropdown-link{
  white-space: nowrap;
}
</style>
