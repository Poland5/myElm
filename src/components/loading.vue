<template>
<div class="loading-container">
  <div class="loading-img" :style="{backgroundPositionY:-(positionY%7)*1+'rem'}"></div>
  <svg class="load_ellipse" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <ellipse cx="25" cy="15" rx="21" ry="9" style="fill:#ddd;stroke:none;"></ellipse>
  </svg>
</div>
</template>
<script>
import headTop from '@/components/headTop'
  export default {
  data () {
    return {
      positionY:0
    }
  },
  components: {
    headTop
  },
  mounted () {
    setInterval(() => {
      this.positionY++
    },650)
  }
}
</script>
<style lang="scss">
  @import 'src/style/mixin';
  @keyframes load {
    0% {transform: translateY(0px)}
    50% {transform: translateY(-50px)}
    100% {transform: translateY(0px)}
  }
  @keyframes ellipse {
    0%    {transform:scale(1)}
    50%   {transform:scale(0.3)}
    100%  {transform:scale(1)}
  }
  .loading-container{
    z-index: 5;
    @include wh(1rem, 1rem);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .loading-img{
      background:url('../images/icon_loading.png');
      @include wh(1rem, 1rem);
      background-size: 100%;
      animation: load .6s infinite ease-in-out;
      position: relative;
    }
  }
  .load_ellipse{
    @include wh(1rem, .5rem);
    position: absolute;
    z-index: 10;
    -webkit-animation: ellipse .6s infinite ease-in-out;
    -o-animation: ellipse .6s infinite ease-in-out;
    animation: ellipse .6s infinite ease-in-out;
  }
</style>


