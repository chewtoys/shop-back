import mongoose from 'mongoose'
const Schema = mongoose.Schema

// id，用户id user, 商品id，商品数量amount, 规格id

const CartSchema=new Schema({
	user: String,
  product: {type: Schema.ObjectId, ref: 'products'},
  size: {type: Schema.ObjectId, ref: 'sizes'},
  shop: {type: Schema.ObjectId, ref: 'shop'},
  num: Number,
  checked: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('Cart', CartSchema)