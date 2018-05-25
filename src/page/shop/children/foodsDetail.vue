<template>
  <div class="fixed-page">
    <head-top goback="true" head-title="食物名称"></head-top>
    <section class="foodsDetail-container">
      <img class="foodsDetail-img" :src="baseImgPath + image_path">
      <section class="foosDetail-desc">
        <h4>{{description}}</h4>
        <p class="title">{{name}}</p>
        <p class="pf"><span>评分</span><rating-star :rating="rating"></rating-star><span class="orange">{{rating}}</span></p>
        <p><span>月售{{mouth_sales}}</span><span class="orange">售价￥{{price}}起</span></p>
        <p><span>评论数{{rating_count}}</span><span>好评率{{satisfy_rate}}</span></p>
      </section>
    </section>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import ratingStar from '@/components/ratingStar'
  export default {
    data () {
      return {
        name: null,
        image_path: null,
        baseImgPath: 'http://cangdu.org:8001/img/',
        description: null,
        mouth_sales: null,
        price: null,
        rating: null,
        rating_count: null,
        satisfy_rate: null
      }
    },
    components: {
      headTop,
      ratingStar
    },
    mounted () {
      this.name = this.$route.query.name;
      this.image_path = this.$route.query.image_path;
      this.description = this.$route.query.description;
      this.mouth_sales = this.$route.query.mouth_sales;
      this.price = this.$route.query.price;
      this.rating = this.$route.query.rating;
      this.rating_count = this.$route.query.rating_count;
      this.satisfy_rate = this.$route.query.satisfy_rate;
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .fixed-page{
    z-index: 3;
    background-color: #fff;
  }
  .foodsDetail-container{
    .foodsDetail-img{
      @include wh(100%, 6rem);
    }
    .foosDetail-desc{
      padding:.25rem;
      h4{
        margin-bottom: .1rem;
        @include sc(.24rem, #999);
      }
      .title{
        margin-bottom: .1rem;
        @include sc(.3rem, #666);
      }
      p{
        span{
          @include sc(.24rem, #666);
          margin-right: .1rem;
          margin-bottom: .1rem;
        }
        .orange{
          color: $orange;
        }
      }
      .pf{
        display: flex;
        align-items: center;
      }
    }
  }
</style>