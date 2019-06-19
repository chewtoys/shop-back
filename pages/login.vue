<template>
  <div class="page">
    <img src="../static/img/bg.jpg" class="bg" alt="">
    <div class="form">
      <div class="title">欢迎登录</div>
      <input type="text" v-model="phone" placeholder="账号">
      <input type="text" v-model="password" placeholder="密码">
      <button @click.prevent="login">登录</button>
      <div class="link">
        <router-link to="/reg">去注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  data(){
    return{
      phone: '',
      password: ''
    }
  },
  methods: {
    login(){
      let self = this;
      if(self.phone&&self.password){
        self.$axios.post('/shop/signin',{
          phone: self.phone,
          password: self.password
        }).then(({status, data}) => {
          self.$message(data.msg);
          console.log(data)
          if(data.code===0){
            self.$router.replace('/')
          }
        }).catch((err) => {
          console.log(err)
        })
      }else{
        self.$message('信息填写不完全')
      }
    }
  }
}
</script>

<style scoped>
.page{
  position: absolute;
  width: 100%;
  height: 100%;
}
.page .bg{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
.title{
  margin-bottom: 20px;
  text-align: center;
  color: #fff;
  font-size: 30px;
}
.form{
  position: absolute;
  top: 22%;
  left: 50%;
  transform: translateX(-50%);
}
.form input{
  display: block;
  margin-bottom: 30px;
  padding: 10px 20px;
  border-radius: 30px;
  width: 300px;
  border: 0;
  outline: 0;
}
.form button{
  border-radius: 30px;
  padding: 10px 20px;
  width: 300px;
  border: 0;
  background-color: rgb(95, 119, 255);
  color: #fff;
  outline: 0;
}
.link{
  margin: 10px;
  text-align: right;
}
.link a{
  color: #fff;
  text-decoration: none;
}
</style>
