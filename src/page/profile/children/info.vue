<template>
<div class="fixed-page">
  <!-- <head-top goback="true" headTitle="账号信息"></head-top> -->
  <dl class="userInfo-list">
    <dt class="userInfo-dt">
      <input type="file" class="avatar-upload" @change="uploadAvatar">
      <div class="userInfo-link">
        <b>头像</b>
        <div class="right-side">
          <img :src="imgBaseUrl + userInfo.avatar" v-if="userInfo">
          <i class="icon iconfont icon-avatar" v-else></i>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </div>
    </dt>
    <dt class="userInfo-dt">
      <router-link to="/profile/info/changeusername" class="userInfo-link">
        <b>用户名</b>
        <div class="right-side">
          <span>{{username}}</span>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </router-link>
    </dt>
    <dt class="userInfo-dt">
      <router-link to="/profile/info/address" class="userInfo-link">
        <b>收货地址</b>
        <div class="right-side">
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </router-link>
    </dt>
    <dt class="userInfo-dt-tips">
      <span>账号绑定</span>
    </dt>
    <dt class="userInfo-dt">
      <div class="userInfo-link">
        <div class="left-side">
          <i class="icon iconfont icon-phone2"></i>
          <span>手机</span>
        </div>
        <div class="right-side">
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </div>
    </dt>
    <dt class="userInfo-dt-tips">
      <span>安全设置</span>
    </dt>
    <dt class="userInfo-dt">
      <router-link class="userInfo-link" to="/profile/info/resetpassword">
        <span>登录密码</span>
        <div class="right-side">
          <span>修改</span>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </router-link>
    </dt>
  </dl>
  <section class="exit-login" @click="exitLogin">退出登录</section>
  <section class="cover-container" v-show="showCover">
    <div class="bg-cover"></div>
    <section class="cover-box" :class="{bouceAnimator:isEnter, leaveAnimator:isLeave}">
      <div class="mark">
        <span class="line"></span>
        <span class="dot"></span>
      </div>
      <h1>是否退出登录</h1>
      <footer class="footer-btn">
        <span class="wait" @click="wait">在等等</span>
        <span class="login-out" @click="loginOut">退出登录</span>
      </footer>
    </section>
  </section>
  <transition name="router-slide">
    <router-view></router-view>
  </transition>
</div>
</template>
<script>
import {imgBaseUrl} from '@/config/env'
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
  data () {
    return {
      imgBaseUrl,
      avatar:'',
      username:'',
      showCover:false,
      isEnter:false,
      isLeave:false,
    }
  },
  computed:{
    ...mapState([
      'userInfo'
    ])
  },
  mounted() {
    this.getUserinfo();
  },
  methods:{
    ...mapActions([
      'getUserinfo'
    ]),
    ...mapMutations([
      'LOGIN_OUT'
    ]),
    async uploadAvatar(){
      if(this.userInfo){
        let input = document.querySelector('.avatar-upload');
        let data = new FormData();
        data.append('file', input.files[0]);
        try{
          let response = await fetch('/eus/v1/users/' + this.userInfo.user_id + '/avatar', {
            method: 'POST',
            credentials: 'include',
            body: data
          })
          let res = await response.json();
          if(res.status == 1){
            this.userInfo.avatar = res.image_path;
          }
        }catch(error){
          throw new Error(error)
        }
      }
    },
    exitLogin(){
      this.showCover = true;
      this.isEnter = true;
      this.isLeave = false;
    },
    wait(){
      this.isEnter = false;
      this.isLeave = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.showCover = false;
      },200)
    },
    loginOut(){
      this.LOGIN_OUT();
      this.$router.go(-1);
    }
  },
  watch: {
    userInfo(value){
      if(value && value.user_id){
        this.avatar = value.avatar;
        this.username = value.username;
      }
    }
  }
}
</script>
<style lang="scss">
  @import '../../../style/mixin';
  .fixed-page {
    position: fixed;
    top: 0;
    padding-top: 0;
    z-index: 101;
  }
  .userInfo-list {
    .userInfo-dt {
      position: relative;
      &::before {
        @include border(bottom, #eee, 0)
      }
      padding: px2rem(14) px2rem(10);
      background-color: #fff;
      position: relative;
      a {
        color:#333;
      }
      .avatar-upload {
        position: absolute;
        @include wh(100%, 100%);
        opacity: 0;
        top: 0;
        left: 0;
      }
      .userInfo-link {
        @include fjc;
        b {
          font-size: px2rem(16);
        }
        .right-side {
          @include fc;
          img {
            @include wh(px2rem(50), px2rem(50));
            border-radius: 50%;
          }
          .icon-go {
            color: #666;
            margin-left:px2rem(5);
          }
        }
      }
      .left-side {
        @include fc;
      }
      .icon-phone2 {
        color:$blue;
        margin-right:px2rem(5);
      }
    }
    .userInfo-dt-tips {
      padding:px2rem(14) px2rem(10);
      span {
        @include sc(.24rem, #666);
      }
    }
  }
  .exit-login {
    padding: px2rem(14) 0;
    margin: px2rem(25) 0;
    background-color: #fff;
    text-align: center;
    @include sc(px2rem(14), #d8584a);
  }
  .cover-container {
    position: absolute;
    top: 0;
    @include wh(100%,100%);
    z-index: 102;
    .bg-cover {
      background-color: rgba($color: #000000, $alpha: .2);
      @include wh(100%,100%);
    }
    .cover-box {
      background-color: #fff;
      position: absolute;
      top: px2rem(150);
      left: px2rem(16.5);
      width: 90%;
      padding: px2rem(25);
      text-align: center;
      border-radius: px2rem(5);
      .mark {
        position: relative;
        border:4px solid #f8bb86;
        @include wh(px2rem(90),px2rem(90));
        border-radius: 50%;
        margin: 0 auto;
        .line {
          @include wh(px2rem(5), px2rem(50));
          background-color: #f8bb86;
          display:inline-block;
          border-radius: px2rem(5);
          margin-top:px2rem(10);
        }
        .dot {
          @include wh(px2rem(5), px2rem(5));
          background-color: #f8bb86;
          display:block;
          margin-top:px2rem(10);
          border-radius: px2rem(5);
          margin: 0 auto;
        }
      }
      h1 {
        @include sc(px2rem(25), #666);
        margin-top: px2rem(10);
      }
      .footer-btn {
        margin-top: px2rem(25);
        span {
          @include sc(.24rem, #666);
        }
        .wait {
          background-color: #c1c1c1;
          color: #fff;
          text-align: center;
          display: inline-block;
          padding: px2rem(10) px2rem(15);
          border-radius: px2rem(5);

        }
        .login-out {
          background-color: $red;
          text-align: center;
          color: #fff;
          display: inline-block;
          border-radius: px2rem(5);
          padding: px2rem(10) px2rem(15);
          margin-left: px2rem(10);
        }
      }
    }
  }
  .bouceAnimator {
    animation: bouceIn .6s;
    transition: all .1s;
  }
  @-webkit-keyframes zoomOut  {
    from {
      opacity: 1;
    }
    50% {
      -webkit-transform: scale(.3, .3);
      transform: scale(.3, .3);
      opacity: 0;;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes zoomOut  {
    from {
      opacity: 1;
    }
    50% {
      -webkit-transform: scale(.3, .3);
      transform: scale(.3, .3);
      opacity: 0;;
    }
    100% {
      opacity: 0;
    }
  }
  .leaveAnimator {
    animation: zoomOut .4s;
  }
  @keyframes bouceIn  {
    from, 20%, 40%, 60%, 80%, 100% {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }
    0% {
      opacity: 0;
      -webkit-transform: scale(.3, .3);
      transform: scale(.3, .3);
    }
    20% {
      -webkit-transform: scale(1.1, 1.1);
      transform: scale(1.1, 1.1);
    }
    40% {
      -webkit-transform: scale(.9, .9);
      transform: scale(.9, .9);
    }
    60% {
      -webkit-transform: scale(1.03, 1.03);
      transform: scale(1.03, 1.03);
    }
    80% {
      -webkit-transform: scale(.97, .97);
      transform: scale(.97, .97);
    }
    100% {
      opacity: 1;
      -webkit-transform: scale(1, 1);
      transform: scale(1, 1);
    }
  }
  .router-slide-enter-active, .router-slide-leave-active {
    transition: all .4s;
  }
  .router-slide-enter, .router-slide-leave-active {
    transform: translateX(2rem);
    opacity: 0;
  }

</style>


