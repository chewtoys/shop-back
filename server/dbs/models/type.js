import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 店铺分类表
// 分类名称name, 分类排序idx, 分类图片img
const TypeSchema = new Schema({
  name: String,
  idx: {
    type: Number,
    default: 0
  },
  img: String
})

export default mongoose.model('Type', TypeSchema)