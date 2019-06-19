import Router from 'koa-router';
import Review from '../dbs/models/review'
import Order from '../dbs/models/order'
import {getNow} from './utils/util'

let router = new Router({
  prefix: '/review'
})

// 获取店铺所有评价
router.get('/getAll', async(ctx) => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let list = await Review.find({'shop':id}).populate({
      path: 'order',
      model : Order
    })
    ctx.body = {
      code: 0,
      data: list
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 获取店铺未回复的评价
router.get('/unanswered', async(ctx) => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let list = await Review.find({'shop':id, 'ifreply': false}).populate({
      path: 'order',
      model : Order
    })
    ctx.body = {
      code: 0,
      data: list
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 获取店铺已回复的评价
router.get('/replied', async(ctx) => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let list = await Review.find({'shop':id, 'ifreply': true}).populate({
      path: 'order',
      model : Order
    })
    ctx.body = {
      code: 0,
      data: list
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

router.post('/reply', async(ctx) => {
  if (ctx.isAuthenticated()) {
    let {id, reply} =ctx.request.body;
    let now = getNow();
    console.log(id,reply,now)
    let nreview = await Review.update({'_id':id},{
      reply: reply,
      ifreply: true,
      replyTime: now
    })
    ctx.body = {
      code: 0,
      msg: '回复成功'
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

export default router;