<template>
  <div class="page">
    <section v-if="!showloading">
      <head-top goback="true" head-title="确认订单"></head-top>
      <section class="address-container">
        <div class="address-left">
          <svg class="location_icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
          </svg>
          <div class="info">
            <p>
              <span class="name">{{choose_address.name}}</span>
              <span>{{choose_address.sex == 1 ? '先生' : '女士'}}</span>
              <span>{{choose_address.phone}}</span>
            </p>
            <p>
              <span class="tag" :style="{backgroundColor:iconColor(choose_address.tag)}">{{choose_address.tag}}</span>
              <span>{{choose_address.address_detail}}</span>
            </p>
          </div>
        </div>
        <svg class="address-right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </section>
      <section class="deliver-box">
        <h1>送达时间</h1>
        <div class="deliver-info">
          <div>
            <span>尽快送达</span>
            <span>|</span>
            <span>预计{{checkData.delivery_reach_time}}</span>
          </div>
          <div class="fengniao">蜂鸟转送</div>
        </div>
      </section>
      <section class="payWay-box">
        <ul>
          <li @click="showPayWay">
            <span class="payWay-text">支付方式</span>
            <div class="right-side">
              <span>在线支付</span>
              <svg class="address-right">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </div>
          </li>
          <li>
            <span>红包</span>
            <span>暂时只在饿了么 APP 中支持</span>
          </li>
        </ul>
      </section>
    </section>
    <loading v-show="showloading"></loading>

  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import { mapState, mapMutations } from 'vuex';
  import {getAddressList, checkout} from '@/api/getData'
  import loading from '@/components/loading'
  export default {
    data () {
      return {
        shop_id: null,
        geohash: null,
        shopCart: null,
        showloading:true,
      }
    },
    components: {
      headTop, loading
    },
    computed: {
      ...mapState([
        'userInfo', 'choose_address', 'cartList'
      ])
    },
    created () {
      this.geohash = this.$route.query.geohash;
      this.shop_id = this.$route.query.shop_id;
      this.INIT_CART();
      this.shopCart = this.cartList[this.shop_id];
    },
    mounted () {
      this.initData();
    },
    methods: {
      ...mapMutations([
        'CHOOSE_ADDRESS','INIT_CART'
      ]),
      async initData(){
        let newArr = new Array();
        Object.values(this.shopCart).forEach(categoryItem => {
          Object.values(categoryItem).forEach(valueItem => {
            Object.values(valueItem).forEach(item => {
              newArr.push({
                attrs: [],
                extra: {},
                id: item.id,
                name: item.name,
                packing_fee: item.packing_fee,
                price: item.price,
                quantity: item.num,
                sku_id: item.sku_id,
                specs: [item.specs],
                stock: item.stock,
              })
            })
          })
        })
        this.checkData = await checkout(this.geohash, [newArr], this.shop_id);
        this.initAddress();
        this.showloading = false;
      },
      async initAddress(){
        if(this.userInfo && this.userInfo.user_id){
          let addressRes = await getAddressList(this.userInfo.user_id);
          console.log(addressRes);
          
          if(addressRes.length && addressRes instanceof Array){
            this.CHOOSE_ADDRESS(addressRes[0]);
          }
        }
      },
      iconColor(value){
        switch(value){
          case '学校' : return '#3190e8';
          case '公司' : return '#4cd964';
        }
      },
      showPayWay(){

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .address-container{
    background-color: #fff;
    @include fj;
    align-items: center;
    padding:.25rem;
    .address-left{
      display: flex;
      align-items: center;
      .location_icon{
        @include wh(.3rem, .3rem);
        fill: $blue;
      }
      .info{
        margin-left: .1rem;
        p{
          span{
            @include sc(.24rem, #666);
          }
          .name{
            @include sc(.3rem, #000);
            font-weight: bold;
          }
          .tag{
            @include sc(.24rem, #fff);
            background-color: $green;
            padding:0 .05rem;
            border-radius: 3px;
          }
        }
      }
    }
    .address-right{
      @include wh(.3rem, .3rem);
      fill:#999;
    }
  }
  .deliver-box{
    background-color: #fff;
    margin-top: .15rem;
    @include fj;
    border-left: 4px solid $blue;
    padding:.4rem .25rem;
    align-items: center;
    h1{
      @include sc(.35rem, #000);
      font-weight: bold;
    }
    .deliver-info{
      text-align: right;
      span{
        @include sc(.24rem, $blue);
      }
      .fengniao{
        background-color: $blue;
        padding:.05rem .1rem;
        border-radius: 3px;
        display: inline-block;
        @include sc(.24rem, #fff);
        margin-top: .1rem;
      }
    }
  }
  .payWay-box{
    background-color: #fff;
    margin-top: .15rem;
    padding: 0 .25rem;
    ul{
      li{
        align-items: center;
        padding:.25rem 0;
        @include fj;
        span{
          @include sc(.24rem, #999);
        }
        border-bottom:1px solid #f1f1f1;
        .payWay-text{
          @include sc(.3rem, #666);
        }
        .right-side{
          svg{
            @include wh(.2rem, .2rem);
            fill: #999;
          }
        }
      }
    }
  }
</style>