<template>
  <div class="page">
    <head-top signinup="true">
      <span slot="logo">elm</span>
    </head-top>
    <section class="section-box">
      <div class="cur-txt">
        <p>当前定位城市:</p>
        <p>定位不准时,请在城市列表中选择</p>
      </div>
      <router-link to="" class="cur-city">
        <p class="city-name">{{cityName}}</p>
        <i class="icon iconfont icon-fanhui2"></i>
      </router-link>
    </section>
    <section class="section-box hot-city">
      <header>热门城市</header>
      <ul class="hot-city-ul">
        <router-link tag="li" to="/" v-for="(item, index) in hotCities" :key="index">
          {{item.name}}
        </router-link>
      </ul>
    </section>
    <section class="section-group-city" v-for="(value, key, index) in sortCity" :key="index">
      <header>{{key}}<span v-if="index == 0">(按字母排序)</span></header>
      <ul class="group-city-ul">
        <li class="ellipsis" v-for="(item, index) in value" :key="index">{{item.name}}</li>
      </ul>
    </section>
  </div>
</template>
<script>
import headTop from '@/components/headTop';
import {guessCity,hotCity,groupCity} from '@/api/getData';
export default {
  data () {
    return {
      cityName: '',       //当前城市
      hotCities: [],      //热门城市
      groupCities: {}     //所有城市
    }
  },
  components: {
    headTop
  },
  mounted () {
    guessCity().then(res => {
      this.cityName = res.name;
    });
    hotCity().then(res => {
      this.hotCities = res;
    });
    groupCity().then(res => {
      this.groupCities = res;
    });
  },
  computed: {
    sortCity(){
      let sortObj = {}; 
      for(var i=65, len=90; i <= len; i++){
        if(this.groupCities[String.fromCharCode(i)]){
          sortObj[String.fromCharCode(i)] = this.groupCities[String.fromCharCode(i)];
        }
      }
      return sortObj;
    }
  },
  methods: {

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
      overflow: hidden;
    }
    .cur-txt{
      @include fj;
      @include wh(100%, .8rem);
      border-bottom:1px solid #e4e4e4;
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
      border-bottom: 1px solid #e4e4e4;
      .city-name{
        color: $blue;
      }
    }
    .hot-city{
      border-top: 1px solid #e4e4e4;
      header{
        height: .6rem;
        line-height: .6rem;
        @include sc(.24rem, #666);
        padding: 0 .1rem;
        border-bottom:1px solid #e4e4e4;
      }
      .hot-city-ul{
        li{
          float: left;
          @include wh(25%, .8rem);
          line-height: .8rem;
          text-align: center;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
          color: $blue;
        }
        li:nth-of-type(4n){
          border-right: none;
        }
      }
    }
    .section-group-city{
      margin-bottom:.3rem;
      background-color: #fff;
      header{
        border-bottom:1px solid #e4e4e4;
        line-height: .6rem;
        padding: 0 .1rem;
        span{
          @include sc(.24rem, #666);
          margin-left:.1rem;
        }
      }
      .group-city-ul{
        overflow: hidden;
        li{
          float: left;
          @include wh(25%, .8rem);
          line-height: .8rem;
          text-align: center;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
          color: #666;
        }
      }
    }
  }
</style>
