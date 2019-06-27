<template>
  <div>
    <ul class="shoplist" v-if="shoplist.length" v-load-more="loadMore" type="1">
      <router-link
        :to="{path:'shop', query:{id:item.id,geohash}}"
        tag="li"
        v-for="(item,index) in shoplist"
        :key="index"
        >
        <div class="item-left">
          <img :src="imgBaseUrl + item.image_path" class="shopImg">
        </div>
        <div class="item-right">
          <header>
            <h3 :class="item.is_premium ? 'premium' : ''">{{item.name}}</h3>
            <div class="ticket">
              <span v-for="(subItem, subIndex) in item.supports" :key="subIndex">{{subItem.icon_name}}</span>
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
              <span>{{item.float_minimum_order_amount}}￥起送</span>
              <span class="segmentation">/</span>
              <span>{{item.piecewise_agent_fee.tips}}</span>
            </div>
            <div class="distance">
              <span>{{item.distance}}</span>
              <span class="segmentation">/</span>
              <span class="order-lead-time">{{item.order_lead_time}}</span>
            </div>
          </section>
        </div>
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
    import { imgBaseUrl } from '@/config/env'
    import { shoplist } from '@/api/getData'
    import { loadMore } from './mixins.js'
    import { mapState } from 'vuex';
    export default {
      data () {
        return {
          latitude: '',  // 经度
          longitude: '', // 维度
          offest: 0,    // 跳过条数
          limit: 20,    // 请求数量
          imgBaseUrl: 'http://cangdu.org:8001/img/',
          shoplist: {},   // 商铺列表
          touchEnd: false,  // 没有更多加载
          preventRepeat: false, // 防止重复加载
          showLoading: true,  // loading
        }
      },
      props: ['geohash','restuarantCategoryIds','orderBy','deliveryMode','supportIds','statuFilter'],
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
      mounted() {
        if (this.geohash) {
          let arr = this.geohash.split(',')
          this.latitude = arr[0]
          this.longitude = arr[1]
          this.initData()
        }
      },
      methods: {
        async initData() {
          let res = await shoplist(this.latitude, this.longitude, this.offest, this.limit)
          if (res.length < 20) {
            this.touchEnd = true
          }
          this.shoplist = [...res] // 内部扩展符目的是的不会修改原本的数组，而是克隆一组新数组
          this.showLoading = false
        },
        async loadMore() {
          //如果没有更多不在继续执行
          if (this.touchEnd || this.preventRepeat) {
            return
          }
          this.preventRepeat = true
          this.showLoading = true
          this.offest += 20
          let res = await shoplist(this.latitude, this.longitude, this.offest, this.limit)
          if (res.length < 20) {
            this.touchEnd = true
          }
          this.showLoading = false
          this.shoplist = [...this.shoplist, ...res]
          this.preventRepeat = false
        },
        // 监听父类传来数据的变化，触发此函数重新获得数据
        async listenPropChange(){
          this.showLoading = true
          this.offest = 0
          let res = await shoplist(this.latitude, this.longitude, this.offest, this.limit,'', this.restuarantCategoryIds, this.orderBy, this.deliveryMode, this.supportIds)
          this.shoplist = [...res]
          this.showLoading = false
        }
      },
      watch: {
        // 监听父类传来的restaurantCategoryIds, 数据方式改变时重新获取餐馆数据
        restuarantCategoryIds:function(value) {
          this.listenPropChange()
        },
        // 监听父类传来的排序方式
        orderBy:function(value) {
          this.listenPropChange()
        },
        // 监听父级按钮是否被点击，并返回一个自定义事件通知父级
        statuFilter:function(value) {
          this.listenPropChange()
        }
      }
    }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .shoplist{
    background-color: #fff;
    overflow-x: hidden;
    li{
      padding:px2rem(12.5) 0;
      border-bottom: 1px solid #eee;
      display: flex;
      .item-left{
        padding-left:px2rem(7.5);
        .shopImg{
          @include wh(px2rem(60), px2rem(60));
        }
      }
      .item-right{
        margin-left:px2rem(5);
        padding:0 px2rem(5);
        flex: auto;
        justify-content: space-between;
        header{
          padding:0;
          @include fj;
        }
        .premium{
          @include sc(px2rem(14), #333);
          font-weight: bold;
          display: inline-block;
          &::before{
            content: '品牌';
            display: inline-block;
            background-image: linear-gradient(-139deg,#fff100,#ffe339);
            border-radius: px2rem(3);
            margin-right: px2rem(5);
            padding: px2rem(2) px2rem(3);
            @include sc(px2rem(12), #6f3f15);
            transform: scale(.85);
          }
        }
        h4{
          @include sc(px2rem(15), #333);
          font-weight: bold;
        }
        .ticket{
          transform: scale(.8);
          span{
            display: inline-block;
            border:1px solid #f1f1f1;
            border-radius: px2rem(2.5);
            margin-left: 1px;
            @include sc(px2rem(7.5), #999);
          }
        }
        .rating-num{
          @include fj;
          margin-top: px2rem(5);
          .inner-left{
            display: flex;
            align-items: center;
            .rating{
              @include sc(px2rem(10), #ff6000);
              margin: 0 px2rem(5);
            }
            .moth-sale{
              @include sc(px2rem(10), #666);
            }
          }
          .inner-right{
            transform: scale(.7) translateX(px2rem(15));
            align-items: center;
            @include fj;
            .delivery-text{
              border: 1px solid $blue;
              border-radius: 3px;
              background-color: $blue;
              @include sc(px2rem(10), #fff);
              padding:0 px2rem(1);
            }
            .onTime{
              border: 1px solid $blue;
              @include sc(px2rem(10), $blue);
              border-radius: 3px;
              padding:0 px2rem(1);
              margin-left: px2rem(1);
            }
          }
        }
        .delivery-distrance{
          @include fj;
          margin-top: px2rem(5);
          .delivery-fee{
            @include sc(px2rem(10), #666);
            transform: scale(.9);
          }
          .distance{
            @include sc(px2rem(10), #666);
            transform: scale(.9) translateX(px2rem(5));
            .order-lead-time{
              @include sc(px2rem(10), $blue);
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
