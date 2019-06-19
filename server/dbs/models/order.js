import mongoose from 'mongoose'
const Schema = mongoose.Schema

// id, 订单号number
// 配送方式way（0为自取，1为商家配送）
// 商家的_id shop
// 订单状态 status 0未付款，1已付款，2正在处理餐品，3已做好通知用户取餐或商家配送
// 4用户收到货，点击了确认收货，5用户评价，订单完成，6用户申请退款 7.退款成功
// 8 商家拒绝订单
// 商品列表orderItem表，下单日期date, 下单时间time
// 备注 remark，用户选择的送达时间arrivalTime,
// 用户id user_id,地址address(手机号phone,用户的经纬度 longitude,latitude)
// 商品总金额money, 运费fee, 订单总价total
// 用户催单 hurry
// 是否匿名incognito(true为匿名，false不匿名)
// 评论id review

const OrderSchema = new Schema({
  number: String,
  shop: Object,
  way: String,
  status: {
    type: Number,
    default: 0
  },
  date: String,
  time: String,
  orderItem: Array,
  remark: String,
  arrivalTime: {
    type: String,
    default: '尽快送达'
  },
  user_id: String,
  address: Object,
  money: String,
  fee: String,
  total: String,
  hurry: {
    type: Boolean,
    default: false
  },
  incognito: {
    type: Boolean,
    default: false
  },
  review: {
    type: String,
    default: ''
  }
})

export default mongoose.model('Order', OrderSchema)