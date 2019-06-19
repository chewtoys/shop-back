import Router from 'koa-router';
import Redis from 'koa-redis';
import Admin from '../dbs/models/admin'
// import Passport from './utils/admin';

let router = new Router({
  prefix: '/admin'
})

let Store = new Redis().client

// 注册
router.post('/signup', async (ctx) => {
  const {
    phone,
    password
  } = ctx.request.body;
  let user = await Admin.find({ phone });
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '此账号已被注册'
    }
    return false;
  }
  let nadmin = await Admin.create({
    phone,
    password
  })
  if (nadmin) {
    ctx.body = {
      code: 0,
      msg: '注册成功'
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

// 登录
router.post('/signin', async (ctx, next) => {
  let {phone, password} = ctx.request.body;
  let admin = await Admin.findOne({phone});
  console.log(admin)
  if(admin){
    let result = await Admin.findOne({
      phone,
      password
    }) 
    if(result){
      ctx.body = {
        code: 0,
        msg: '登录成功',
        data: result
      }
    }else{
      ctx.body = {
        code: -1,
        msg: '密码错误'
      }
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '此手机号未注册'
    }
  }
})

export default router;