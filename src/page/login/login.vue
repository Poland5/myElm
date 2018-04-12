<template>
  <div class="page">
    <head-top head-title='密码登录' goback='true'></head-top>
    <section class="login-container">
      <form class="loginForm">
        <div class="input-container">
          <input type="text" placeholder="账号">
        </div>
        <div class="input-container">
          <input type="text" placeholder="密码" v-if="!showPassword">
          <input type="password" placeholder="密码" v-else>
          <div class="btn-switch" :class="{change_text: showPassword}" @click="changePasswordType">
            <div class="circle" :class="{move_right: showPassword}"></div>
            <span>abc</span>
            <span>...</span>
          </div>
        </div>
        <div class="input-container">
          <input type="text" placeholder="验证码">
        </div>
      </form>
    </section>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
export default {
  data () {
    return {
      showPassword: false,   //是否显示密码
    }
  },
  components: {
    headTop
  },
  methods: {
    changePasswordType(){
      this.showPassword = !this.showPassword;
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../style/mixin.scss";
  .login-container{
    background-color: #fff;
    margin-top: .3rem;
    .input-container{
      @include fj;
      border-bottom: 1px solid #e4e4e4;
      padding:.3rem .2rem;
      .btn-switch{
        display: flex;
        justify-content: center;
        background-color:#ccc;
        @include wh(1rem, .35rem);
        text-align: center;
        border-radius: .3rem;
        position: relative;
        .circle{
          transition: all .3s;
          background-color: #f1f1f1;
          border-radius: 50%;
          position: absolute;
          @include wh(.6rem, .6rem);
          left: -.1rem;
          top: -.1rem;
        }
        .move_right{
          transform: translateX(.6rem);
        }
        span{
          @include sc(.24rem, #fff);
        }
        span:nth-of-type(2){
          transform: translateY(-.05rem);
          margin-left:.1rem;
        }
      }
      .change_text{
        background-color: #4cd964;
      }
    }
  }
</style>

