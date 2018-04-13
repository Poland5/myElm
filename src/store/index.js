import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations';

Vue.use(Vuex);

const state = {
  userinfo: null,    //用户信息
}

export default new Vuex.Store({
  state,
  mutations,
})
