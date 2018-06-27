<template>
  <div class="page">
    <head-top goback="true" head-title="服务中心"></head-top>
    <section class="service-container">
        <section class="service-box">
            <section class="service-left">
                <svg data-v-1a228d92=""><use data-v-1a228d92="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#human"></use></svg>
                <p>在线客服</p>
            </section>
            <section class="service-right">
                <svg data-v-1a228d92=""><use data-v-1a228d92="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#phone"></use></svg>
                <p>在线客服</p>
            </section>
        </section>
        <section class="hot-question" v-if="serviceData">
            <header>热门问题</header>
            <ul class="hot-question-ul">
                <li v-for="(item, index) in questionTitle" :key="index" @click="toQuestionDetail(item,index)">
                    <span>{{item}}</span>
                    <svg class="arrow-svg" fill="#999">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                    </svg>
                </li>
            </ul>
        </section>
    </section>
    <transition name="slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import { getService } from '@/api/getData'
  import { mapMutations } from 'vuex';
  export default {
    data () {
        return {
            serviceData: null,
            questionTitle: [],
            questionDetail: []
        }
    },
    components: {
        headTop
    },
    mounted () {
        this.initData();
    },
    methods: {
        ...mapMutations([
            'SAVE_QUESTION_DETAIL'
        ]),
        async initData(){
            this.serviceData = await getService();
            Object.keys(this.serviceData).forEach(item => {
                let avoidRepeat = false;
                //获取问题标题和
                if(item.indexOf('Caption') !== -1 && !avoidRepeat){
                    this.questionTitle.push(this.serviceData[item]);
                }else if(!avoidRepeat){ //内容
                    this.questionDetail.push(this.serviceData[item]);
                }
                this.questionTitle.forEach((insertItem) => {
                    if(insertItem == this.serviceData[item]){
                        avoidRepeat = true;
                    }
                })
            })
        },
        toQuestionDetail(title,index){
            this.SAVE_QUESTION_DETAIL({title,detail:this.questionDetail[index]});
            this.$router.push('/service/questionDetail');
        }
    }
  }
</script>
<style lang="scss" scoped>
    @import 'src/style/mixin';
    .service-container{
        background-color: #fff;
        .service-box{
            display: flex;
            align-items: center;
            .service-left{
                flex: 1;
                border-right: 1px solid #eee;
                border-bottom: 1px solid #eee;
                height: 1.5rem;
                text-align: center;
                align-items: center;
                padding-top: .4rem;
                svg{
                    @include wh(.4rem, .4rem)
                }
            }
            .service-right{
                flex: 1;
                border-bottom: 1px solid #eee;
                text-align: center;
                height: 1.5rem;
                padding-top: .4rem;
                svg{
                    @include wh(.4rem, .4rem)
                }
            }
            p{
                @include sc(.24rem, #666);
            }
        }
        .hot-question{
            header{
                padding: .35rem .2rem;
                border-bottom: 1px solid #eee;
            }
            .hot-question-ul{
                li{
                    border-bottom: 1px solid #eee;
                    padding:.2rem;
                    @include fj;
                    align-items: center;
                    svg{
                        @include wh(.2rem, .2rem);
                    }
                }
            }
        }
    }
</style>