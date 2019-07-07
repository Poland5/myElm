<template>
  <div class="comput-box">
    {{ remaining }}
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
      remaining: function() {
        let minute = parseInt(this.countNum / 60)
        let second = parseInt(this.countNum % 60)
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        return `去支付(还剩${ minute }分${ second }秒)`
      }
    },
    mounted() {
      this.countNum -= parseInt(this.numTime)
      this.remainingTime()
    },
    methods: {
      remainingTime() {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.countNum --
          if (this.countNum == 0) {
            clearInterval(this.timer)
            this.showAlert = true
            this.alertTxt = "支付已超时"
          }
        }, 1000)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .comput-box{
    @include sc(px2rem(12), $orange);
    padding: px2rem(2.5) px2rem(5);
    border-radius: px2rem(3);
    border: 1px solid $orange;
    display: inline-block;
  }
</style>
