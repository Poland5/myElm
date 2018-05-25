import {
  RECODE_USERINFO,
  GET_USERINFO, 
  RESET_NAME,
  SAVE_ADDRESS,
  ADD_CART,
  REDUCE_CART,
  INIT_CART,
  CLEAR_CART,
  RECODE_SHOPDETAIL
} from './mutation-types'
import {setStore, getStore} from '../config/store'
import { stat } from 'fs';

export default{
  //记录用户信息
  [RECODE_USERINFO](state,info){
    state.userInfo = info;
    state.login = true;
    setStore('user_id', info.user_id);
  },

  //获取用户信息
  [GET_USERINFO](state,info){
    //判断当前用户是不是同一个用户
    if(state.userInfo && state.userInfo.username !== info.username){
      return;
    }else if(!state.login){//判断是否登录
      return;
    }else{
      state.userInfo = {...info};
    }
  },

  [RESET_NAME](state,username){
    state.userInfo = Object.assign({},state.userInfo,{username});
  },

  [SAVE_ADDRESS](state, addAddress){
    state.addAddress = addAddress;
  },
  
  [ADD_CART](state, {shopId, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock}){
    let cart = state.cartList;
    let shop = cart[shopId] = (cart[shopId] || {});
    let category = shop[category_id] = (shop[category_id] || {});
    let item = category[item_id] = (category[item_id] || {});
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

    state.cartList = {...cart};
    setStore('buycart',state.cartList);
  },

  [REDUCE_CART](state, {shopId, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock}){
    let cart = state.cartList;
    let shop = cart[shopId] = (cart[shopId] || {});
    let category = shop[category_id] = (shop[category_id] || {});
    let item = category[item_id] = (category[item_id] || {});
    if(item[food_id]){
      item[food_id]['num']--;
      state.cartList = {...cart};
      setStore('buycart',state.cartList);
    }else{
      item[food_id] = null
    }
  },

  [CLEAR_CART](state,shopId){
    state.cartList[shopId] = null;
    state.cartList = {...state.cartList};
    setStore('buyCart',state.cartList);
  },

  /**
   * 初始化购物车数据
   */
  [INIT_CART](state){
    let initCart = getStore('buycart');
    if(initCart){
      state.cartList = JSON.parse(initCart);
    }
  },

  [RECODE_SHOPDETAIL](state,shop_detail){
    state.shopDetail = shop_detail;
  }
}
