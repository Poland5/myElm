<template>
  <div class="page">
    <head-top goback="true" head-title="我的积分"></head-top>
    <section class="points-box">
        <header>
            <span>当前积分</span>
            <router-link to="/points/detail" class="header-right">
                <img src="../../images/description.png">
                <span>我的积分</span>
            </router-link>
        </header>
        <div class="points-txt">
            <span>0</span>
            <span>分</span>
        </div>
        <div class="points-exchange">积分兑换商品</div>
    </section>
    <section class="points-tips">
        <header>最近30天记录</header>
        <div class="no-log">
            <img src="../../images/voucher.png">
            <p>最近30天无积分记录</p>
            <p>快去下单赚取大量积分吧</p>
        </div>
    </section>
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
    }
  }
</script>
<style lang="scss" scoped>
    @import 'src/style/mixin';
    .points-box{
        background-color: $blue;
    }
</style>