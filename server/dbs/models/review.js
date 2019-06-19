import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 订单评价表order
// 订单表id
// 用户表user放 user_id
// 商家id 放shop_id
// 评价时间time
// 评价内容content
// 评价图片 imgs
// 商家是否已回复 ifreply
// 商家回复内容reply
// 商家回复时间replyTime
// 是否为好评like
const ReviewSchema = new Schema({
  order: {type: Schema.ObjectId, ref: 'order'},
  user: String,
  shop: String,
  content: String,
  time: String,
  imgs: Array,
  ifreply: {
    type: Boolean,
    default: false
  },
  reply: {
    type: String,
    default: ''
  },
  replyTime: String,
  like: {
    type: Boolean,
    default: true
  },
  incognito: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('Review', ReviewSchema)