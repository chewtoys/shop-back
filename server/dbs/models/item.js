import mongoose from 'mongoose'
const Schema = mongoose.Schema

// id, 订单表id order_id, 商品名name, 商品第一张图片img，购买数量amount
// 餐品单价price，折扣率rate, 折扣之后的金额 currentPrice
// 商品规格名,product 商品id

const ItemSchema = new Schema({
  product: String,
  name: String,
  img: String,
  size: String,
  sizeId: String,
  amount: String,
  price: String
})

export default mongoose.model('Item', ItemSchema)