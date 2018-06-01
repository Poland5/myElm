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
  @keyframes zoomBox{
      0%   { transform: scale(1) }
      35%  { transform: scale(.8) }
      70%  { transform: scale(1.1) }
      100% { transform: scale(1) }
  }
  .alert-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .1);
    .inside-box{
      width: 5rem;
      position:absolute;
      top: 3.5rem;
      left: 0.7rem;
      background-color: #fff;
      text-align: center;
      border-radius: .1rem;
      padding-top:.2rem;
      overflow: hidden;
      animation: zoomBox .4s;
    }
   .icon-tips{
     @include sc(1.5rem, #f8cb86)
   }
   .alert-txt{
     margin: .2rem;
   }
   .btn-confirm{
     background-color: $green;
     line-height: .8rem;
     color: #fff;
   }
  }
</style>

