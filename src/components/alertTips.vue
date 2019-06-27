<template>
  <div class="alert-wrap">
    <section class="inside-box">
      <i class="icon iconfont icon-tips"></i>
      <section class="alert-txt">
        {{alertTxt}}
      </section>
      <div class="btn-confirm" @click="closeTips">确认</div>
    </section>
  </div>
</template>
<script>
export default {
 data () {
   return {

   }
 },
 props: ['alertTxt'],
 methods: {
   closeTips(){
     this.$emit('closeTips')
   }
 }
}

</script>

<style lang="scss">
  @import '../style/mixin';
  @keyframes zoomBox {
    0%   { transform: scale(1) }
    35%  { transform: scale(.8) }
    70%  { transform: scale(1.1) }
    100% { transform: scale(1) }
  }
  .alert-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .1);
    .inside-box {
      position:absolute;
      top: 50%;
      left: 50%;
      width: px2rem(250);
      margin-top: px2rem(-130);
      margin-left: px2rem(-120);
      animation: zoomBox .4s;
      background-color: #fff;
      text-align: center;
      border-radius: px2rem(5);
      padding-top:px2rem(10);
      overflow: hidden;
    }
   .icon-tips {
     @include sc(px2rem(75), #f8cb86)
   }
   .alert-txt {
     font-size: px2rem(14);
     margin: px2rem(10);
   }
   .btn-confirm {
     background-color: $green;
     line-height: px2rem(40);
     color: #fff;
   }
  }
</style>

