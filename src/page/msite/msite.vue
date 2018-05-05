<template>
  <div class="page">
    <head-top goback="true"></head-top>
    <section class="category-container swiper-container">
      <ul class="category-list-ul swiper-wrapper">
        <li class="swiper-slide">1</li>
        <li class="swiper-slide">2</li>
      </ul>
      <div class="swiper-pagination"></div>
    </section>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import {foodCategoryList, shopList} from '@/api/getData'
  import '@/plugins/swiper.js'
  import '@/style/swiper.css'
  export default {
    data () {
      return {
        categoryList:[],  //食品分类
      }
    },
    components: {
      headTop
    },
    mounted () {
      this.initData();
    },
    methods: {
      initData(){
        var mySwiper = new Swiper('.swiper-container',{
          pagination : '.swiper-pagination',
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
</style>