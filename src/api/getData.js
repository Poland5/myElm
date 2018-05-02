import fetch from '../config/fetch'
import { getStore } from '../config/store';

export const guessCity = () => fetch('/v1/cities', {type : 'guess'}); //定位城市

export const hotCity = () => fetch('/v1/cities', {type : 'hot'}); //获取热门城市

export const groupCity = () => fetch('/v1/cities', {type : 'group'}); //获取所有城市

export const getCaptcha = () => fetch('/v1/captchas',{}, 'POST'); //获取验证码

export const accountLogin = (username, password, captcha_code) => fetch('/v2/login', {username, password, captcha_code}, 'POST'); //账户登录

export const getUser = () => fetch('/v1/user', {user_id:getStore('user_id')}) //获取用户

export const getAddressList = (user_id) => fetch('/v1/users/' + user_id + '/addresses') //获取收货地址列表

export const addAddress = (user_id) => fetch('/v1/users/' + user_id + '/addresses',{}, 'POST') //增加收货地址

export const deleteAddress = (user_id, address_id) => fetch('/v1/users/' + user_id + '/addresses/' + address_id, {}, 'DELETE') //删除收货地址

export const searchAddress = (city_id, keyword) => fetch('/v1/pois',{city_id, keyword}) //搜索地址

export const searchNearBy = (keyword) => fetch('/v1/pois',{keyword, type:'nearby'}) //搜索地址