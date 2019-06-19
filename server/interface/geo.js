import Router from 'koa-router';
import axios from './utils/axios';

let router = new Router({
  prefix: '/geo'
})


// 获取当前所在城市
router.get('/getPos', async (ctx) => {
  let {
    data: city
  } = await axios.get(`https://elm.cangdu.org/v1/cities?type=guess`)
  if (status === 200) {
    ctx.body = {

      city
    }
  }
})

// 获取所有城市
router.get('/cities', async (ctx) => {
  let {data: city } = await axios.get('https://elm.cangdu.org/v1/cities/?type=group');
  ctx.body = {
    city
  }
})

router.get('/search', async (ctx) => {
  const { id, keyword } = ctx.query;
  let { data } = await axios.get(`https://elm.cangdu.org/v1/pois`, {
    params: {
      city_id: id,
      keyword,
      type: 'search'
    }
  })
  ctx.body = {
    data
  }
})

export default router;