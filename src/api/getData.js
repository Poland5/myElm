import fetch from '../config/fetch'
import { getStore } from '../config/store';

/**
 * 定位城市
 */
export const guessCity = () => fetch('/v1/cities', {type : 'guess'});

/**
 * 获取热门城市
 */
export const hotCity = () => fetch('/v1/cities', {type : 'hot'});

/**
 * 获取所有城市
 */
export const groupCity = () => fetch('/v1/cities', {type : 'group'});

/**
 * 获取选项城市
 */
export const currentCity = (city_id) => fetch('/v1/cities/' + city_id);

/**
 * 获取验证码
 */
export const getCaptcha = () => fetch('/v1/captchas',{}, 'POST');

/**
 * 账户登录
 */
export const accountLogin = (username, password, captcha_code) => fetch('/v2/login', {username, password, captcha_code}, 'POST');

/**
 * 获取用户信息
 */
export const getUser = () => fetch('/v1/user', {user_id:getStore('user_id')})

/**
 * 获取收货地址列表
 */
export const getAddressList = (user_id) => fetch('/v1/users/' + user_id + '/addresses')

/**
 * 添加收货地址
 */
export const postAddress = (user_id, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) => fetch('/v1/users/' + user_id + '/addresses',{
  address,
  address_detail,
  geohash,
  name,
  phone,
  phone_bk,
  poi_type,
  sex,
  tag,
  tag_type
}, 'POST');

/**
 * 删除收货地址
 */
export const deleteAddress = (user_id, address_id) => fetch('/v1/users/' + user_id + '/addresses/' + address_id, {}, 'DELETE')

/**
 * 搜索地址
 */
export const searchAddress = (city_id, keyword) => fetch('/v1/pois',{
  city_id,
  keyword
})

/**
 * 搜索附近地址
 */
export const searchNearBy = (keyword) => fetch('/v1/pois',{
  keyword,
  type:'nearby'
})

/**
 * 搜索餐馆
 */
export const searchFoodRestaurants = (geohash, keyword) => fetch('/v4/restaurants',{geohash, keyword})

/**
 * 红包
 */
export const getHongbao = (user_id, limit, offset) => fetch('/promotion/v2/users/' + user_id + '/hongbaos', {limit, offset})

/**
 * 历史红包
 */
export const gethbHistory = (user_id, limit, offset) => fetch('/promotion/v2/users/' + user_id + '/expired_hongbaos', {limit, offset})

/**
 * 获取食物分类列表
 */
export const foodTypeList = () => fetch('/v2/index_entry');

/**
 * 商铺列表
 */
export const shoplist = (latitude, longitude, offset, limit, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
    let supportStr = ''
    support_ids.forEach(item => {
      if (item.statu) {
        supportStr += '&support_ids[]=' + item.id
      }
    })
    let data = {
      latitude,
      longitude,
      offset,
      limit: '20',
      'extras[]': 'activities',
      keyword: '',
      restaurant_category_id,
      'restaurant_category_ids[]': restaurant_category_ids,
      order_by,
      'delivery_mode[]': delivery_mode + supportStr
    }
    return fetch('/shopping/restaurants', data)
  }

/**
 * 根据经纬度定位
 */
export const posAddress = ( geohash ) => fetch('/v2/pois/' + geohash)

/**
 * 所有商铺分类列表
 */
export const foodCategory = ( latitude, longitude ) => fetch('/shopping/v2/restaurant/category', {
  latitude,
  longitude
})

/**
 * 获取配送方式
 */
export const deliveryMode = () => fetch('/shopping/v1/restaurants/delivery_modes')

/**
 * 商家属性活动列表
 */
export const foodActivity = () => fetch('/shopping/v1/restaurants/activity_attributes')

/**
 * 商铺详情
 */
export const shopDetail = ( shop_id ) => fetch('/shopping/restaurant/' + shop_id)

/**
 * 获取食品菜单列表
 */
export const foodList = ( restaurant_id ) => fetch('/shopping/v2/menu', {restaurant_id})

/**
 * 获取食品列表
 */
export const getScores = restaurant_id => fetch('/ugc/v2/restaurants/' + restaurant_id + '/ratings/scores')

/**
 * 评价分类
 */
export const getRatingTags = restaurant_id => fetch('/ugc/v2/restaurants/' + restaurant_id + '/ratings/tags')

/**
 * 评价信息
 */
export const getRatingInfo = ( restaurant_id, offset, limit ) => fetch('/ugc/v2/restaurants/' + restaurant_id + '/ratings', {offset, limit})

/**
 * 加入购物车
 */
export const checkout = ( geohash, entities, restaurant_id ) => fetch('/v1/carts/checkout',{
  come_from:'web',
  geohash,
  entities,
  restaurant_id
},'POST')

/**
 * 获取备注信息
 */
export const getRemarks = (cart_id) => fetch('/v1/carts/' + cart_id + '/remarks')

/**
 * 下单
 */
 export const postOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => fetch('/v1/users/' + user_id + '/carts/' + cart_id + '/orders',{
	address_id,
	// come_from: "mobile_web",
	// deliver_time: "",
	description,
	entities,
	geohash,
	// paymethod_id: 1,
	sig,
 }, 'POST');

 /**
  * 订单列表
  */
export const getOrderList = (user_id, limit, offset) => fetch('/bos/v2/users/' + user_id + '/orders', {limit, offset});

/**
 * 服务中心
 */
export const getService = () => fetch('/v3/profile/explain');

