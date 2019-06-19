import Router from 'koa-router';
import Order from '../dbs/models/order'
import Item from '../dbs/models/item'
import Review from '../dbs/models/review';
import Product from '../dbs/models/product';
import Size from '../dbs/models/size';

let router = new Router({
  prefix: '/order'
})

// 获取所有已支付的订单
router.get('/getAll', async ctx => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let orderList = await Order.where('status').gt(0).lt(8).where('shop._id').equals(id).lean()
    for(var i=0; i<orderList.length;i++){
      var product=[]
      for(var j=0;j<orderList[i].orderItem.length;j++){
        let item = orderList[i].orderItem[j];
        let productItem = await Item.findOne({'_id': item})
        product.push(productItem)
      }
      orderList[i].product = product
    }
    ctx.body = {
      code: 0,
      data: orderList
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 获取订单
// 1为未处理，2为进行中，3为成功，4为失败
router.get('/getOrder', async ctx => {
  let status = ctx.query.status;
  console.log(status)
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let list = await Order.find({'status': status}).where('shop._id').equals(id).lean()
    console.log(id)
    for(var i=0; i<list.length;i++){
      var product=[]
      for(var j=0;j<list[i].orderItem.length;j++){
        let item = list[i].orderItem[j];
        let productItem = await Item.findOne({'_id': item})
        product.push(productItem)
      }
      list[i].product = product
    }
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

// 修改订单状态
router.post('/change', async(ctx)=> {
  let {id, status} = ctx.request.body;
  if (ctx.isAuthenticated()) {
    try{
      let order = await Order.updateOne({'_id': id},{'status': status})
      ctx.body = {
        code: 0,
        msg: '修改成功'
      }
    }catch(e){
      ctx.body = {
        code: -1,
        msg: '修改失败'
      }
    }
    
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 商家拒绝订单
router.post('/refuse', async(ctx) => {
  let {id} = ctx.request.body;
  if (ctx.isAuthenticated()) {
    // 首先将订单状态改变
    // 然后修改商品销量-amount，规格中余量+amount，销量-amount
    let order = await Order.findOne({'_id':id})
    for(var item of order.orderItem){
      let {product, sizeId, amount} = await Item.findOne({'_id': item});
      amount = parseInt(amount)
      let oldProduct = await Product.findOne({'_id': product})
      let newProduct = await Product.updateOne({'_id': product}, {'sales': oldProduct.sales-amount})
      let oldSize = await Size.findOne({'_id': sizeId})

      if(!oldSize.sales){
        oldSize.sales=1
      }
      let newSize = await Size.updateOne({'_id': sizeId},{'amount':parseInt(oldSize.amount)+amount,'sales': oldSize.sales-amount})
    }

    let norder = await Order.updateOne({'_id':id}, {'status': 8});
    let shop =await Shop.findOne({'_id': order.shop_id})
    let nshop = await Shop.update({'_id': order.shop._id}, { 'sales': shop.sales-1})
    ctx.body = {
      code: 0,
      msg: '修改成功'
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 商家同意退款
router.post('/agreeRefund', async(ctx) => {
  let {id} = ctx.request.body;
  if (ctx.isAuthenticated()) {
    // 首先将订单状态改变
    // 然后修改商品销量-1，规格中余量+1，销量-1
    let order = await Order.findOne({'_id':id})
    for(var item of order.orderItem){
      let {product, sizeId, amount} = await Item.findOne({'_id': item});
        amount = parseInt(amount)
      let oldProduct = await Product.findOne({'_id': product})
      let newProduct = await Product.updateOne({'_id': product}, {'sales': oldProduct.sales-amount})
      let oldSize = await Size.findOne({'_id': sizeId})
      if(!oldSize.sales){
        oldSize.sales=1
      }
      let newSize = await Size.updateOne({'_id': sizeId},{'amount':parseInt(oldSize.amount)+amount,'sales': oldSize.sales-amount})
    }

    let norder = await Order.updateOne({'_id':id}, {'status':7});
    let shop =await Shop.findOne({'_id': order.shop_id})
    let nshop = await Shop.update({'_id': order.shop._id}, { 'sales': shop.sales-1})
    ctx.body = {
      code: 0,
      msg: '修改成功'
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 获取首页数据
router.get('/home', async(ctx) => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    console.log(id);
    // 获取新订单，退货订单，催单
    let newOrderLen = await Order.find({'shop._id': id, 'status': 1}).countDocuments();
    let failOrderLen = await Order.find({'shop._id': id, 'status': 6}).countDocuments();
    let hurryOrderLen = await Order.find({'shop._id': id, 'hurry': true}).where('status').gt(0).lt(4).countDocuments();
    // 获取待回复差评，评价
    let badReview = await Review.find({'shop': id, 'like': false, 'ifreply': false}).countDocuments();
    let review = await Review.find({'shop': id, 'like': true,'ifreply': false}).countDocuments();
    let ai = await Review.find({'shop': id});
    console.log(ai)
    // 获取今日订单数
    let now = new Date();
    let date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
    let order = await Order.find({'shop._id': id, 'date': date}).where('status').gt(0).lt(6);
    // 获取今日订单金额
    let total = 0;
    for(var item of order){
      total+= parseFloat(item.total)
    }
    ctx.body = {
      code: 0,
      newOrderLen,
      failOrderLen,
      hurryOrderLen,
      badReview,
      review,
      orderLen: order.length,
      total
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 订单统计，统计已完成的订单
router.get('/finish', async ctx => {
  if (ctx.isAuthenticated()) {
    const id = ctx.session.passport.user._id;
    let orderList = await Order.where('status').gt(3).lt(6).where('shop._id').equals(id).lean()
    for(var i=0; i<orderList.length;i++){
      var product=[]
      for(var j=0;j<orderList[i].orderItem.length;j++){
        let item = orderList[i].orderItem[j];
        let productItem = await Item.findOne({'_id': item})
        product.push(productItem)
      }
      orderList[i].product = product
    }
    ctx.body = {
      code: 0,
      data: orderList
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 获取指定日期订单
router.get('/getDay', async(ctx) => {
  if (ctx.isAuthenticated()) {
    let {day} = ctx.query;
    const id = ctx.session.passport.user._id;
    let orderList = await Order.where('status').gt(3).lt(6).where('shop._id').equals(id).lean()
    let list = []
    for(var i=0; i<orderList.length;i++){
      var product=[]
      let date = new Date(parseInt(orderList[i].number));
      date = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
      if(date==day){
        for(var j=0;j<orderList[i].orderItem.length;j++){
          let item = orderList[i].orderItem[j];
          let productItem = await Item.findOne({'_id': item})
          product.push(productItem)
        }
        orderList[i].product = product
        list.push(orderList[i])
      }
    }
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

export default router;