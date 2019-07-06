// main.js 是我们的入口文件，主要作用是初始化vue实例并使用需要的插件

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './config/rem'

// icon-font
import fontIcon from '@/components/fontIcon'
import svgIcon from '@/components/svgIcon'
import './style/iconfont.css'
import './style/iconfont.js'

// swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper)
Vue.component('fontIcon', fontIcon)
Vue.component('svgIcon', svgIcon)
Vue.config.productionTip = false

if (module.hot) {
  module.hot.accept();
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
