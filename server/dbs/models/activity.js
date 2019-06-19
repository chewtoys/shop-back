import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 活动表（满减或满多少包邮）
// id, 参与活动的商品列表product(一个数组里面存放参与活动的商品id)，
// 满足条件的金额price, 活动类型type(包邮false，满减true)
// 如果是满减type=true, 优惠金额数 minus
// 比如price为300，minus为10，即满300减10
// 开始时间到结束时间start, end，活动失效invalid,默认false未失效
const ActivitySchema = new Schema({
  prduct: Array,
  price: String,
  type: Boolean,
  minus: String,
  start: String,
  end: String,
  invalid: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('Activity', ActivitySchema)