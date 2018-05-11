import fetch from '../config/fetch'
import { getStore } from '../config/store';

export const guessCity = () => fetch('/v1/cities', {type : 'guess'}); //定位城市

export const hotCity = () => fetch('/v1/cities', {type : 'hot'}); //获取热门城市

export const groupCity = () => fetch('/v1/cities', {type : 'group'}); //获取所有城市

export const currentCity = (city_id) => fetch('/v1/cities/' + city_id); //获取选项城市

export const getCaptcha = () => fetch('/v1/captchas',{}, 'POST'); //获取验证码

export const accountLogin = (username, password, captcha_code) => fetch('/v2/login', {username, password, captcha_code}, 'POST'); //账户登录

export const getUser = () => fetch('/v1/user', {user_id:getStore('user_id')}) //获取用户

export const getAddressList = (user_id) => fetch('/v1/users/' + user_id + '/addresses') //获取收货地址列表

export const addAddress = (user_id) => fetch('/v1/users/' + user_id + '/addresses',{}, 'POST') //增加收货地址

export const deleteAddress = (user_id, address_id) => fetch('/v1/users/' + user_id + '/addresses/' + address_id, {}, 'DELETE') //删除收货地址

export const searchAddress = (city_id, keyword) => fetch('/v1/pois',{city_id, keyword}) //搜索地址

export const searchNearBy = (keyword) => fetch('/v1/pois',{keyword, type:'nearby'}) //搜索地址

export const getHongbao = (user_id, limit, offset) => fetch('/promotion/v2/users/' + user_id + '/hongbaos', {limit, offset}) //红包

export const gethbHistory = (user_id, limit, offset) => fetch('/promotion/v2/users/' + user_id + '/expired_hongbaos', {limit, offset}) //历史红包

export const foodTypeList = () => fetch('/v2/index_entry');  //获取食物分类列表

export const shoplist = (latitude, longitude, offset, restuarant_category_ids = '') => fetch('/shopping/restaurants',{latitude, longitude, offset, restuarant_category_ids});  //获取商铺列表

export const posAddress = (geohash) => fetch('/v2/pois/' + geohash) //根据经纬度定位

export const foodCategory = () => fetch('/shopping/v2/restaurant/category') //所有食品分类列表


