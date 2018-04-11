<template>
  <div class="page">
    <head-top></head-top>
    <section class="section-box">
      <div class="cur-txt">
        <p>当前定位城市:</p>
        <p>定位不准时,请在城市列表中选择</p>
      </div>
      <router-link to="" class="cur-city">
        <p class="city-name">{{cityName}}</p>
        <i class="icon iconfont icon-fanhui2" width="24"></i>
      </router-link>
    </section>
    <section class="section-box hot-city">
      <header>热门城市</header>
    </section>
  </div>
</template>
<script>
import headTop from '@/components/headTop';
import {cityGuess} from '@/api/getData';
export default {
  data () {
    return {
      cityName: '',   //当前城市
    }
  },
  components: {
    headTop
  },
  mounted () {
    this.initData();
  },
  methods: {
    async initData(){
      const res = await cityGuess();
      this.cityName = res.name;
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../style/mixin.scss";
  .page{
    position: absolute;
    top: 1rem;
    width: 100%;
    .section-box{
      background-color: #fff;
      margin-bottom:.2rem;
    }
    .cur-txt{
      @include fj;
      @include wh(100%, .8rem);
      border-bottom:1px solid #eee;
      padding:0 .1rem;
      line-height: .8rem;
      p:nth-of-type(1){
        @include sc(.28rem, #666);
      }
      p:nth-of-type(2){
        @include sc(.24rem, #666);
      }
    }
    .cur-city{
      @include fj;
      height: .8rem;
      line-height: .8rem;
      padding: 0 .1rem;
      border-bottom: 1px solid #eee;
      .city-name{
        color: $blue;
      }
    }
    .hot-city{
      padding: 0 .1rem;
      header{
        height: .6rem;
        line-height: .6rem;
        @include sc(.24rem, #666)
      }
    }
  }
</style>
