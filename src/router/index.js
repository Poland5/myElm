

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * 定义路由组件
 */

// require-ensure
// 说明: require.ensure在需要的时候才下载依赖的模块，当参数指定的模块都下载下来了（下载下来的模块还没执行），便执行参数指定的回调函数。require.ensure会创建一个chunk，且可以指定该chunk的名称，如果这个chunk名已经存在了，则将本次依赖的模块合并到已经存在的chunk中，最后这个chunk在webpack构建的时候会单独生成一个文件。
// 语法: require.ensure(dependencies: String[], callback: function([require]), [chunkName: String])
// dependencies: 依赖的模块数组
// callback: 回调函数，该函数调用时会传一个require参数
// chunkName: 模块名，用于构建时生成文件时命名使用
// 注意点：requi.ensure的模块只会被下载下来，不会被执行，只有在回调函数使用require(模块名)后，这个模块才会被执行。
const home = r => require.ensure([], () => r(require('@/page/home/home.vue')), 'home');
const city = r => require.ensure([], () => r(require('@/page/city/city.vue')), 'city');
const msite = r => require.ensure([], () => r(require('@/page/msite/msite.vue')), 'msite');
const food = r => require.ensure([], () => r(require('@/page/food/food.vue')), 'food');
const login = r => require.ensure([], () => r(require('@/page/login/login.vue')), 'login');
const profile = r => require.ensure([], () => r(require('@/page/profile/profile.vue')), 'profile');
const balance = r => require.ensure([], () => r(require('@/page/balance/balance.vue')), 'balance');
const benefit = r => require.ensure([], () => r(require('@/page/benefit/benefit.vue')), 'benefit');
const hbHistory = r => require.ensure([], () => r(require('@/page/benefit/children/hbHistory.vue')), 'hbHistory');
const info = r => require.ensure([], () => r(require('@/page/profile/children/info.vue')), 'info');
const changeusername = r => require.ensure([], () => r(require('@/page/profile/children/children/changeusername.vue')), 'changeusername');
const address = r => require.ensure([], () => r(require('@/page/profile/children/children/address.vue')), 'address');
const add = r => require.ensure([], () => r(require('@/page/profile/children/children/children/add.vue')), 'add');
const addDetail = r => require.ensure([], () => r(require('@/page/profile/children/children/children/children/addDetail.vue')), 'addDetail');

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component"
const routes = [
  {
    path:'/',
    redirect: '/home',
  },
  {
    path:'/home',
    component: home,
  },
  {
    path:'/city/:cityId',
    component: city,
  },
  {
    path:'/msite',
    component: msite,
    meta:{ keepAlive: true }
  },
  {
    path:'/food',
    component: food,
  },
  {
    path:'/login',
    component: login,
  },
  {
    path:'/balance',
    component: balance,
  },
  {
    path:'/benefit',
    component: benefit,
    children:[{
      path: 'hbHistory',
      component: hbHistory,
    }]
  },
  {
    path:'/profile',
    component: profile,
    children:[{
      path: 'info',
      component: info,
      children:[
        {
          path: 'changeusername',
          component: changeusername
        },
        {
          path: 'address',
          component: address,
          children:[
            {
              path: 'add',
              component: add,
              children:[
                {
                  path: 'addDetail',
                  component: addDetail,
                }
              ]
            }
          ]
        },
      ]
    }]
  },
]
export default new Router({
	routes,
})