<template>
  <div class="page">
    <head-top goback="true" head-title="我的积分"></head-top>
    <section class="points-box">
      <div class="points-container">
        <header class="title">
          <span class="title-left">当前积分</span>
          <router-link to="/points/detail" class="title-right">
            <img src="../../images/description.png">
            <span>积分说明</span>
          </router-link>
        </header>
        <div class="points-txt">
          <span>0</span>
          <span>分</span>
        </div>
        <div class="points-exchange">积分兑换商品</div>
      </div>
    </section>
    <p class="points-recode">最近30天记录</p>
    <section class="points-tips">
        <div class="no-log">
            <img src="../../images/voucher.png">
            <p>最近30天无积分记录</p>
            <p>快去下单赚取大量积分吧</p>
        </div>
    </section>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  export default {
    data () {
      return {

      }
    },
    components: {
      headTop
    }
  }
</script>
<style lang="scss" scoped>
    @import 'src/style/mixin';
    .points-box{
      @include imgLinearGradient;
      padding: px2rem(5);
      .points-container {
        background-color: #fff;
        border-radius: px2rem(5);
        padding: px2rem(10);
        .title {
          @include fjc;
          .title-left {
            @include sc(px2rem(14), #666);
          }
          .title-right {
            display: block;
            display: flex;
            align-items: center;
            img {
              width: px2rem(15);
              margin-right: px2rem(3);
            }
            span {
              @include sc(px2rem(14), $blue);
            }
          }
        }
        .points-txt {
          span:nth-of-type(1) {
            @include sc(px2rem(42), #333);
          }
          span:nth-of-type(2) {
            @include sc(px2rem(14), #333);
          }
        }
        .points-exchange {
          background-color: $orange;
          width: 100%;
          padding: px2rem(10) 0;
          margin-top: px2rem(8);
          border-radius: px2rem(3);
          @include sc(px2rem(18), #fff);
          text-align: center;
        }
      }
    }
    .points-recode {
      padding: px2rem(10);
      @include sc(12, #999);
    }
    .points-tips {
      .no-log {
        text-align: center;
        p:nth-of-type(1) {
          margin: px2rem(5) 0;
          @include sc(px2rem(16), #333);
        }
        p:nth-of-type(2) {
          @include sc(px2rem(12), #999);
        }
      }
    }
</style>
