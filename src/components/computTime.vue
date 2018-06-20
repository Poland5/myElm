<template>
  <div class="comput-box">
    {{remainingTime}}
    <alert-tips :alertTxt="alertTxt" v-if="showAlert"></alert-tips>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        countNum: 900,
        showAlert: false,
      }
    },
    props: ['time'],
    computed: {
      remainingTime:function(){
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          
          this.remainingTime = this.countNum--;
          console.log(this.remainingTime);
          
          if(this.countNum == 0){
            clearInterval(this.timer);
            this.showAlert = true;
            this.alertTxt = "支付已超时"
          }
        },1000)
      }
    },
    methods:{
      
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .comput-box{
    @include sc(.24rem, $orange);
    padding: .05rem .1rem;
    border-radius: 3px;
    border: 1px solid $orange;
    display: inline-block;  
  }
</style>