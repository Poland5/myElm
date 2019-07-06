<template>
  <div>
    <router-link tag="section" :to="userInfo&&userInfo.user_id ? '/profile/info' : '/login'" class="profile-link">
      <img :src="imgBaseUrl + avatar" class="avatar" v-if="userInfo&&userInfo.user_id">
      <div class="user-info">
        <p class="user-name">
          <span>{{username}}</span>
        </p>
        <div class="phone">
          <i class="icon iconfont icon-phone icon-small"></i>
          <span>{{mobile ? mobile : '暂无绑定手机号'}}</span>
        </div>
      </div>
      <div class="arrow">
        <font-icon id="icon-go"></font-icon>
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
          <font-icon id="icon-go"></font-icon>
        </div>
    </router-link>
      <router-link to="/point" class="list-link">
        <aside>
          <i class="icon iconfont icon-shopping icon-small"></i>
        </aside>
        <div class="right-side">
          <span>积分商城</span>
          <font-icon id="icon-go"></font-icon>
        </div>
      </router-link>
      <router-link to="/vipcard" class="list-link">
        <aside>
          <i class="icon iconfont icon-crown icon-small"></i>
        </aside>
        <div class="right-side">
          <span>饿了么会员卡</span>
          <font-icon id="icon-go"></font-icon>
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
          <font-icon id="icon-go"></font-icon>
        </div>
      </router-link>
      <router-link to="/service" class="list-link">
        <aside>
          <i class="icon iconfont icon-elm icon-small"></i>
        </aside>
        <div class="right-side">
          <span>下载饿了么app</span>
          <font-icon id="icon-go"></font-icon>
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
import footGuide from '@/components/footGuide'
import { imgBaseUrl } from '@/config/env'
import { mapState, mapActions } from 'vuex'
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
    footGuide
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  mounted() {
    this.getUserinfo()
  },
  methods: {
    ...mapActions(['getUserinfo']),
    initData() {
      if (this.userInfo && this.userInfo.user_id) {
        this.avatar = this.userInfo.avatar
        this.username = this.userInfo.username
        this.mobile = this.userInfo.mobile || '暂无绑定手机号'
        this.balance = parseInt(this.userInfo.balance).toFixed(2)
        this.gift_amount = this.userInfo.gift_amount
        this.point = this.userInfo.point
      } else {
        this.username = '登录/注册'
        this.mobile = '暂无绑定手机号'
      }
    }
  },
  watch:{
    userInfo:function(value){
      this.initData()
    }
  }
}
</script>
<style lang="scss">
  @import '../../style/mixin';
  .profile-link {
    padding: px2rem(30) px2rem(20);
    @include imgLinearGradient(90deg, #0af, #0085ff);
    @include fc;
    color: #fff;
    .avatar {
      @include wh(px2rem(60), px2rem(60));
      border-radius: 50%;
    }
    .user-info {
      margin-left:px2rem(15);
      flex-grow: 1;
      .user-name {
        margin-bottom: px2rem(5);
        color: #fff;
        span {
          font-size: px2rem(20);
          font-weight: 700;
        }
      }
      .phone {
        span {
          @include sc(px2rem(12), #fff);
        }
      }
    }
  }
  .user-coupon {
    background-color: #fff;
    display: flex;
    margin-bottom: px2rem(10);
    position: relative;
    &::before {
      @include border(bottom, #eee)
    }
    div {
      position: relative;
      flex: 1;
      padding:px2rem(10);
      text-align: center;
      &::before {
        @include border(right, #eee)
      }
      .info-data-top {
        margin-top: px2rem(5);
        b {
          font-family: Helvetica Neue,Tahoma;
          font-weight: 700;
        }
        .orange {
          @include sc(px2rem(25), #f90);
        }
        .red {
          @include sc(px2rem(25), #ff5f3e);
        }
        .green {
          @include sc(px2rem(25), #6ac20b);
        }
      }
      .info-data-bottom {
        @include sc(px2rem(12), #666);
        margin: px2rem(5) 0;
      }
    }
    div:nth-of-type(3) {
      border-right: none;
    }
  }
  .section-list {
    margin-bottom:px2rem(10);
    background-color: #fff;
    .list-link {
      padding-left: px2rem(25);
      @include fc;
      aside {
        margin-left: px2rem(-10);
        .icon {
          color:$blue;
        }
        .icon-shopping {
          color:#fc7b53;
        }
        .icon-crown {
          color: #ffc636;
        }
      }
      .right-side {
        position: relative;
        padding: px2rem(15);
        padding-left: px2rem(5);
        width: 100%;
        @include fjc;
        &::before {
        @include border(bottom, #e4e4e4);
        }
        span {
          @include sc(px2rem(14), #333);
        }
        .icon-go {
          color: #666;
        }
      }
    }
  }
  .router-slide-enter-active, .router-slide-leave-active {
    transition: all .4s;
  }
  .router-slide-enter, .router-slide-leave-active {
    transform: translateX(px2rem(50));
    opacity: 0;
  }
</style>


