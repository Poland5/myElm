import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

const state = {
  userInfo: null,     //用户信息
  login: true,        //登录
  addAddress: null,   //添加地址
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
})
