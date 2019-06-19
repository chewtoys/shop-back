import Router from 'koa-router';
import Redis from 'koa-redis';
import Shop from '../dbs/models/shop'
import upload from './utils/upload'
import Passport from './utils/shop';
import Type from '../dbs/models/type';

let router = new Router({
  prefix: '/shop'
})

let Store = new Redis().client

// 注册
router.post('/signup', async (ctx) => {
  const {
    phone,
    password
  } = ctx.request.body;
  let user = await Shop.find({ phone });
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '此账号已被注册'
    }
    return false;
  }
  let nshop = await Shop.create({
    phone,
    password
  })
  if (nshop) {
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

// 完善信息
router.post('/perinfo', upload.single('icon'),async (ctx) => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let {
      name,
      fee,
      full,
      delivery,
      owner,
      tel,
      type,
      city,
      address,
      longitude,
      latitude,
      detail
    } = ctx.req.body;
    let icon = ctx.req.file.filename;
    try {
      let res = await Shop.updateOne({ '_id': id }, {
        icon,
        name,
        fee,
        full,
        delivery,
        owner,
        tel,
        type,
        city,
        address,
        longitude,
        latitude,
        detail
      })
      ctx.body = {
        code: 0,
        msg: '完善信息成功'
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: '完善信息失败'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '暂未登录'
    }
  }
})

// 获取商铺信息
router.get('/infor', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let res = await Shop.findOne({ '_id': id }, { 'password': 0 });
    ctx.body = {
      code: 0,
      data: res
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '暂未登录'
    }
  }
})

// 修改商家信息
router.post('/setting',async(ctx) => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let {
      owner,
      tel,
      address,
      detail,
      longitude,
      latitude,
      city
    } = ctx.request.body;
    try {
      let res = await Shop.updateOne({ '_id': id }, {
        owner,
        tel,
        address,
        detail,
        longitude,
        latitude,
        city
      })
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
      code: 1,
      msg: '暂未登录'
    }
  }
})

// 修改店铺信息
router.post('/setShop', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let {
      name,
      fee,
      full,
      delivery,
      notice,
      type,
      close,
      bussinessHour
    } = ctx.request.body;

    // 如果要开店铺，判断商家是否被禁用
    if(close==false){
      let shop = await Shop.findOne({'_id': id})
      if(shop.status===1){
        ctx.body = {
          code: -1,
          msg: '管理员禁止店铺开店，如有疑问，可拨打电话17875512026询问'
        }
        return false;
      }
    }
    try {
      let res = await Shop.updateOne({ '_id': id }, {
        name,
        fee,
        full,
        delivery,
        notice,
        close,
        type,
        bussinessHour
      })
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
      code: 1,
      msg: '暂未登录'
    }
  }
})

// 修改店铺图标
router.post('/icon', upload.single('icon'), async(ctx) => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let icon = ctx.req.file.filename;
    try{
      let res = await Shop.updateOne({'_id': id},{
        icon
      })
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
  }else{
    ctx.body = {
      code: 1,
      msg: '暂未登录'
    }
  }
})

// 添加商品分类
router.post('/addType', async (ctx) => {
  let { name } = ctx.request.body;
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let res = await Shop.findOne({ '_id': id }, { 'goodType': 1 })
    console.log(res)
    let oldType = res.goodType;
    oldType.push(name)
    try {
      let data = await Shop.updateOne({ '_id': id }, { goodType: oldType })
      ctx.body = {
        code: 0,
        msg: '添加成功'
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: '添加失败'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '暂未登录'
    }
  }
})

// 修改分类
router.post('/editType', async (ctx) => {
  let { idx, name } = ctx.request.body;
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let res = await Shop.findOne({ '_id': id }, { 'goodType': 1 })
    let oldType = res.goodType;
    oldType.splice(idx, 1, name)
    console.log(oldType)
    try {
      let data = await Shop.updateOne({ '_id': id }, { goodType: oldType })
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
      code: 1,
      msg: '暂未登录'
    }
  }
})

// 删除分类
router.post('/delType', async (ctx) => {
  let { idx } = ctx.request.body;
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let res = await Shop.findOne({ '_id': id }, { 'goodType': 1 })
    let oldType = res.goodType;
    oldType.splice(idx, 1)
    console.log(oldType)
    try {
      let data = await Shop.updateOne({ '_id': id }, { goodType: oldType })
      ctx.body = {
        code: 0,
        msg: '删除成功'
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        msg: '删除失败'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '暂未登录'
    }
  }
})

// 获取店铺分类
router.get('/getType', async(ctx) => {
  let res = await Type.find({}).sort({'idx':1})
  ctx.body = {
    code: 0,
    data: res
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
export default router;