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
    <slot name="msite-title"></slot>
    <slot name="edit"></slot>
    <slot name="changeCity"></slot>
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
    height: px2rem(45);
    position: fixed;
    top: 0;
    color: #fff;
    line-height: px2rem(45);
    display: flex;
    @include fj;
    z-index: 100;
    span{
      color: #fff;
      font-size: px2rem(14);
    }
    .goback{
      @include wh(px2rem(45), px2rem(45));
      @include fjc(center);
    }
    .head-title{
      @include center;
      text-align: center;
      max-width: 50%;
      font-weight: 700;
      span{
        color: #fff;
        font-size: px2rem(18);
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
