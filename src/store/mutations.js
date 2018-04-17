import {
  RECODE_USERINFO,
  GET_USERINFO, 
  RESET_NAME
} from './mutation-types'
import {setStore} from '../config/store'

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
  }
}
