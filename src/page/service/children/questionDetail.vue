<template>
    <div class="fixed-page">
        <head-top goback="true" :head-title="question.title"></head-top>
        <section id="questionDetailContent" class="questionDetail-content">
            <section v-html="markdownText"></section>
        </section>
    </div>
</template>
<script>
    import headTop from '@/components/headTop'
    import showdown from 'showdown';
    import { mapState } from 'vuex';
    import BScroll from 'better-scroll';
    export default {
        data () {
            return {

            }
        },
        components: {
            headTop
        },
        computed: {
            ...mapState([
                'question'
            ]),
            markdownText:function(){
              let converter = new showdown.Converter();
              return converter.makeHtml(this.question.detail);
            }
        },
        mounted () {
          this.$nextTick(() => {
            new BScroll('#questionDetailContent', {  
              deceleration: 0.001,
              bounce: true,
              swipeTime: 1800,
              click: true,
            }); 
          })
        }   
    }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .fixed-page{
    z-index: 101;
  }
</style>