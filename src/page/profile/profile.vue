<template>
  <div class="page">
    <head-top goback="true" headTitle="我的"></head-top>
    <router-link :to="userInfo&&userInfo.user_id ? '/profile/info' : '/login'" class="profile-link">
      <img :src="imgBaseUrl + avatar" class="avatar">
      <div class="user-info">
        <span>{{username}}</span>
        <div class="phone">
          <i class="icon iconfont icon-phone icon-small"></i>
          <span>{{mobile ? mobile : '暂无绑定手机号'}}</span>
        </div>
      </div>
      <div class="arrow">
        <i class="icon iconfont icon-go icon-small"></i>
      </div>
    </router-link>
    <section class="user-coupon">
      <router-link tag="div" to="/balance">
        <p class="info-data-top"><b class="orange">{{balance}}</b>元</p>
        <p class="info-data-bottom">我的余额</p>
      </router-link>
      <router-link tag="div" to="/benefit">
        <p class="info-data-top"><b class="red">{{gift_amount}}</b>个</p>
        <p class="info-data-bottom">我的优惠</p>
      </router-link>
      <router-link tag="div" to="/points">
        <p class="info-data-top"><b class="green">{{point}}</b>分</p>
        <p class="info-data-bottom">我的积分</p>
      </router-link>
    </section>
    <section class="section-list">
      <router-link to="/order" class="list-link">
        <aside>
          <i class="icon iconfont icon-order icon-small"></i>
        </aside>
        <div class="right-side">
          <span>我的订单</span>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
    </router-link>
      <router-link to="/point" class="list-link">
        <aside>
          <i class="icon iconfont icon-shopping icon-small"></i>
        </aside>
        <div class="right-side">
          <span>积分商城</span>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </router-link>
      <router-link to="/vipcard" class="list-link">
        <aside>
          <i class="icon iconfont icon-crown icon-small"></i>
        </aside>
        <div class="right-side">
          <span>饿了么会员卡</span>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </router-link>
    </section>
    <section class="section-list">
      <router-link to="/service" class="list-link">
        <aside>
          <i class="icon iconfont icon-fuwu icon-small"></i>
        </aside>
        <div class="right-side">
          <span>服务中心</span>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </router-link>
      <router-link to="/service" class="list-link">
        <aside>
          <i class="icon iconfont icon-elm icon-small"></i>
        </aside>
        <div class="right-side">
          <span>下载饿了么app</span>
          <i class="icon iconfont icon-go icon-small"></i>
        </div>
      </router-link>
    </section>
    <transition name="router-slide">
      <router-view></router-view>
    </transition>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import footGuide from '@/components/footGuide'
import {imgBaseUrl} from '@/config/env'
import { mapState } from 'vuex';
export default {
  data () {
    return {
      imgBaseUrl,
      username: '',
      mobile:'',
      balance: 0,
      gift_amount: 0,
      point: 0,
      avatar: ''
    }
  },
  components: {
    headTop, footGuide
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    initData(){
      if(this.userInfo && this.userInfo.user_id){
        this.avatar = this.userInfo.avatar;
        this.username = this.userInfo.username;
        this.mobile = this.userInfo.mobile || '暂无绑定手机号';
        this.balance = parseInt(this.userInfo.balance).toFixed(2);
        this.gift_amount = this.userInfo.gift_amount;
        this.point = this.userInfo.point;
      }else{
        this.username = '登录/注册';
        this.mobile = '暂无绑定手机号'
      }
    }
  },
  watch:{
    userInfo:function(value){
      this.initData();
    }
  }
}
</script>
<style lang="scss">
  @import '../../style/mixin';
  .profile-link{
    display: block;
    color: #fff;
    background-color:$blue;
    padding: .2rem;
    @include fc;
    .avatar{
      border-radius: 50%;
      @include wh(1rem, 1rem)
    }
    .user-info{
      margin-left:.2rem;
      flex-grow: 1;
      span{
        color: #fff;
      }
      .phone{
        span{
          @include sc(.24rem, #fff);
        }
      }
    }
  }
  .user-coupon{
    background-color: #fff;
    display: flex;
    margin-bottom: .2rem;
    div{
      flex: 1;
      border-right:1px solid #e4e4e4;
      padding:.2rem;
      text-align: center;
      .info-data-top{
        margin-top: .1rem;
        b{
          font-family: Helvetica Neue,Tahoma;
          font-weight: 700;
        }
        .orange{
          @include sc(.5rem, #f90);
        }
        .red{
          @include sc(.5rem, #ff5f3e);
        }
        .green{
          @include sc(.5rem, #6ac20b);
        }
      }
      .info-data-bottom{
        @include sc(.24rem, #666);
        margin: .1rem 0;
      }
    }
    div:nth-of-type(3){
      border-right: none;
    }
  }
  .section-list{
    margin-bottom:.2rem;
    background-color: #fff;
    .list-link{
      padding-left:.5rem;
      @include fc;
      aside{
        margin-left: -.2rem;
        .icon{
          color:$blue;
        }
        .icon-shopping{
          color:#fc7b53;
        }
        .icon-crown{
          color: #ffc636;
        }

      }
      .right-side{
        padding:.2rem;
        padding-left:.1rem;
        border-bottom:1px solid #e4e4e4;
        color: #333;
        @include fjc;
        width: 100%;
        .icon-go{
          color: #666;
        }
      }
    }
  }
  .router-slide-enter-active, .router-slide-leave-active{
    transition: all .4s;
  }
  .router-slide-enter, .router-slide-leave-active{
    transform: translateX(1rem);
    opacity: 0;
  }
</style>


