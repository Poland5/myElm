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
    data(){
      return{

      }
    },
    components:{
      headTop
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .page{
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
    .content_container{
      padding:.15rem;
      background-color:$blue;
      .content{
        padding:.4rem;
        background: #fff;
        -webkit-border-radius: .15rem;
        -moz-border-radius: .15rem;
        border-radius: .15rem;
        .content_header{
          @include fj;
          font-size: .2rem;
          .content_description{
            @include fc;
            img{
              @include wh(.3rem, .3rem);
              margin-right:.2rem;
            }
            a{
              color:$blue;
            }
          }
        }
        .content_num{
          span:nth-of-type(1){
            @include sc(.8rem, #333);
          }
          span:nth-of-type(2){
            @include sc(.3rem, #333);
          }
        }
        .cash_button{
          @include wh(100%, .8rem);
          @include sc(.4rem, #fff);
          line-height: .8rem;
          background-color:#ccc;
          border-radius:.1rem;
          text-align: center;
          margin-top:.5rem;
        }
      }
    }
    .deal_detail{
      @include sc(.3rem, #999);
      line-height: .8rem;
      padding-left: .5rem;
    }
    .no_log{
      margin-top: 1rem;
      text-align: center;
      img{
        @include wh(2.5rem, 1.5rem);
      }
      p{
        margin-top:.5rem;
        @include sc(.3rem, #666);
      }
    }
  }
  .router-slide-enter-active, .router-slide-leave-active{
    transition: all .4s;
  }
  .router-slide-enter, .router-slide-leave-active{
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
</style>
