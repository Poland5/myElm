// main.js 是我们的入口文件，主要作用是初始化vue实例并使用需要的插件

import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routers from './router'

Vue.use(VueRouter);
// 创建 router 实例，然后传 `routers` 配置
// 你还可以传别的配置参数
const router = new VueRouter({
  routers // （缩写）相当于 routes: routes
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router
}).$mount('#app')
