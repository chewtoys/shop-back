import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 规格表 size
// 销量 sales
// 商品id product_id，商品规格名name, 商品价格price, 商品余量amount
const SizeSchema = new Schema({
  product: String,
  name: String,
  price: String,
  amount: Number,
  sales: {
    type: Number,
    default: 0
  }
})

export default mongoose.model('Size', SizeSchema)