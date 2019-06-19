import Koa from 'koa';
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import json from 'koa-json'
import dbConfig from './dbs/config'
import passport from './interface/utils/passport'
import user from './interface/user'
import geo from './interface/geo'
import product from './interface/product'
import address from './interface/address'
import shop from './interface/shop'
import admin from './interface/admin'
import order from './interface/order'
import review from './interface/review'
import path from 'path'
import staticFiles from 'koa-static'

// import koaBody from 'koa-body'


const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.keys=['shop','keyskeys']
app.proxy=true
app.use(session({
  key: 'shop',
  prefix: 'shop: phone',
  store: new Redis()
}))
app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))
app.use(json())

// app.use(koaBody({
//   multipart: true,
//   formidable: {
//     maxFileSize: 200*1024*1024
//   }
// }))

// 指定static目录为静态资源目录，用来存放js,css,img
app.use(staticFiles(path.resolve(__dirname, './static')))


//连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})
app.use(passport.initialize())
app.use(passport.session())

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // 引入路由
  app.use(user.routes()).use(user.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(product.routes()).use(product.allowedMethods())
  app.use(address.routes()).use(address.allowedMethods())
  app.use(shop.routes()).use(shop.allowedMethods())
  app.use(admin.routes()).use(admin.allowedMethods())
  app.use(order.routes()).use(order.allowedMethods())
  app.use(review.routes()).use(review.allowedMethods())
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
