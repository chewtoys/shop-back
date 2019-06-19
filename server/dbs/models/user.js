import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema=new Schema({
	name: {
		type: String,
		default: ''
	},
	phone: {
		type: String,
		required: true
	},
	password: {
		type: String,
		require: true
	},
	avatarUrl: {
		type: String,
		default: ''
	},
	pay: {
		type: String,
		default: '123456'
	}
})

export default mongoose.model('User', UserSchema)