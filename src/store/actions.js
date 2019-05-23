
/**
 * Action 提交的是mutation, 而不是更改状态值。
 * Action 可以包含任意的异步操作。
 */

import {getUser} from '@/api/getData'
import {GET_USERINFO} from './mutation-types'

export default {

  async getUserinfo({commit}){
    let res = await getUser()
    commit(GET_USERINFO, res)
  }
}
