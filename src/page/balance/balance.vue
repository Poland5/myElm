<template>
<div class="page">
  <head-top goback="true" headTitle="我的余额"></head-top>
  <section class="content_container">
    <section class="content">
      <header class="content_header">
        <span>当前余额</span>
        <section class="content_description">
          <img src="../../images/description.png" width="24" height="24">
          <router-link to="/balance/detail">余额说明</router-link>
        </section>
      </header>
      <div class="content_num">
        <span>0.00</span>
        <span>元</span>
      </div>
      <div class="cash_button">提现</div>
    </section>
  </section>
  <p class="deal_detail">交易明细</p>
  <div class="no_log">
    <img src="../../images/no-log.png">
    <p>暂无明细记录</p>
  </div>
  <transition name="router-slide" mode="out-in">
    <router-view></router-view>
  </transition>
</div>
</template>
<script>
  import headTop from '@/components/headTop'
  export default {
    components: {
      headTop
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .content_container{
    padding: px2rem(7.5);
    background-color: $blue;
    .content {
      padding: .4rem;
      background: #fff;
      -webkit-border-radius: px2rem(7.5);
      -moz-border-radius: px2rem(7.5);
      border-radius: px2rem(7.5);
      .content_header {
        @include fj;
        font-size: px2rem(10);
        .content_description {
          @include fc;
          img {
            @include wh(px2rem(15), px2rem(15));
            margin-right:px2rem(10);
          }
          a {
            color:$blue;
          }
        }
      }
      .content_num {
        span:nth-of-type(1) {
          @include sc(px2rem(40), #333);
        }
        span:nth-of-type(2) {
          @include sc(px2rem(15), #333);
        }
      }
      .cash_button {
        @include wh(100%, px2rem(45));
        @include sc(px2rem(18), #fff);
        line-height: px2rem(45);
        background-color:#ccc;
        border-radius:.1rem;
        text-align: center;
        margin-top:px2rem(25);
      }
    }
  }
  .deal_detail {
    @include sc(px2rem(15), #999);
    line-height: px2rem(40);
    padding-left: px2rem(10);
  }
  .no_log {
    margin-top: px2rem(50);
    text-align: center;
    img {
      @include wh(px2rem(130), px2rem(75));
    }
    p {
      margin-top: px2rem(25);
      @include sc(px2rem(15), #999);
    }
  }
  .router-slide-enter-active, .router-slide-leave-active {
    transition: all .4s;
  }
  .router-slide-enter, .router-slide-leave-active {
    transform: translate3d(px2rem(100), 0, 0);
    opacity: 0;
  }
</style>
