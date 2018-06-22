<!--App.vue是我们的主组件，所有页面都是在App.vue下进行切换的。其实你也可以理解为所有的路由也是App.vue的子组件。所以我将router标示为App.vue的子组件。-->

<template>
  <div id="app">
    <transition name="router-change">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-change">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <svg-icon></svg-icon>
  </div>
</template>

<script>
    import svgIcon from '@/components/svg.vue'
    export default {
        name: 'App',
        components: {
            svgIcon
        }
    }
</script>

<style lang="scss">
  @import "./style/common.scss";
  .page{
    padding-top: 1rem;
    width: 100%;
  }
  .fixed-page{
    top:0;
    padding-top:1rem;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #f5f5f5;
  }
  .sub-page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f5f5;
    z-index: 204;
    overflow-y: auto;
    padding-top:1rem;
  }
  .router-change-enter-active, .router-change-leave-active{
    transition: opacity .5s;
  }
  .router-change-enter, .router-change-leave{
    opacity: 0;
  }

</style>

