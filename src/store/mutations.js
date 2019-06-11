import {
  RECODE_USERINFO,
  GET_USERINFO,
  RESET_NAME,
  SAVE_ADDRESS,
  RECODE_LONGITUDE_LAGITUDE,
  ADD_CART,
  REDUCE_CART,
  INIT_CART,
  CLEAR_CART,
  RECODE_SHOPDETAIL,
  LOGIN_OUT,
  CHOOSE_ADDRESS,
  RECODE_REMARKDS,
  CONFIRM_INVOICE,
  SAVE_SHOPID,
  SAVE_SEARCH_ADDRESS,
  CONFIRM_ADDRESS,
  ORDER_SUCCESS,
  SAVE_QUESTION_DETAIL,
  SAVE_GEOHASH
} from './mutation-types'
import {setStore, getStore} from '../config/store'
// import { stat } from 'fs'

export default{
  // 保存经纬度
  [RECODE_LONGITUDE_LAGITUDE](state, {longitude, latitude}) {
    state.longitude = longitude,
    state.latitude = latitude
  },
  //记录用户信息
  [RECODE_USERINFO](state,info) {
    state.userInfo = info
    state.login = true
    setStore('user_id', info.user_id)
  },

  //获取用户信息
  [GET_USERINFO](state,info) {
    //判断当前用户是不是同一个用户
    if(state.userInfo && state.userInfo.username !== info.username){
      return
    }else if(!state.login){//判断是否登录
      return
    }else{
      state.userInfo = {...info}
    }
  },

  //重新命名
  [RESET_NAME](state,username) {
    state.userInfo = Object.assign({},state.userInfo,{username})
  },

  //退出登录
  [LOGIN_OUT](state){
    state.userInfo = {}
    state.login = false
  },

  [SAVE_ADDRESS](state, addAddress){
    state.addAddress = addAddress
  },

  [ADD_CART](state, {shopId, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock}){
    let cart = state.cartList
    let shop = cart[shopId] = (cart[shopId] || {})
    let category = shop[category_id] = (shop[category_id] || {})
    let item = category[item_id] = (category[item_id] || {})
    if(item[food_id]){
      item[food_id]['num']++
    }else{
      item[food_id] = {
        num: '1',
        name: name,
        packing_fee: packing_fee,
        price: price,
        sku_id: sku_id,
        specs: specs,
        stock: stock
      }
    }

    state.cartList = {...cart}
    setStore('buycart', state.cartList)
  },

  [REDUCE_CART](state, {shopId, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock}){
    let cart = state.cartList
    let shop = cart[shopId] = (cart[shopId] || {})
    let category = shop[category_id] = (shop[category_id] || {})
    let item = category[item_id] = (category[item_id] || {})
    if(item[food_id]){
      item[food_id]['num']--
      state.cartList = {...cart}
      setStore('buycart',state.cartList)
    }else{
      item[food_id] = null
    }
  },

  [CLEAR_CART](state,shopId){
    state.cartList[shopId] = null
    state.cartList = {...state.cartList}
    setStore('buyCart',state.cartList)
  },

  /**
   * 初始化购物车数据
   */
  [INIT_CART](state) {
    let initCart = getStore('buycart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },

  [RECODE_SHOPDETAIL](state,shop_detail){
    state.shopDetail = shop_detail
  },

  /**
   * 选择地址
   */
  [CHOOSE_ADDRESS](state, {address, index}){
    state.chooseAddress = address
    state.addressIndex = index
  },

  [SAVE_SEARCH_ADDRESS](state, search_address){
    state.search_address = search_address
  },

  /**
   * 订单备注
   */
  [RECODE_REMARKDS](state, {remarkText, inputText}){
    state.remarkText = remarkText
    state.inputText = inputText
  },

  /**
   * 是否开发票
   */
  [CONFIRM_INVOICE](state, invoice){
    state.invoice = invoice
  },

  /**
   * 保存商铺ID
   */
  [SAVE_SHOPID](state, shop_id){
    state.shopId = shop_id
  },

  /**
   * 添加新地址
   */
  [CONFIRM_ADDRESS](state, newAddress){
    state.newAddress = newAddress
  },

  /**
   * 下单成功，保存订单返回信息
   */
  [ORDER_SUCCESS](state, order){
    state.orderMessage = order
    state.cartPrice = null
  },

  /**
   * 保存问题
   */
  [SAVE_QUESTION_DETAIL](state, question){
    state.question = {...question}
  },

  /**
   * 保存geohash
   */
  [SAVE_GEOHASH](state, geohash){
    state.geohash = geohash
  }
}
