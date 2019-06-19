import mongoose from 'mongoose'
const Schema = mongoose.Schema


// 管理员admin 账号，密码, true为超级管理员，false为二级管理员
const AdminSchema = new Schema({
  phone: String,
  password: String,
  type: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('Admin', AdminSchema)