<template>
  <div class="page">
    <!-- <head-top head-title='密码登录' goback='true'></head-top> -->
    <section class="login-container">
      <div class="logo">
        <img src="//shadow.elemecdn.com/faas/h5/static/logo.ba876fd.png">
      </div>
      <form class="login-form">
        <section class="input-group">
          <input type="text" placeholder="账号" v-model="userAccount">
        </section>
        <section class="input-group">
          <input type="text" placeholder="密码" v-if="!showPassword" v-model="password">
          <input type="password" placeholder="密码" v-else v-model="password">
          <div class="btn-switch" :class="{change_text: showPassword}" @click="changePasswordType">
            <div class="circle" :class="{move_right: showPassword}"></div>
            <span>abc</span>
            <span>...</span>
          </div>
        </section>
        <section class="input-group">
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
        <p>新用户登录即自动注册，并表示已同意<span>《用户服务协议》</span></p>
      </section>
      <div class="btn-login" @click="login">登录</div>
    </section>
    <alert-tips v-if="alertShow" :alertTxt='alertTxt' @closeTips='closeTips'></alert-tips>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import alertTips from '@/components/alertTips'
import { mapMutations } from 'vuex'
import { getCaptcha, accountLogin } from '@/api/getData'
export default {
  data() {
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
  mounted() {
    this.changeCaptchaImg();
  },
  methods: {
    ...mapMutations([
      'RECODE_USERINFO'
    ]),
    changePasswordType() {
      this.showPassword = !this.showPassword;
    },
    async changeCaptchaImg() {
      const res = await getCaptcha();
      this.captchaCodeImg = res.code;
    },
    async login() {
      if (!this.userAccount) {
        this.alertShow = true;
        this.alertTxt = '请输入账号';
        return;
      } else if (!this.password) {
        this.alertShow = true;
        this.alertTxt = '请输入密码'
        return;
      } else if(!this.codeNumber) {
        this.alertShow = true;
        this.alertTxt = '请输入验证码'
        return;
      } else {
        //获取用户登录信息
        this.userInfo = await accountLogin(this.userAccount, this.password, this.codeNumber);
      }
      if (this.userInfo.status == 0) {
        this.alertShow = true;
        this.alertTxt = this.userInfo.message;
        this.changeCaptchaImg();
      } else {
        //记录用户信息
        this.RECODE_USERINFO(this.userInfo);
        this.$router.go(-1);
      }
    },
    closeTips() {
      this.alertShow = false;
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../style/mixin.scss";
  .page {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #fff;
  }
  .login-container {
    padding: 0 px2rem(30);
    text-align: center;
    .logo {
      img {
        height: px2rem(60);
      }
    }
    .login-form {
      margin-top: px2rem(20);
      background-color: #fff;
      .input-group {
        border: 1px solid #eee;
        border-radius: 5px;
        @include fjc;
        margin-bottom: px2rem(15);
        height: px2rem(50);
        input {
          background-color: transparent;
          flex-grow: 1;
          height: 100%;
          padding-left: px2rem(10);
          font-size: px2rem(14);
        }
        input:focus {
          border-color: #0089dc;
        }
        .btn-switch {
          background-color:#ccc;
          @include wh(px2rem(40), px2rem(16));
          @include fjc(center);
          text-align: center;
          border-radius: px2rem(15);
          position: relative;
          margin-right: px2rem(5);
          .circle {
            transition: all .3s;
            background-color: #f1f1f1;
            border-radius: 50%;
            position: absolute;
            @include wh(px2rem(25), px2rem(25));
            left: px2rem(-5);
            top: px2rem(-5);
          }
          .move_right {
            transform: translateX(px2rem(25));
          }
          span {
            @include sc(px2rem(12), #fff);
          }
          span:nth-of-type(2) {
            margin-left:px2rem(5);
          }
        }
        .change_text {
          background-color: $green;
        }
      }
    }
  }
  .change-captcha-img {
    @include fjc;
    img {
      @include wh(1.5rem, px2rem(30));
    }
    .captcha-txt {
      margin-left: px2rem(5);
      width: px2rem(45);
      span {
        @include sc(px2rem(12), #666);
      }
      span:nth-of-type(2) {
        color: $blue;
      }
    }
  }
  .tips {
    line-height: px2rem(25);
    text-align: left;
    p {
      @include sc(px2rem(14), #999);
      span {
        @include sc(px2rem(14), $blue);
      }
    }
  }
  .btn-login {
    background-color: $green;
    margin-top: px2rem(20);
    border-radius: px2rem(5);
    @include sc(px2rem(16), #fff);
    text-align: center;
    line-height: px2rem(45);
  }

</style>

