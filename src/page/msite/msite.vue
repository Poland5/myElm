<template>
  <div class="page">
    <head-top goback="true" signinup="true">
      <router-link slot="msite-title" to="/home" class="msite-title ellipsis">{{msiteTitle}}</router-link>
    </head-top>
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
                <p>{{subItem.title}}</p>
              </router-link>
            </ul>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </section>
      <img src="../../images/fl.svg" class="animation_opacity fl-img" v-else>
    </nav>
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
        foodTypes:[],
        geohash:'',
        msiteTitle: '请选择地址...',
        imgBaseUrl: 'https://fuss10.elemecdn.com',
        hasGetData: false, // 是否已经获取了位置数据，成功之后再获取商铺列表
        swiperOption:{
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
    mounted() {
      foodTypeList().then(res => {
        let resLength = res.length
        let resArr = [...res]
        let foodArr = []
        for (let i = 0, j = 0; i < resLength; i+=8, j++) {
          foodArr[j] = resArr.splice(0, 8)
        }
        this.foodTypes = foodArr
      })
    },
    methods: {
      ...mapMutations([
        'SAVE_GEOHASH',
        'RECODE_LONGITUDE_LAGITUDE'
      ]),
    	getCategoryId(url) {
        let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''))
        if (/restaurant_category_id/gi.test(urlData)) {
          return JSON.parse(urlData).restaurant_category_id.id
        } else {
          return ''
        }
    	}
    }
  }
</script>
<style lang="scss">
  @import 'src/style/mixin';
  .msite-title {
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
  }
  .foodType-nav {
    .swiper-container {
      height: auto;
      .foodType-ul{
        display: flex;
        flex-wrap: wrap;
        background-color: #fff;
        padding-bottom:.5rem;
        li{
          flex: 25%;
          text-align: center;
          img{
            width:.8rem;
            height: .8rem;
            margin-top: .2rem;
          }
          p{
            margin-top: .1rem;
            @include sc(.2rem, #666);
          }
        }
      }
    }
    .fl-img {
      @include wh(100%, 100%)
    }
  }

  .shop-container{
    background-color: #fff;
    margin-top: .2rem;
    padding-bottom:1rem;
    overflow: hidden;
    header{
      padding:.15rem;
      color: #999;
      .text{
        font-size: .2rem;
        margin-left: .1rem;
      }
    }
  }
</style>
