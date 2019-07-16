<template>
  <div class="page">
    <head-top>
      <router-link tag="section" slot="msite-title" to="/home" class="msite-title">
        <div class="msite-div">
          <font-icon id="icon-location"></font-icon>
          <span class="txt ellipsis">{{ msiteTitle }}</span>
          <font-icon id="icon-down"></font-icon>
        </div>
      </router-link>
    </head-top>
    <section class="search">
      <router-link class="search-input" to="/search">
        <font-icon id="icon-search"></font-icon>
        <span>搜索饿了么商家、商品名称</span>
      </router-link>
    </section>
    <nav class="foodType-nav">
      <section class="swiper-container" v-if="foodTypes.length">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item,index) in foodTypes" :key="index">
            <ul class="foodType-ul">
              <router-link :to="{
                                  path:'/food',
                                  query:{ geohash, title:subItem.title, restaurant_category_id: getCategoryId(subItem.link)} }"
                                  tag="li"
                                  v-for="(subItem) in item"
                                  :key="subItem.id"
                                  >
                <img :src="imgBaseUrl + subItem.image_url">
                <p>{{ subItem.title }}</p>
              </router-link>
            </ul>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </section>
      <img src="../../images/fl.svg" class="animation_opacity fl-img" v-else>
    </nav>
    <section class="ad-wrap">
      <div class="ad-content">
        <h1>品质套餐</h1>
        <p>搭配齐全吃得好</p>
        <p>立即抢购 ></p>
        <img src="https://fuss10.elemecdn.com/e/ee/df43e7e53f6e1346c3fda0609f1d3png.png?imageMogr/format/webp/thumbnail/!282x188r/gravity/Center/crop/282x188/">
      </div>
    </section>
    <section class="shop-container">
      <header>
        <i class="icon iconfont icon-restaurant icon-small"></i>
        <span class="text">附件商家</span>
      </header>
      <shop-list :geohash="geohash" v-if="hasGetData"></shop-list>
    </section>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import shopList from '@/components/shopList'
  import footGuide from '@/components/footGuide'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { foodTypeList, posAddress, guessCity } from '@/api/getData'
  import { mapMutations } from 'vuex'

  export default {
    data () {
      return {
        foodTypes: [],
        geohash: null,
        msiteTitle: '请选择地址...',
        imgBaseUrl: 'https://fuss10.elemecdn.com',
        hasGetData: false, // 是否已经获取了位置数据，成功之后再获取商铺列表
        swiperOption: {
          pagination: {
            el: '.swiper-pagination',
          }
        }
      }
    },
    components: {
      headTop,
      shopList,
      footGuide
    },
    async beforeMount() {
      this.initData()
    },
    mounted() {
      foodTypeList(this.geohash).then(res => {
        let resLength = res.length
        let resArr = [...res]
        let foodArr = []
        for (let i = 0, j = 0; i < resLength; i+=10, j++) {
          foodArr[j] = resArr.splice(0, 10)
        }
        this.foodTypes = foodArr
      })
    },
    methods: {
      ...mapMutations([
        'SAVE_GEOHASH',
        'RECODE_LONGITUDE_LAGITUDE'
      ]),
      async initData() {
        if (!this.$route.query.geohash) {
          const address = await guessCity()
          this.geohash = address.latitude + ',' + address.longitude
        } else {
          this.geohash = this.$route.query.geohash
        }
        this.SAVE_GEOHASH(this.geohash)
        let res = await posAddress(this.geohash)
        this.msiteTitle = res.name
        // 保存经纬度
        this.RECODE_LONGITUDE_LAGITUDE(res)
        this.hasGetData = true
      },
    	getCategoryId(url) {
        let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''))
        if (/restaurant_category_id/gi.test(urlData)) {
          return JSON.parse(urlData).restaurant_category_id.id
        } else {
          return ''
        }
    	}
    },
    watch: {
      '$route'(to, from) {
        if (to.query.geohash != from.query.geohash) {
          this.initData()
        }
      }
    }
  }
</script>
<style lang="scss">
  @import 'src/style/mixin';
  .swiper-pagination {
    margin-top: px2rem(5);
  }
  .swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 5px;
  }
  .swiper-pagination-bullet {
    width: 8px;
    height: 2px;
    display: inline-block;
    border-radius: 0;
    background: #000;
    opacity: 0.2;
  }
  .swiper-pagination-bullet-active {
    background: #fe7100;
  }
  .page {
    background-color: #fff;
  }
  .msite-title {
    width: 60%;
    .msite-div {
      display: flex;
      align-items: center;
      padding: px2rem(5) px2rem(14) 0 px2rem(14);
      text-align: left;
      font-size: px2rem(16);
      .txt {
        margin: 0 px2rem(5);
        font-size: px2rem(16);
      }
      .icon-down {
        font-size: px2rem(8);
      }
    }
  }
  .search {
    width: 100%;
    padding: px2rem(8) px2rem(14);
    @include imgLinearGradient;
    .search-input {
      background-color: #fff;
      width: 100%;
      height: px2rem(38);
      @include fjc(center);
      @include sc(px2rem(16), #999);
      .icon-search {
        margin-right: px2rem(5);
        display: inline-block;
      }
      span {
        @include sc(px2rem(14), #999);
      }
    }
  }
  .foodType-nav {
    .swiper-container {
      height: auto;
      .foodType-ul {
        display: flex;
        flex-wrap: wrap;
        background-color: #ffffff;
        padding-bottom:px2rem(25);
        li {
          float: left;
          // flex: 20%;
          width: 20%;
          text-align: center;
          img {
            width:px2rem(40);
            height: px2rem(40);
            margin-top: px2rem(10);
          }
          p {
            margin-top: px2rem(5);
            @include sc(px2rem(10), #666);
          }
        }
      }
    }
    .fl-img {
      @include wh(100%, 100%)
    }
  }
  .ad-wrap {
    background-color: #fff;
    padding: 0 px2rem(10);
    .ad-content {
      position: relative;
      padding: px2rem(14) 0 0 px2rem(14);
      background: -webkit-linear-gradient(bottom,#f4f4f4 5%,#fafafa 95%);
      height: px2rem(110);
      h1 {
        @include sc(px2rem(16), #333);
        font-weight: 700;
        margin-bottom: px2rem(3);
      }
      p:nth-of-type(1) {
        @include sc(px2rem(12), #999);
        margin-bottom: px2rem(3);
      }
      p:nth-of-type(2) {
        @include sc(px2rem(12), #af8260);
      }
      img {
        position: absolute;
        top: px2rem(5);
        right: px2rem(5);
        @include wh(px2rem(144), px2rem(94));
      }
    }
  }
  .shop-container{
    background-color: #fff;
    margin-top: px2rem(10);
    padding-bottom: px2rem(50);
    overflow: hidden;
    header{
      padding: px2rem(7.5) px2rem(10);
      color: #999;
      .text{
        font-size: px2rem(10);
        margin-left: px2rem(5);
      }
    }
  }
</style>
