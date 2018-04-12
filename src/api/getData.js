import fetch from '../config/fetch'

export const guessCity = () => fetch('/v1/cities', {type : 'guess'}); //定位城市

export const hotCity = () => fetch('/v1/cities', {type : 'hot'}); //热门城市

export const groupCity = () => fetch('/v1/cities', {type : 'group'}); //热门城市

