import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 店铺表
// id, 店铺名称name,店铺图标icon, 商家配送时间delivery, 店铺好评数like，
// 店铺销量sales，店铺公告notice, 商家品类type, 商家地址address,
// 城市city  经度Longitude 纬度latitude
// 是否支持自取 pick
// 商家电话phone, 商家营业时间businessHour
// 店长名称owner, 店铺图片imgs, 商品分类goodType
// 满多少配送full， 配送费fee
// 店铺登录账号密码
// 店铺状态 0 可以开店 1 不可以开店
// 商家关闭店铺close true

const ShopSchema = new Schema({
  phone: String,
  password: String,
  name: String,
  tel: String,
  icon: String,
  delivery: String,
  pick: {
    type: Boolean,
    default: true
  },
  like: {
    default: 0,
    type: Number
  },
  sales: {
    default: 0,
    type: Number
  },
  notice: {
    default: '暂无公告',
    type: String
  },
  type: {
    type: Number,
    default: 0
  },
  city: String,
  address: String,
  detail: String,
  longitude:String,
  latitude: String,
  bussinessHour: {
    type: String,
    default: ''
  },
  imgs: Array,
  description: String,
  owner: String,
  imgs: Array,
  full: String,
  fee: String,
  goodType: Array,
  status: {
    type: Number,
    default: 0
  },
  close: {
    type: Boolean,
    default: true
  }
})

export default mongoose.model('Shop', ShopSchema)