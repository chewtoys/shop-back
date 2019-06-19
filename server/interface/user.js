import Router from 'koa-router';
import Redis from 'koa-redis';
import User from '../dbs/models/user';
import Passport from './utils/passport';
import Message from '../dbs/config';
import upload from './utils/upload'
const fs = require('fs')


let router = new Router({
  prefix: '/user'
})

let Store = new Redis().client

// 注册
router.post('/signup', async (ctx) => {
  const {
    phone,
    password,
    code
  } = ctx.request.body;
  // 验证验证码
  if (code) {
    const saveCode = await Store.hget(`phone:${phone}`, 'code');
    const saveExpire = await Store.hget(`phone:${phone}`, 'expire');
    if (!saveCode) {
      ctx.body = {
        code: -1,
        msg: '您没有发送验证码'
      }
      return false;
    }
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新发送'
        }
        return false;
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
      return false;
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
    return false;
  }
  let user = await User.find({ phone });
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '此手机号已被注册'
    }
    return false;
  }
  let nuser = await User.create({
    phone,
    password
  })
  if (nuser) {
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
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

// 发送验证码
router.get('/verify', async (ctx, next) => {
  let phone = ctx.query.phone;
  const saveExpire = await Store.hget(`phone:${phone}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内一次'
    }
    return false;
  }
  // 生成验证码
  let code = Message.smtp.code();
  let expire = Message.smtp.expire();
  // 存到缓存中
  if (code && expire) {
    Store.hmset(`phone:${phone}`, 'code', code, 'expire', expire);
    ctx.body = {
      code: 0,
      msg: '验证码已发送，可能会有延时，有效期1分钟',
      data: {
        code,
        phone,
        expire
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '验证码发送错误，请稍后再试'
    }
  }
})

// 忘记密码
router.post('/forget', async (ctx) => {
  const {
    phone,
    password,
    code
  } = ctx.request.body;
  // 需要发送验证码
  // 判断验证码是否正确
  // 正确则根据手机号直接修改密码
  if (code) {
    const saveCode = await Store.hget(`phone:${phone}`, 'code');
    const saveExpire = await Store.hget(`phone:${phone}`, 'expire');
    if (!saveCode) {
      ctx.body = {
        code: -1,
        msg: '您没有发送验证码'
      }
      return false;
    }
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false;
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
      return false;
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
    return false;
  }
  let user = await User.find({ phone });
  if (user.length) {
    try {
      let result = await User.update({ 'phone': phone }, {
        password
      })
      ctx.body = {
        code: 0,
        msg: '修改成功',
        data: result
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: '修改失败'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '此手机号未注册'
    }
  }
})

// 修改头像
router.post('/avatar', upload.single('file'),async (ctx,next) => {
  console.log(ctx.req.file)
  if (ctx.isAuthenticated()) {
    const { phone } = ctx.session.passport.user;
    let head=ctx.req.file.filename;
    try {
      let result = await User.update({ phone }, { avatarUrl: head })
      ctx.body = {
        code: 0,
        msg: '修改成功'
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: '修改失败'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '暂未登录'
    }
  }
})

// 修改姓名
router.post('/modifyName', async (ctx) => {
  let { name } = ctx.request.body;
  if (ctx.isAuthenticated()) {
    const { phone } = ctx.session.passport.user;
    try {
      let result = await User.update({ phone }, { name })
      ctx.body = {
        code: 0,
        msg: '修改成功'
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: '修改失败'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '暂未登录'
    }
  }
})

// 修改密码
router.post('/modifyPassword', async (ctx) => {
  let { oldPassword, newPassword } = ctx.request.body;
  if (ctx.isAuthenticated()) {
    const { phone } = ctx.session.passport.user
    let user = await User.findOne({ phone });
    if (user.password === oldPassword) {
      try {
        let result = await User.update({ phone }, { password: newPassword });
        ctx.body = {
          code: 0,
          msg: '修改成功'
        }
      } catch (e) {
        ctx.body = {
          code: -1,
          msg: '修改失败'
        }
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '原密码错误'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '暂未登录'
    }
  }
})

// 退出登录
router.get('/exit', async (ctx, next) => {
  await ctx.logout();
  // 检查现在是否是登录状态
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
      msg: '退出登录成功'
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '退出登录失败'
    }
  }
})

// 获取用户信息
router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const { phone } = ctx.session.passport.user;
    let user = await User.findOne({ phone });
    ctx.body = {
      code: 0,
      data: user
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '暂未登录'
    }
  }
})

// 后台
// 获取所有用户信息
router.get('/getAll', async (ctx) => {
  let users = await User.find({});
  ctx.body = {
    code: 0,
    data: users
  }
})

export default router