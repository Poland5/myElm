<template>
  <div class="sub-page">
    <head-top goback="true" head-title="在线支付"></head-top>
    <section class="remaining-container">
      <p>支付剩余时间</p>
      <span>{{remaining}}</span>
    </section>
    <div class="choose-pay-way">选择支付方式</div>
    <section class="choose-item-box" @click="payWay = 1" :class="{choosed_way: payWay == 1}">
      <div class="left-side">
        <img src="../../../images/zhifubao.png" class="zhifubao">
        <span>支付宝</span>
      </div>
      <svg class="choose_icon">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
      </svg>
    </section>
    <section class="choose-item-box" @click="payWay = 2" :class="{choosed_way: payWay == 2}">
      <div class="left-side">
        <svg class="weixin">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#weixin"></use>
        </svg>
        <span>微信</span>
      </div>
      <svg class="choose_icon">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
      </svg>
    </section>
    <section class="confirm-pay" @click="confirmPay">确认支付</section>
    <alert-tips :alertTxt="alertTxt" v-if="showAlert" @closeTips="closeTipsFunc"></alert-tips>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import alertTips from '@/components/alertTips'
  export default {
    data () {
      return {
        payWay: 1,
        remainingTime: 5,
        alertTxt: '',
        showAlert: false,
      }
    },
    components: {
      headTop, alertTips
    },
    computed: {
      remaining:function(){
        let minute = parseInt(this.remainingTime / 60);
        if(minute < 10){
          minute = '0' + minute;
        }
        let second = parseInt(this.remainingTime % 60);
        if(second < 10){
          second = '0' + second;
        }
        return '00' + ':' + minute + ':' + second;
      }
    },
    mounted () {
      this.countDown();
    },
    methods: {
      countDown(){
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.remainingTime--;
          if(this.remainingTime == 0){
            clearInterval(this.timer);
            this.showAlert = true;
            this.alertTxt = '支付超时';
          }
        },1000)
      },
      confirmPay(){
        this.showAlert = true;
        this.alertTxt = '无法支付，请登录APP';
      },
      closeTipsFunc(){
        this.showAlert = false;
        this.$router.push('/order');
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .remaining-container{
    background-color: #fff;
    text-align: center;
    padding:.7rem 0;
    p{
      @include sc(.24rem, #666);
      margin-bottom: .1rem;
    }
    span{
      @include sc(.7rem, #000);
    }
  }
  .choose-pay-way{
    padding: .25rem;
    background-color: #eee;
    @include sc(.3rem, #666);
  }
  .choose-item-box{
    background-color: #fff;
    @include fj;
    align-items: center;
    padding: .25rem .25rem;
    .left-side{
      display: flex;
      align-items: center;
      .zhifubao{
        @include wh(.8rem, .8rem);
        background-size: 100%;
        background: url(../../../images/zhifubao.png) no-repeat;
      }
      span{
        @include sc(.24rem, #666);
        margin-left: .1rem;
      }
      .weixin{
        @include wh(.8rem, .8rem);
      }
    }
    .choose_icon{
      @include wh(.3rem, .3rem);
      fill: #666;
    }
  }
  .choosed_way{
    .choose_icon{
      fill: $green;
    }
  }
  .confirm-pay{
    background-color: $green;
    @include sc(.3rem, #fff);
    text-align: center;
    padding: .25rem 0;
    width: 95%;
    margin: 0 auto;
    border-radius: .1rem;
    margin-top: .25rem;
  }
</style>