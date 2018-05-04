<template>
  <div class="fixed-page">
    <head-top goback="true" head-title="历史红包"></head-top>
      <section class="hbHistory-container" id="scroll-container" v-if="showLoading">
        <ul class="hbHistory-list-ul">
          <li v-for="(item,index) in hbHistoryList" :key="index">
            <section class="hbHistory-item">
              <div class="item-left">
                <div class="text">
                  <span>￥</span>
                  <span>{{String(item.amount).split('.')[0]}}</span>
                  <span>.</span>
                  <span>{{String(item.amount).split('.')[1]||0}}</span>
                </div>
                <p class="desc">{{item.description_map.sum_condition}}</p>
              </div>
              <div class="item-right">
                <p>{{item.name}}</p>
                <p>{{item.description_map.validity_periods}}</p>
                <p>{{item.description_map.phone}}</p>
              </div>
              <svg class="expired">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#expired"></use>
              </svg>
            </section>
            <footer class="item-footer" v-if="item.limit_map">
              {{item.limit_map.restaurant_flavor_ids}}
            </footer>
          </li>
        </ul>
      </section>
      <loading v-if="!showLoading"></loading>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import {gethbHistory} from '@/api/getData'
  import {mapState} from 'vuex'
  import BScorll from 'better-scroll'
  export default {
    data () {
      return {
        hbHistoryList:null,
        showLoading:false,
        limit: 20,
        offset: 0
      }
    },
    components: {
      headTop
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    mounted () {
      this.initData();
    },
    methods: {
      async initData(){
        if(this.userInfo){
          this.hbHistoryList = await gethbHistory(this.userInfo.user_id, this.limit, this.offset);
          this.showLoading = true;
          this.$nextTick(() => {
            new BScorll('#scroll-container',{
              deceleration:0.01,
              bounce: true,
              swipeTime: 1800,
              click:true
            })
          })
        }
      }
    },
    watch: {
      userInfo:function(){
        this.initData();
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .hbHistory-container{
    position: fixed;
    top:0;
    right: 0;
    bottom: 0;
    left: 0;
    padding-top:1rem;
    z-index: 99;
    .hbHistory-list-ul{
      margin-top:.3rem;
      padding:0 .15rem;
      li{
        margin-bottom: .15rem;
        background:#fff url('../../../images/expired.png') repeat-x;
        background-size: .2rem;
        border-radius: .1rem;
        position: relative;
        .hbHistory-item{
          @include fj;
          padding:.4rem .2rem;
          .item-left{
            flex: 1;
            border-right: 1px solid #eee;
            .text{
              font-size: 0px;
              span{
                font-family: Helvetica Neue,Tahoma,Arial;
              }
              span:nth-of-type(1){
                @include sc(.36rem, #ccc);
              }
              span:nth-of-type(2){
                @include sc(.65rem, #ccc);
                font-weight: bold;
              }
              span:nth-of-type(3){
                @include sc(.36rem, #ccc);
              }
              span:nth-of-type(4){
                @include sc(.36rem, #ccc);
                font-weight: bold;
              }
            }
            .desc{
              @include sc(.18rem, #999)
            }
          }
          .item-right{
            flex:2;
            margin-left:.3rem;
            p:nth-of-type(1){
              @include sc(.3rem, #666);
            }
            p:nth-of-type(2),p:nth-of-type(3){
              @include sc(.18rem, #999);
            }
          }
          .expired{
            position: absolute;
            top: .1rem;
            right: .1rem;
            @include wh(1.5rem, 1.5rem)
          }
        }
        .item-footer{
          @include sc(.18rem, #999);
          background-color: #f9f9f9;
          padding:.2rem;
          clear: both;
        }
      }
    }
  }
</style>