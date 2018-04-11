<template>
  <div>
    <header class="head-top">
      <div name="elm" class="elm">elm</div>
      <div class="head-title ellipsis">
        <span>名称是</span>
      </div>
      <router-link to="/register" class="rigister">登录 | 注册</router-link>
    </header>
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss">
  @import "../style/mixin.scss";

  .head-top{
    background: #3190e8;
    width: 100%;
    height: 1rem;
    position: fixed;
    top: 0;
    color: #fff;
    line-height: 1rem;
    padding: 0 .15rem;
    display: flex;
    @include fj;
    .head-title{
      @include center;
      text-align: center;
      width: 3rem;
    }
     .rigister{
       color: #fff;
    }
  }
 
</style>
