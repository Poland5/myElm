<template>
  <div class="page">
    <head-top signinup="true">
      <span slot="logo" class="logo">elm</span>
    </head-top>
    <section class="section-box">
      <div class="cur-txt">
        <p>当前定位城市:</p>
        <p>定位不准时,请在城市列表中选择</p>
      </div>
      <router-link :to="/city/ + cityId" class="cur-city">
        <p class="city-name">{{ cityName }}</p>
        <i class="icon iconfont icon-go"></i>
      </router-link>
    </section>
    <section class="section-box hot-city">
      <header>热门城市</header>
      <ul class="hot-city-ul">
        <router-link tag="li" :to="/city/ + item.id" v-for="(item, index) in hotCities" :key="index">
          {{item.name}}
        </router-link>
      </ul>
    </section>
    <section class="section-group-city" v-for="(value, key, index) in sortCity" :key="index">
      <header>{{ key }}<span v-if="index == 0">(按字母排序)</span></header>
      <ul class="group-city-ul">
        <li class="ellipsis" v-for="(item, index) in value" :key="index">{{item.name}}</li>
      </ul>
    </section>
  </div>
</template>
<script>
import headTop from '@/components/headTop';
import { guessCity,hotCity,groupCity } from '@/api/getData';
export default {
  data () {
    return {
      cityName: '',       //当前城市
      cityId: '',         //当前城市ID
      hotCities: [],      //热门城市
      groupCities: {}     //所有城市
    }
  },
  components: {
    headTop
  },
  mounted () {
    guessCity().then(res => {
      this.cityName = res.name
      this.cityId = res.id
    })
    hotCity().then(res => {
      this.hotCities = res
    })
    groupCity().then(res => {
      this.groupCities = res
    })
  },
  computed: {
    sortCity() {
      let sortObj = {}
      for (var i=65, len=90; i <= len; i++) {
        if (this.groupCities[String.fromCharCode(i)]) {
          sortObj[String.fromCharCode(i)] = this.groupCities[String.fromCharCode(i)]
        }
      }
      return sortObj
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "src/style/mixin.scss";
  .page {
    width: 100%;
    .section-box {
      background-color: #fff;
      margin-bottom:px2rem(10);
      overflow: hidden;
    }
    .cur-txt {
      @include fj;
      @include wh(100%, px2rem(40));
      border-bottom:1px solid #e4e4e4;
      padding:0 px2rem(10);
      line-height: px2rem(40);
      p:nth-of-type(1) {
        @include sc(px2rem(14)rem, #666);
      }
      p:nth-of-type(2) {
        @include sc(px2rem(12), #666);
      }
    }
    .cur-city {
      @include fj;
      height: px2rem(40);
      line-height: px2rem(40);
      padding: 0 px2rem(10);
      border-bottom: 1px solid #e4e4e4;
      .city-name {
        color: $blue;
        font-size: px2rem(14);
      }
      .icon-go {
        color: #666;
        @include sc(px2rem(20), #666);
      }
    }
    .hot-city {
      border-top: 1px solid #e4e4e4;
      header {
        height: px2rem(30);
        line-height: px2rem(30);
        @include sc(px2rem(12), #666);
        padding: 0 px2rem(5);
        border-bottom:1px solid #e4e4e4;
      }
      .hot-city-ul {
        li {
          float: left;
          @include wh(25%, px2rem(40));
          line-height: px2rem(40);
          text-align: center;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
          color: $blue;
          font-size: px2rem(14);
        }
        li:nth-of-type(4n) {
          border-right: none;
        }
      }
    }
    .section-group-city {
      margin-bottom:px2rem(15);
      background-color: #fff;
      header {
        border-bottom:1px solid #e4e4e4;
        line-height: px2rem(30);
        padding: 0 px2rem(5);
        span {
          @include sc(px2rem(12), #666);
          margin-left:px2rem(5);
          font-size: px2rem(14);
        }
      }
      .group-city-ul {
        overflow: hidden;
        li {
          float: left;
          @include wh(25%, px2rem(40));
          line-height: px2rem(40);
          text-align: center;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
          color: #666;
          font-size: px2rem(14);
        }
      }
    }
  }
</style>
