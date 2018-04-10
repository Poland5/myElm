// main.js 是我们的入口文件，主要作用是初始化vue实例并使用需要的插件

import Vue from 'vue'
import App from './App'
import router from './router'
import './config/rem'
// 创建 router 实例，然后传 `routers` 配置
// 你还可以传别的配置参数

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
