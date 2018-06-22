<template>
  <div class="page">
    <head-top goback="true" head-title="订单列表"></head-top>
    <ul class="order-list-ul">
      <li v-for="(item, index) in orderList" :key="index">
        <img :src="baseImgPath + item.restaurant_image_url">
        <section class="right-content">
          <header class="order-header">
            <section>
              <h2>
                <span class="order-name">{{item.restaurant_name}}</span>
                <svg fill="#333" class="arrow_right">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
              </h2>
              <span class="order-time">{{item.formatted_created_at}}</span>
            </section>
            <p>{{item.status_bar.title}}</p>
          </header>
          <div class="order-name-price">
            <span>{{item.basket.group[0][0].name}}等{{item.total_quantity}}件商品</span>
            <span>￥{{item.total_amount.toFixed(2)}}</span>
          </div>
          <div class="order-wait-pay">
            <comput-time v-if="item.status_bar.title == '等待支付'" :time="item.time_pass"></comput-time>
            <router-link class="order-again" to="/miste" v-else>再来一单</router-link>
          </div>
        </section>
      </li>
    </ul>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import footGuide from '@/components/footGuide'
  import computTime from '@/components/computTime'
  import { getOrderList } from '@/api/getData'
  import { mapState } from 'vuex';
  export default {
    data () {
      return {
        limit: 10,
        offset: 10,
        orderList: {},
        baseImgPath: 'http://cangdu.org:8001/img/',
        totalPrice: null,
      }
    },
    components: {
      headTop, footGuide, computTime
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
        this.orderList = await getOrderList(this.userInfo.user_id, this.limit, this.offset);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .page{
    padding-bottom: 1rem;
  }
  .order-list-ul{
    li{
      padding:.25rem .25rem 0 .25rem;
      display: flex;
      background-color: #fff;
      margin-bottom: .2rem;
      img{
        @include wh(.8rem, .8rem);
      }
    }
    .right-content{
      margin-left:.1rem;
      width: 100%;
      .order-header{
        border-bottom: 1px solid #f4f4f4;
        @include fj;
        h2{
          display: flex;
          align-items: center;
          .order-name{
            @include sc(.3rem, #666);
          }
          .arrow_right{
            @include wh(.15rem, .15rem);
          }
        }
        .order-time{
          @include sc(.24rem, #999);
        }
        p{
          @include sc(.24rem, #666);
        }
      }
      .order-name-price{
        @include fj;
        padding: .25rem 0;
        border-bottom: 1px solid #f4f4f4;
        span:nth-of-type(1){
          @include sc(.24rem, #666);
        }
        span:nth-of-type(2){
          @include sc(.24rem, $orange);
          font-weight: bold;
        }
      }
      .order-wait-pay{
        padding: .25rem 0;
        display: flex;
        justify-content: flex-end;
        .order-again{
          @include sc(.24rem, $blue);
          padding: .05rem .1rem;
          border-radius: 3px;
          border: 1px solid $blue;
          display: inline-block;  
        }
      }
    }
  }
</style>