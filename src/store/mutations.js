import {
  RECODE_USERINFO,
  GET_USERINFO, 
  RESET_NAME,
  SAVE_ADDRESS,
  ADD_CART,
} from './mutation-types'
import {setStore} from '../config/store'
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
  }
}
