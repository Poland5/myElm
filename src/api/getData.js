import fetch from '../config/fetch'

export const guessCity = () => fetch('/v1/cities', {type : 'guess'}); //定位城市

export const hotCity = () => fetch('/v1/cities', {type : 'hot'}); //获取热门城市

export const groupCity = () => fetch('/v1/cities', {type : 'group'}); //获取所有城市

export const getCaptcha = () => fetch('/v1/captchas',{}, 'POST'); //获取验证码

export const accountLogin = (username, password, captcha_code) => fetch('/v2/login', {username, password, captcha_code}, 'POST'); //账户登录