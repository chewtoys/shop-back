import Router from 'koa-router';
import Product from '../dbs/models/product';
import Size from '../dbs/models/size'
import Shop from '../dbs/models/shop'
import upload from './utils/upload'
import {getNow} from '../../assets/js/util'

let router = new Router({
  prefix: '/product'
})

// 获取所有商品
router.get('/getAll', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const shop = ctx.session.passport.user._id;
    let data = await Product.find({'del':false,shop});
    ctx.body ={
      code: 0,
      data
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 获取单个商品
router.get('/getOne', async (ctx) => {
  let id = ctx.query.id;
  let res = await Product.findOne({'_id': id});
  let size = await Size.find({'product': id})
  ctx.body = {
    code: 0,
    data: res,
    size: size
  }
})

// 添加商品
router.post('/add', upload.array('file', 12), async (ctx) => {
  if (ctx.isAuthenticated()) {
    const shop = ctx.session.passport.user._id;
    // 获取除图片之外的表单数据
    let {name, description, home, type} = ctx.req.body;
    let imgs=[];
    // 获取图片数组
    for (const item of ctx.req.files) {
      imgs.push(item.filename)
    }
    let upTime = getNow();
    let nproduct = await Product.create({
      name,
      description,
      home,
      imgs,
      upTime,
      shop,
      type
    })
    if(nproduct){
      ctx.body = {
        code:0,
        msg: '新增商品成功',
        id: nproduct._id
      }
    }else{
      ctx.body ={
        code: -1,
        msg: '新增商品失败'
      }
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})

// 添加商品规格
router.post('/addSize', async (ctx) => {
  let {
    id,
    name,
    price,
    amount
  } = ctx.request.body;
  try{
    let nsize = await Size.create({
      'product': id,
      name,
      price,
      amount
    })
    ctx.body = {
      code: 0,
      msg: '添加成功',
      data: nsize
    }
  }catch(e){
    ctx.body = {
      code: -1,
      msg: '添加失败'
    }
  } 
})

// 修改商品
router.post('/edit', upload.array('file', 12),async(ctx) => {
  let {
    id,
    name,
    description,
    home,
    oldImg,
    type
  } = ctx.req.body;
  let imgs = oldImg.split(',')
  for (const item of ctx.req.files){
    imgs.push(item.filename)
  }
  let upTime = getNow();
  try{
    let res = await Product.updateOne({'_id':id},{
      name,
      description,
      home,
      upTime,
      imgs,
      type
    })
    ctx.body = {
      code:0,
      msg: '修改商品成功'
    }
  }catch(e){
    ctx.body = {
      code: -1,
      msg: '修改商品失败'
    }
  }
})

// 获取商品的所有规格
router.get('/getSize', async(ctx) => {
  let id = ctx.query.id;
  let size = await Size.find({'product': id})
  ctx.body = {
    code: 0,
    data: size
  }
})

// 修改规格
router.post('/editSize', async(ctx) => {
  let {
    id,
    name,
    price,
    amount
  } = ctx.request.body;
  try{
    let size = await Size.updateOne({
      '_id':id
    },{
      name,
      price,
      amount
    })
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
})

// 删除规格
router.get('/delSize', async(ctx) => {
  let {id} = ctx.query;
  try {
    let size = await Size.remove({'_id':id})
    ctx.body = {
      code: 0,
      msg: '删除成功'
    }
  }catch(e){
    ctx.body = {
      code: -1,
      msg: '删除失败'
    }
  }
})

// 将商品下架
router.get('/invalid', async (ctx) => {
  let id = ctx.query.id;
  let invalid = ctx.query.invalid;
  try{
    let result = await Product.updateOne({'_id':id},{'invalid':invalid})
    ctx.body = {
      code: 0,
      msg: '操作成功'
    }
  }catch(e){
    ctx.body ={
      code: -1,
      msg: '操作失败'
    }
  }
})

// 将商品设为首页轮播
router.get('/home',async(ctx)=> {
  let {id,home} = ctx.query;
  try{
    let res = await Product.updateOne({'_id':id},{
      'home': home
    })
    ctx.body = {
      code: 0,
      msg: '操作成功'
    }
  }catch(e){
    ctx.body ={
      code: -1,
      msg: '操作失败'
    }
  }
})

// 将商品删除
router.get('/del', async (ctx) => {
  let id = ctx.query.id;
  try{
    let result = await Product.updateOne({'_id':id},{'del':true})
    ctx.body = {
      code: 0,
      msg: '删除成功'
    }
  }catch(e){
    ctx.body ={
      code: -1,
      msg: '删除失败'
    }
  }
})

router.get('/statistics', async(ctx) => {
  if (ctx.isAuthenticated()) {
    const shop = ctx.session.passport.user._id;
    let data = await Product.find({'del':false,shop}).lean().sort({sales: -1});
    
    for(var item of data){
      let total = 0;
      let size = await Size.find({
        'product': item._id
      })
      total+=(size.price*size.sales)
      item.total=total
      item.size = size
    }
    ctx.body ={
      code: 0,
      data
    }
  }else{
    ctx.body = {
      code: 1,
      msg: '尚未登录'
    }
  }
})


export default router;