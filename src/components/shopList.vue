<template>
  <div>
    <ul class="shoplist" v-if="shoplist.length" v-load-more="loadMore" >
      <router-link :to="{path:'shop',query:{id:item.id,geohash}}" tag="li" v-for="(item,index) in shoplist" :key="index">
        <section class="item-left">
          <img :src="imgBaseUrl + item.image_path" class="shopImg">
        </section>
        <section class="item-right">
          <header>
            <h4 :class="item.is_premium ? 'premium' : ''">{{item.name}}</h4>
            <div class="ticket">
              <span v-for="(subItem,subIndex) in item.supports" :key="subIndex">{{subItem.icon_name}}</span>
            </div>
          </header>
          <section class="rating-num">
            <div class="inner-left">
              <rating-star :rating="item.rating"></rating-star>
              <span class="rating">{{item.rating}}</span>
              <span class="moth-sale">月售{{item.recent_order_num}}单</span>
            </div>
            <div class="inner-right">
              <span class="delivery-text" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
              <span class="onTime">准时达</span>
            </div>
          </section>
          <section class="delivery-distrance">
            <div class="delivery-fee">
              {{item.float_minimum_order_amount}}￥起送/{{item.piecewise_agent_fee.tips}}
            </div>
            <div class="distance">
              {{item.distance}}/<span class="order-lead-time">{{item.order_lead_time}}</span>
            </div>
          </section>
        </section>
      </router-link>
    </ul>
    <transition name="fade">
      <loading v-if="showLoading"></loading>
    </transition>
  </div>
</template>
<script>
  import ratingStar from '@/components/ratingStar'
  import loading from '@/components/loading'
  import {imgBaseUrl} from '@/config/env'
  import {shoplist} from '@/api/getData'
  import {loadMore} from './mixins.js'
import { mapState } from 'vuex';
  export default {
    data () {
      return {
        latitude:'',  //经度
        longitude:'', //维度
        offest: 0,    //跳过条数
        limit: 20,    //请求数量
        imgBaseUrl:'http://cangdu.org:8001/img/', 
        shoplist:{},   //商铺列表
        touchEnd: false,  //没有更多加载
        preventRepeat: false, //防止重复加载
        showLoading:true,  //loading
      }
    },
    props:['geohash','restuarantCategoryIds','orderBy','deliveryMode','supportIds','statuFilter'],
    mixins: [loadMore],
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    components: {
      ratingStar,
      loading
    },
    mounted () {
      if(this.geohash){
        let arr = this.geohash.split(',');
        this.latitude = arr[0];
        this.longitude = arr[1];
        this.initData();
      }
    },
    methods: {
      async initData(){
        let res = await shoplist(this.latitude, this.longitude, this.offest, this.limit);
        this.shoplist = [...res];
        if(res.length < 20){
          this.touchEnd = true;
        }
        this.hideLoading();
      },
      async loadMore(){
        //如果没有更多不在继续执行
        if(this.touchEnd){
          return;
        }
        //防止重复加载
        if(this.preventRepeat){
          return;
        }
        this.preventRepeat = true;
        this.showLoading = true;
        this.offest += 20;
        let res = await shoplist(this.latitude, this.longitude, this.offest, this.limit);
        this.hideLoading();
        this.shoplist = [...this.shoplist, ...res];
        if(res.length < 20){
          this.touchEnd = true;
          return;
        }
        this.preventRepeat = false;
      },
      async listenPropChange(){
        this.showLoading = true;
        this.offest = 0;
        let res = await shoplist(this.latitude, this.longitude, this.offest, this.limit,'', this.restuarantCategoryIds, this.orderBy, this.deliveryMode, this.supportIds);
        this.shoplist = [...res];
        this.hideLoading();
      },
      hideLoading(){
        this.showLoading = false;
      }
    },
    watch: {
      restuarantCategoryIds:function(value){
        this.listenPropChange();
      },
      orderBy:function(value){
        this.listenPropChange();
      },
      statuFilter:function(value){
        this.listenPropChange();
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .shoplist{
    background-color: #fff;
    li{
      padding:.25rem 0;
      border-bottom: 1px solid #eee;
      display: flex;
      .item-left{
        padding-left:.15rem;
        .shopImg{
          @include wh(1.2rem, 1.2rem);
        }
      }
      .item-right{
        margin-left:.1rem;
        padding:0 .1rem;
        flex: auto;
        header{
          padding:0;
          @include fj;
        }
        .premium::before{
          content: '品牌';
          background-color: #ffd930;
          @include sc(.2rem, #333);
          font-weight: bold;
          border-radius: .03rem;
          display: inline-block;
          margin-right: .1rem;
        }
        h4{
          @include sc(.3rem, #333);
          font-weight: bold;
        }
        .ticket{
          span{
            display: inline-block;
            border:1px solid #f1f1f1;
            border-radius: .05rem;
            margin-left:.01rem;
            @include sc(.15rem, #999)
          }
        }
        .rating-num{
          @include fj;
          margin-top: .1rem;
          .inner-left{
            display: flex;
            align-items: center;
            .rating{
              @include sc(.2rem, #ff6000)
            }
            .moth-sale{
              @include sc(.2rem, #666)
            }
          }
          .inner-right{
            transform: scale(.7);
            align-items: center;
            margin-right: -.3rem;
            @include fj;
            .delivery-text{
              border-radius: 3px;
              background-color: $blue;
              @include sc(.2rem, #fff);
              padding:0 .01rem;
            }
            .onTime{
              border: 1px solid $blue;
              @include sc(.2rem, $blue);
              border-radius: 3px;
              padding:0 .01rem;
            }
          }
        }
        .delivery-distrance{
          @include fj;
          margin-top: .1rem;
          .delivery-fee{
            @include sc(.2rem, #666);
            transform: scale(.9);
          }
          .distance{
            @include sc(.2rem, #666);
            transform: scale(.9);
            .order-lead-time{
              @include sc(.2rem, $blue);
            }
          }
        }
      }
    }
  }
  .fade-enter-active, .fade-levea-active{
    transition: opacity 1s;
  }
  .fade-enter, .fade-levea-active{
    opacity: 0;
  }
</style>