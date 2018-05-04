<template>
  <header class="head-top">
    <slot name="logo" class="head-logo"></slot>
    <div class="goback" v-if="goback" @click="$router.go(-1)">
      <i class="icon iconfont icon-back"></i>
    </div>
    <div class="head-title ellipsis" v-if="headTitle">
      <span>{{headTitle}}</span>
    </div>
    <router-link :to="userInfo? '/profile' : '/login'" class="login" v-if="signinup">
      <i class="icon iconfont icon-mine" v-if="userInfo"></i>
      <span v-else>登录|注册</span>
    </router-link>
    <slot name="edit"></slot>
  </header>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  mounted(){
    this.getUserinfo();
  },
  methods: {
    ...mapActions([
      'getUserinfo'
    ])
  },
  props:['signinup','goback','headTitle']
}
</script>

<style lang="scss">
  @import "../style/mixin.scss";
  .head-top{
    background: #3190e8;
    width: 100%;
    height: 1rem;
    position: fixed;
    top: 0;
    color: #fff;
    line-height: 1rem;
    padding: 0 .15rem;
    display: flex;
    @include fj;
    z-index: 100;
    span{
        color: #fff;
    }
    .head-title{
      @include center;
      text-align: center;
      width: 3rem;
      span{
        color: #fff;
      }
    }
    .login{
      color: #fff;
    }
    .icon-back{
      color: #fff;
    }
  }
 
</style>
