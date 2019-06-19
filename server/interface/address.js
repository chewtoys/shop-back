import Router from 'koa-router';
import Address from '../dbs/models/address'

let router = new Router({
    prefix: '/address'
})

// 新增收货地址
router.post('/add', async (ctx) => {
    if (ctx.isAuthenticated()) {
        let user_id = ctx.session.passport.user._id;
        const {
            name,
            phone,
            address,
            longitude,
            latitude,
            houseNum,
            defaulted
        } = ctx.request.body;
        let naddress = new Address({
            user_id,
            name,
            phone,
            address,
            longitude,
            latitude,
            houseNum,
            defaulted
        })
        // 如果新添加地址为默认地址，则将已有默认地址替换
        if(defaulted){
            let defaultAddress = await Address.updateMany({
                user_id,
                del: false,
                defaulted: true
            }, {
                defaulted: false
            })
        }
        let result = await naddress.save()
        if (result) {
            ctx.body = {
                code: 0,
                msg: '添加成功'
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '添加失败'
            }
        }

    } else {
        ctx.body = {
            code: -1,
            msg: '暂未登录'
        }
    }
})

// 修改收货地址
router.post('/edit', async (ctx) => {
    if (ctx.isAuthenticated()) {
        let user_id = ctx.session.passport.user._id;
        const {
            id,
            name,
            phone,
            address,
            longitude,
            latitude,
            houseNum,
            defaulted
        } = ctx.request.body;
        // 如果新添加地址为默认地址，则将已有默认地址替换
        if(defaulted){
            let defaultAddress = await Address.updateMany({
                user_id,
                del: false,
                defaulted: true
            }, {
                defaulted: false
            })
        }
        try {
            let result = await Address.updateOne({ '_id':id, user_id, del: false }, {
                name,
                phone,
                address,
                longitude,
                latitude,
                houseNum,
                defaulted
            })
            ctx.body = {
                code: 0,
                msg: '修改成功',
                data: result
            }
        } catch (e) {
            ctx.body = {
                code: -1,
                msg: '修改失败'
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '暂未登录'
        }
    }
})

// 删除地址
router.get('/del', async (ctx) => {
    if (ctx.isAuthenticated()) {
        let id = ctx.query.id;
        console.log(id);
        try {
            let result = await Address.update({ '_id': id}, { 'del': true })
            ctx.body = {
                code: 0,
                msg: '删除成功'
            }
        } catch (e) {
            ctx.body = {
                code: -1,
                msg: '删除失败'
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '暂未登录'
        }
    }
})

// 获取单个地址
router.get('/getOne', async ctx => {
    if (ctx.isAuthenticated()) {
        let user_id = ctx.session.passport.user._id;
        let id = ctx.query.id;
        try {
            let result = await Address.findOne({ '_id': id, user_id,'del': false })
            ctx.body = {
                code: 0,
                data: result
            }
        } catch (e) {
            ctx.body = {
                code: -1,
                data: {},
                msg: '此地址不存在'
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '暂未登录'
        }
    }
})

// 获取该用户所有地址
router.get('/getAll', async ctx => {
    if (ctx.isAuthenticated()) {
        let user_id = ctx.session.passport.user._id;
        try {
            let result = await Address.find({ user_id, 'del': false })
            ctx.body = {
                code: 0,
                data: result
            }
        } catch (e) {
            ctx.body = {
                code: -1,
                data: []
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '暂未登录'
        }
    }
})

// 管理员获取用户所有地址
router.get('/getAddress', async ctx=> {
    let user_id = ctx.query.user_id;
    try {
        let result = await Address.find({ user_id, 'del': false })
        ctx.body = {
            code: 0,
            data: result
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            data: []
        }
    }
})

export default router