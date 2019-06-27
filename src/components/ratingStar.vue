<template>
  <div class="rating-wrap">
    <section class="star-container">
      <svg class="grey-star" v-for="num in 5" :key="num">
        <use xlink:href="#star"></use>
      </svg>
    </section>
    <div class="overflow-box" :style="'width:' + rating/5 + 'rem'">
      <section class="star-container">
        <svg class="orange-star" v-for="num in 5" :key="num">
          <use xlink:href="#star"></use>
        </svg>
      </section>
    </div>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  export default {
    data () {
      return {

      }
    },
    components: {
      headTop
    },
    props:['rating']
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .rating-wrap{
    position: relative;
    @include wh(1rem, .2rem);
  }
  .grey-star{
    fill: #f1f1f1;
    @include wh(.2rem, .2rem);
  }
  .star-container{
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
  }
  .overflow-box{
    overflow: hidden;
    display: flex;
    position: relative;
    height: .2rem;
      .orange-star{
        fill: #ff9a0d;
        @include wh(.2rem, .2rem);
      }
    }



</style>
