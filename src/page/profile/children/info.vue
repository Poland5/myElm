<template>
<div class="fixed-page">
  <head-top goback="true" headTitle="账号信息"></head-top>
  <dl class="userInfo-list">
    <dt class="userInfo-dt">
      <input type="file" class="avatar-upload" @change="uploadAvatar">
      <div class="userInfo-link">
        <span>头像</span>
        <div class="right-side">
          <img :src="imgBaseUrl + userInfo.avatar" v-if="userInfo">
          <i class="icon iconfont icon-avatar" v-else></i>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </div>
    </dt>
    <dt class="userInfo-dt">
      <router-link to="/profile/info/changeusername" class="userInfo-link">
        <span>用户名</span>
        <div class="right-side">
          <span>{{username}}</span>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </router-link>
    </dt>
    <dt class="userInfo-dt">
      <router-link to="/profile/info/address" class="userInfo-link">
        <span>收货地址</span>
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
  <section class="login-out" @click="loginOut">退出登录</section>
  <router-view></router-view>
</div>
</template>
<script>
import headTop from '@/components/headTop'
import {imgBaseUrl} from '@/config/env'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      imgBaseUrl,
      avatar:'',
      username:'',
    }
  },
  components: {
    headTop
  },
  computed:{
    ...mapState([
      'userInfo'
    ])
  },
  methods:{
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
    async loginOut(){

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
  .userInfo-list{
    margin-top:.3rem;
    border-top: 1px solid #ddd;
    .userInfo-dt{
      border-bottom: 1px solid #e4e4e4;
      padding:.2rem;
      background-color: #fff;
      position: relative;
      .avatar-upload{
        opacity: 0;
        position: absolute;
      }
      .userInfo-link{
        @include fjc;
        .right-side{
          @include fc;
          img{
            @include wh(.8rem, .8rem);
            border-radius: 50%;
          }
          .icon-go{
            color: #666;
            margin-left:.1rem;
          }
        }
      }
      .left-side{
        @include fc;
      }
      .icon-phone2{
        color:$blue;
        margin-right:.1rem;
      }
    }
    .userInfo-dt-tips{
      padding:.1rem .2rem;
      border-bottom: 1px solid #ddd;
      span{
        @include sc(.24rem, #666);
      }
    }
  }
  .login-out{
    background-color: #d8584a;
    text-align: center;
    padding: .2rem 0;
    border-radius: .1rem;
    margin: .5rem .2rem;
    color: #fff;
  }
</style>


