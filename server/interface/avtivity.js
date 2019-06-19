import Router from 'koa-router';
import Activity from '../dbs/models/activity'

let router = new Router({
  prefix: '/admin'
})

router.post('/add', async (ctx) => {
  let nproduct = await Activity.create({
    name,
    description,
    price,
    home,
    amount,
    shipping,
    discount,
    rate,
    imgs,
    upTime,
    limit,
    iflimit
  })
  if(nproduct){
    ctx.body = {
      code:0,
      msg: '新增商品成功'
    }
  }else{
    ctx.body ={
      code: -1,
      msg: '新增商品失败'
    }
  }
})

export default router;