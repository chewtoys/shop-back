import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 商品表 product
// id, name, 商品简介description，销量sales，
// 价格price，图片img，详情图片detail，是否推荐home
// 上架时间time, 好评数like
// 失效invalid(当没有余量或商家下架为true)，是否删除del（删除商品则为true）
// 店铺id, shop_id, 分类type Number

const ProductSchema=new Schema({
	name: String,
  description: String,
	sales: {
    type: Number,
    default: 0
  },
  upTime: String,
  imgs: Array,
  home: {
    type: Boolean,
    default: false
  },
  like: {
    type: Number,
    default: 0
  },
  invalid: {
    type: Boolean,
    default: false
  },
  del: {
    type: Boolean,
    default: false
  },
  shop: [{type: Schema.Types.ObjectId, ref: 'shop'}],
  type: {
    type: Number,
    default: 0
  }
})

export default mongoose.model('Product', ProductSchema)