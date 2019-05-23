<template>
  <div class="page">
    <head-top goback="true" signinup="true">
      <router-link slot="msite-title" to="/home" class="msite-title ellipsis">{{posAddress.name}}</router-link>
    </head-top>
    <section class="swiper-container">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item,index) in categoryList" :key="index">
          <ul class="foodType-ul">
            <router-link :to="{path:'/food',query:{geohash,title:subItem.title}}" tag="li" v-for="(subItem, index) in item" :key="index">
              <img :src="imgBaseUrl + subItem.image_url">
              <p>{{subItem.title}}</p>
            </router-link>
          </ul>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </section>
    <section class="shop-container">
      <header><i class="icon iconfont icon-restaurant icon-small"></i><span class="text">附件商家</span></header>
      <shop-list :geohash="geohash"></shop-list>
    </section>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import shopList from '@/components/shopList'
  import footGuide from '@/components/footGuide'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import {foodTypeList, posAddress} from '@/api/getData'
  import { mapMutations } from 'vuex'

  export default {
    data () {
      return {
        categoryList:[],
        posAddress:'',
        geohash:'',
        imgBaseUrl: 'https://fuss10.elemecdn.com',
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
    beforeMount(){
      this.geohash = this.$route.query.geohash;
      this.SAVE_GEOHASH(this.geohash);
    },
    mounted(){
      foodTypeList().then(res => {
        let resLength = res.length;
        let resArr = [...res];
        let foodArr = [];
        for(let i = 0, j = 0; i < resLength; i+=8, j++){
          foodArr[j] = resArr.splice(0, 8);
        }
        this.categoryList = foodArr;
      }),
      this.initData();
    },
    methods: {
      ...mapMutations([
        'SAVE_GEOHASH'
      ]),
      async initData(){
        this.posAddress =  await posAddress(this.geohash);
      },
    }
  }
</script>
<style lang="scss">
  @import 'src/style/mixin';
  .msite-title {
    @include center;
    width: 50%;
    color: #fff;
  }
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
        margin-top: .2rem;
      }
      p{
        margin-top: .1rem;
        @include sc(.2rem, #666);
      }
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
