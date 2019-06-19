import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/user'

// 提交数据（策略）
passport.use(new LocalStrategy({
	usernameField: 'phone',
	passwordField: 'password'
}, async function(username, password, done) {
	let where={
		phone: username
	};
	let result = await UserModel.findOne(where)
	if(result!=null){
		if(result.password===password){
			return done(null, result)
		}else{
			return done(null, false, '密码错误')
		}
	}else{
		return done(null, false, '用户不存在')
	}
}))


// 序列化 ctx.login()触发
passport.serializeUser(function(user, done){
	// console.log('serializeUser',user)
	done(null, user)
})

// 反序列化
// session中存在passport:{user:1}触发
passport.deserializeUser(function(user, done){
	// console.log('deserializeUser:',user);
	return done(null, user)
})

export default passport