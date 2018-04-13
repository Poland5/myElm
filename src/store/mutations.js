import {
  RECODE_USERINFO
} from './mutation-types'
import {setStore} from '../config/store'

export default{
  [RECODE_USERINFO](state,info){
    state.userinfo = info;
    state.login = true;
    setStore('userinfo', info);
  }
}
