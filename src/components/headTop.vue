<template>
  <header class="head-top">
    <slot name="logo" class="head-logo"></slot>
    <div class="goback" v-if="goback" @click="$router.go(-1)">
      <i class="icon iconfont icon-back"></i>
    </div>
    <div class="head-title ellipsis" v-if="headTitle">
      <span class="text">{{ headTitle }}</span>
    </div>
    <router-link :to="userInfo? '/profile' : '/login'" class="login" v-if="signinup">
      <font-icon id="icon-mine" v-if="userInfo"></font-icon>
      <span v-else>登录|注册</span>
    </router-link>
    <slot name="msite-title"></slot>
    <slot name="edit"></slot>
    <slot name="changeCity"></slot>
  </header>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  mounted() {
    this.getUserinfo()
  },
  methods: {
    ...mapActions([
      'getUserinfo'
    ])
  },
  props:['signinup', 'goback', 'headTitle']
}
</script>

<style lang="scss">
  @import "../style/mixin.scss";
  .head-top {
    position: fixed;
    top: 0;
    @include imgLinearGradient(90deg,#0af,#0085ff);
    width: 100%;
    display: flex;
    height: px2rem(45);
    line-height: px2rem(45);
    color: #fff;
    @include fj;
    z-index: 100;
    .text {
      width: px2rem(45);
      color: #fff;
      font-size: px2rem(16);
      text-align: center;
    }
    .goback {
      @include wh(px2rem(45), px2rem(45));
      @include fjc(center);
    }
    .logo {
      @include wh(px2rem(45), px2rem(45));
      @include fjc(center);
      font-size: px2rem(14);
    }
    .icon-mine {
      font-size: px2rem(18);
    }
    .head-title {
      @include center;
      text-align: center;
      max-width: 50%;
      font-weight: 700;
      .text {
        color: #fff;
        font-size: px2rem(18);
      }
    }
    .login {
      color: #fff;
      width: px2rem(45);
      text-align: center;
    }
    .icon-back {
      color: #fff;
    }
  }

</style>
