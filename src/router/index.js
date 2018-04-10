

// import App from '../App.vue';
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
const home = r => require.ensure([], () => r(require('@/page/home/home.vue')), 'home')

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component"
const routes = [
  {
    path:'/',
    component: home
  },
]
export default new Router({
	routes,
})