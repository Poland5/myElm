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
  .alert-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .1);
    .inside-box{
      width: 5rem;
      @include center;
      background-color: #fff;
      text-align: center;
      border-radius: .1rem;
      padding-top:.2rem;
      overflow: hidden;
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

