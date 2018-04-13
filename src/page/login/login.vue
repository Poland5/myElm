<template>
  <div class="page">
    <head-top head-title='密码登录' goback='true'></head-top>
    <section class="login-container">
      <form class="login-form">
        <section class="input-container">
          <input type="text" placeholder="账号" v-model="userAccount">
        </section>
        <section class="input-container">
          <input type="text" placeholder="密码" v-if="!showPassword" v-model="password">
          <input type="password" placeholder="密码" v-else v-model="password">
          <div class="btn-switch" :class="{change_text: showPassword}" @click="changePasswordType">
            <div class="circle" :class="{move_right: showPassword}"></div>
            <span>abc</span>
            <span>...</span>
          </div>
        </section>
        <section class="input-container">
          <input type="text" placeholder="验证码" v-model="codeNumber">
          <div class="change-captcha-img">
            <img v-if="captchaCodeImg" :src="captchaCodeImg">
            <div class="captcha-txt" @click="changeCaptchaImg">
              <span>看不清</span>
              <span>换一张</span>
            </div>
          </div>
        </section>
      </form>
      <section class="tips">
        <p>温馨提示：未注册过的账号，登录时将自动注册</p>
        <p>注册过的用户可凭账号密码登录</p>
      </section>
      <div class="btn-login" @click="login">登录</div>
    </section>
    <alert-tips v-if="alertShow" :alertTxt='alertTxt' @closeTips='closeTips'></alert-tips>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import alertTips from '@/components/alertTips'
import {mapMutations} from 'vuex'
import {getCaptcha, accountLogin} from '@/api/getData'
export default {
  data () {
    return {
      showPassword: false,    //是否显示密码
      userAccount: null,      //账号
      password: null,         //密码
      captchaCodeImg: null,   //验证码地址
      codeNumber: null,       //验证码
      alertShow:false,        //提示窗
      alertTxt: '',           //提示信息
    }
  },
  components: {
    headTop,
    alertTips
  },
  mounted () {
    this.changeCaptchaImg();
  },
  methods: {
    ...mapMutations([
      'RECODE_USERINFO'
    ]),
    changePasswordType(){
      this.showPassword = !this.showPassword;
    },
    async changeCaptchaImg(){
      const res = await getCaptcha();
      this.captchaCodeImg = res.code;
    },
    async login(){
      if(!this.userAccount){
        this.alertShow = true;
        this.alertTxt = '请输入账号';
        return;
      }else if(!this.password){
        this.alertShow = true;
        this.alertTxt = '请输入密码'
        return;
      }else if(!this.codeNumber){
        this.alertShow = true;
        this.alertTxt = '请输入验证码'
        return;
      }else{
        //获取用户登录信息
        this.userInfo = await accountLogin(this.userAccount, this.password, this.codeNumber);
      }
      if(this.userInfo.status == 0){
        this.alertShow = true;
        this.alertTxt = this.userInfo.message;
        this.changeCaptchaImg();
      }else{
        //记录用户信息
        this.RECODE_USERINFO(this.userInfo);
        this.$router.go(-1);
      }
    },
    closeTips(){
      this.alertShow = false;
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../style/mixin.scss";
  .login-container{
    margin-top: .3rem;
    .login-form{
      background-color: #fff;
    }
    .input-container{
      height: 1rem;
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
        background-color: $green;
      }
    }
  }
  .change-captcha-img{
    @include fjc;
    img{
      @include wh(1.5rem, .6rem);
    }
    .captcha-txt{
      margin-left:.1rem;
      width:.9rem;
      span{
        @include sc(.24rem, #666);
      }
      span:nth-of-type(2){
        color: $blue;
      }
    }
  }
  .tips{
    line-height: .5rem;
    padding: 0 .2rem;
    p{
      @include sc(.24rem, red);
    }
  }
  .btn-login{
    background-color: $green;
    margin: 0 .2rem .2rem;
    border-radius: .1rem;
    color: #fff;
    text-align: center;
    line-height: .8rem;
  }

</style>

