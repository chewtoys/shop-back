import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 地址表 address
// id, 用户id user_id, 用户名name, 手机号phone, 是否为默认地址
// 详细地址address, 经度longitude， 纬度latitude
// 是否被删除del true为被删除

const AddressSchema=new Schema({
	user_id: String,
  name: String,
  phone: String,
  city: String,
  address: String,
  longitude: String,
  latitude: String,
  houseNum: String,
  defaulted: {
    type: Boolean,
    default: false
  },
  del: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('Address', AddressSchema)