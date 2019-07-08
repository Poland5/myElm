import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

const state = {
  userInfo: null,                   // 用户信息
  login: true,                      // 登录
  addAddress: null,                 // 添加地址
  cartList: {},                     // 购物车食物列表
  shopDetail: {},                   // 记录商铺详情
  chooseAddress: '',                // 选择用户地址
  remarkText: null,                 // 提供备注信息
  inputText: null,                  // 填写备注信息
  invoice: false,                   // 发票
  shopId: null,                     // 商铺ID
  addressIndex: null,               // 选择索引地址
  search_address: null,             // 搜索地址
  geohash: null,                    // geohash地址
  longitude: '',                    // 经度
  lagitude: '',                     // 维度
  newAddress: null,                 // 新地址
  orderMessage: null,               // 订单返回信息
  cartPrice:null,                   // 会员卡价格
  question: null,                   // 问题标题和内容
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
})
