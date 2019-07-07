<template>
  <div class="page">
    <section v-if="!showloading">
      <head-top goback="true" head-title="确认订单"></head-top>
      <div class="viewbody">
        <section class="cart-container">
          <router-link tag="div" :to="{ path:'/confirmOrder/chooseAddress', query:{ id: checkData.cart.id, sig: checkData.sig } }">
            <div class="address-item">
              <p class="title">
                <span class="text">订单配送至</span>
                <span v-if="chooseAddress" class="tag">{{chooseAddress.tag}}</span>
              </p>
              <p class="address-detail" v-if="!chooseAddress">
                <span class="text">选择收货地址</span>
                <svg>
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
              </p>
              <div v-else>
                <p class="address-detail">
                  <span class="text ellipsis">{{ chooseAddress.address + chooseAddress.address_detail }}</span>
                  <svg>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                  </svg>
                </p>
                <h2 class="address-name">
                  <span class="name">{{chooseAddress.name}}</span>
                  <span>{{chooseAddress.sex == 1 ? '先生' : '女士'}}</span>
                  <span>{{chooseAddress.phone}}</span>
                  <span>{{chooseAddress.address_detail}}</span>
                </h2>
              </div>
            </div>
          </router-link>
        </section>
        <section class="checkout-section">
          <section class="deliver-box border-1px">
            <div class="deliver-left">送达时间</div>
            <div class="deliver-right">
              <span>尽快送达({{checkData.delivery_reach_time}}送达)</span>
            </div>
          </section>
          <section class="payway-box">
            <div class="payway-left">支付方式</div>
            <div class="payway-right" @click="showPayWayFunc">
              <span>在线支付</span>
            </div>
          </section>
        </section>
        <section class="foods-list-container">
          <header>
            <img class="header-img" :src="baseImgPath + checkData.cart.restaurant_info.image_path">
            <h2>{{checkData.cart.restaurant_info.name}}</h2>
          </header>
          <ul class="foods-list-ul">
            <li class="border-1px" v-for="(item,index) in checkData.cart.groups[0]" :key="index">
              <div class="foods-name">
                <p class="ellipsis">{{item.name}}</p>
              </div>
              <span class="foods-quantity">x{{item.quantity}}</span>
              <span class="foods-price"><span>￥</span>{{item.price}}</span>
            </li>
            <li>
              <span>{{checkData.cart.extra[0].name}}</span>
              <span class="foods-group"><span>￥</span>{{checkData.cart.extra[0].price}}</span>
            </li>
            <li>
              <span>配送费</span>
              <span class="foods-group"><span>￥</span>{{checkData.cart.deliver_amount}}</span>
            </li>
          </ul>
        </section>
        <section class="order-box">
          <div class="total-pay">
            <span class="desc">优惠说明</span>
            <div class="total-price">小计￥<strong>{{ checkData.cart.total }}</strong></div>
          </div>
        </section>
        <section class="order-list-container">
          <router-link :to="{path:'confirmOrder/remarks',query:{id:checkData.cart.id}}" class="order-list border-bottom">
            <span class="left-txt">订单备注</span>
            <div class="right-txt">
              <span>{{remarkText || inputText ? remarkList : '口味、偏好等'}}</span>
              <svg>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </div>
          </router-link>
          <router-link :to="{path:'confirmOrder/invoice',query:{id:checkData.cart.id}}" class="order-list">
            <span class="left-txt">发票抬头</span>
            <div class="right-txt">
              <span>{{invoiceData}}</span>
              <svg>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </div>
          </router-link>
        </section>
        <section class="confirm-order">
          <span class="left-txt">待付款<span>￥</span>{{ checkData.cart.total }}</span>
          <span class="btn-confirm" @click="confirmOrder">去支付</span>
        </section>
      </div>
    </section>
    <transition name="fade">
      <section class="payway-cover" v-if="showPayWay" @click="closedPayWay"></section>
    </transition>
    <transition name="slide-up">
      <section class="payway-container" v-if="showPayWay">
        <header>支付方式</header>
        <ul class="payway-list-ul">
          <li v-for="(item, index) in checkData.payments" :key="index" :class="{ choosed: item.select_state == 1 }">
            <span>{{ item.name + item.disabled_reason}}</span>
            <svg>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
            </svg>
          </li>
        </ul>
      </section>
    </transition>
    <loading v-if="showloading"></loading>
    <transition name="slide-right">
      <router-view></router-view>
    </transition>
    <alert-tips :alertTxt="alertTxt" v-if="showAlert" @closeTips="showAlert = false"></alert-tips>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import { mapState, mapActions, mapMutations } from 'vuex'
  import { getAddressList, checkout, postOrders } from '@/api/getData'
  import loading from '@/components/loading'
  export default {
    data () {
      return {
        shop_id: null,
        geohash: null,
        shopCart: null,
        showloading: true,
        checkData: {},
        baseImgPath: 'http://cangdu.org:8001/img/',
        showPayWay: false,
        showAlert: false,
        alertTxt: null,
      }
    },
    components: {
      headTop, loading
    },
    computed: {
      ...mapState([
        'userInfo', 'chooseAddress', 'cartList', 'inputText', 'remarkText', 'invoice'
      ]),
      remarkList:function() {
        let str = new String()
        if (this.remarkText) {
          Object.values(this.remarkText).forEach(item => {
            str += item[1] + ','
          })
        }
        if (this.inputText) {
          str += this.inputText
        } else {
          str = str.substr(0, str.lastIndexOf(','))
        }
        return str
      },
      invoiceData: function() {
        if (this.invoice) {
          return '需要开发票'
        } else {
          return '不需要开发票'
        }
      }
    },
    created() {
      this.geohash = this.$route.query.geohash
      this.shop_id = this.$route.query.shop_id
      this.INIT_CART()
      this.SAVE_SHOPID(this.shop_id)
      this.shopCart = this.cartList[this.shop_id]
    },
    mounted() {
      if (this.geohash) {
        this.initData()
      }
    },
    methods: {
      ...mapMutations([
        'CHOOSE_ADDRESS','INIT_CART' ,'SAVE_SHOPID', 'ORDER_SUCCESS',
      ]),
      async initData() {
        let newArr = new Array()
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
                image_path: item.image_path
              })
            })
          })
        })
        this.checkData = await checkout(this.geohash, [newArr], this.shop_id)
        this.initAddress()
        this.showloading = false
      },
      async initAddress() {
        if (this.userInfo && this.userInfo.user_id) {
          const addressRes = await getAddressList(this.userInfo.user_id)
          if(addressRes.length && addressRes instanceof Array){
            this.CHOOSE_ADDRESS({address:addressRes[0], index:0})
          }
        }
      },
      async confirmOrder() {
        if (!(this.userInfo && this.userInfo.user_id)) {
          this.alertTxt = '请登录'
          this.showAlert = true
        } else if(!(this.chooseAddress)) {
          this.alertTxt = '选择地址'
          this.showAlert = true
        }
        let resOrders = await postOrders(this.userInfo.user_id, this.checkData.cart.id, this.chooseAddress.id, this.remarkList, this.checkData.cart.groups, this.geohash, this.checkData.sig)
        if (resOrders.need_validation) {
          this.NEED_VALIDATION(resOrders)
          this.$router.push('/confirmOrder/userValidation')
        } else {
          this.ORDER_SUCCESS(resOrders)
          this.$router.push('/confirmOrder/payment')
        }
      },
      showPayWayFunc() {
        this.showPayWay = true
      },
      closedPayWay() {
        this.showPayWay = false
      }
    },
    watch: {
      userInfo:function(value) {
        if (this.userInfo && this.userInfo.user_id) {
          this.initAddress()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .page {
    padding-bottom: px2rem(75);
  }
  .head-top {
    background-image: linear-gradient(90deg,#0af,#0085ff);
  }
  .title > span {
    vertical-align: middle;
  }
  .viewbody {
    padding: 0 px2rem(6);
    background-image: linear-gradient(0deg,#f5f5f5,#f5f5f5 65%,hsla(0,0%,96%,.3) 75%,hsla(0,0%,96%,0)),linear-gradient(270deg,#0085ff,#0af);
    .cart-container {
      padding:px2rem(12.5) 0;
      .address-item {
        padding: 0 px2rem(10);
        position: relative;
        .title {
          line-height: px2rem(22);
          .text {
            @include sc(px2rem(14), #fff);
            color: hsla(0,0%,100%,.8);
          }
          .tag {
            display: inline-block;
            line-height: px2rem(13);
            border: 1px solid #98c9fa;
            color: #fff;
            align-items: center;
            text-align: center;
            transform: scale(.8);
            padding: px2rem(2);
          }
        }
        .address-detail {
          @include fjc;
          line-height: px2rem(30);
          .text {
            flex-grow: 1;
            width: px2rem(100);
            @include sc(px2rem(20), #fff);
            font-weight: bold;
          }
          svg {
            margin-left: px2rem(5);
            @include wh(px2rem(10), px2rem(10));
            fill: #fff;
          }
        }
        .address-name {
          span {
            @include sc(px2rem(14), #fff);
            color: hsla(0,0%,100%,.8);
          }
        }
      }
    }
  }
  .checkout-section {
      background-color: #fff;
      margin-top: px2rem(7.5);
      padding: 0 px2rem(15);
    .deliver-box {
      @include fjc;
      padding: px2rem(16) 0;
      .deliver-left {
        @include sc(px2rem(14), $black);
        font-weight: 500;
      }
      .deliver-right {
        text-align: right;
        span {
          @include sc(px2rem(14), $blue);
          font-weight: 500;
        }
      }
    }
    .payway-box {
      @include fjc;
      padding: px2rem(16) 0;
      .payway-left {
        @include sc(px2rem(14), $black);
        font-weight: 500;
      }
      .payway-right {
        span {
          @include sc(px2rem(14), $blue);
          font-weight: 500;
        }
      }
    }
  }
  .foods-list-container {
    background-color: #fff;
    margin-top: px2rem(7.5);
    padding:0 px2rem(12.5);
    header {
      padding: px2rem(10) 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f4f4f4;
      .header-img {
        @include wh(px2rem(30), px2rem(30));
      }
      h2 {
        margin-left: px2rem(5);
        @include sc(px2rem(16), $black);
        font-weight: 500;
      }
    }
    .foods-list-ul {
      li {
        @include fjc;
        position: relative;
        &::before {
          @include border(bottom, #eee, 1)
        }
        padding:px2rem(10) 0;
        .foods-name {
          flex: 9;
          @include sc(px2rem(14), $black);
        }
        .foods-quantity {
          @include sc(px2rem(14), $black);
          width: px2rem(35);
          display: inline-block;
        }
        .foods-price {
          @include sc(px2rem(14), $orange);
          flex: 1;
          text-align: right;
        }
        .foods-group {
          @include sc(px2rem(14), $black);
        }
      }
    }
  }
  .order-box {
      border-top: 1px solid #f4f4f4;
      padding: px2rem(10) px2rem(12.5);
      background-color: #fff;
      .total-pay {
        @include fj;
        .desc {
          @include sc(px2rem(12), #bbb);
        }
        .total-price {
          text-align: right;
          strong {
            @include sc(px2rem(16), $black);
          }
        }
      }
    }
    .order-list-container{
      margin-top: px2rem(10);
      background-color: #fff;
      padding: 0 px2rem(12.5);
      .order-list {
        padding:px2rem(10) 0;
        @include fj;
        .left-txt {
          @include sc(px2rem(15), #666);
        }
        .right-txt {
          span {
            @include sc(px2rem(12), #999);
          }
          svg {
            @include wh(px2rem(10), px2rem(10));
            fill: #999;
          }
        }
      }
      .border-bottom {
        border-bottom: 1px solid #f4f4f4;
      }
    }
    .confirm-order {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      .left-txt {
        flex: 3;
        padding:px2rem(12.5);
        background-color: #3c3c3c;
        @include sc(px2rem(15), #fff);
      }
      .btn-confirm {
        flex: 1;
        padding:px2rem(12.5);
        background-color: #56d176;
        @include sc(px2rem(15), #fff);
        text-align: center;
      }
    }
    .payway-cover {
      background-color: rgba($color: #000000, $alpha: .2);
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 4;
    }
    .payway-container {
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #fff;
      z-index: 5;
      width: 100%;
      min-height: px2rem(200);
      header {
        background-color: #f4f4f4;
        text-align: center;
        padding:px2rem(10) 0;
      }
      .payway-list-ul {
        li {
          padding:px2rem(15);
          @include fj;
          span {
            @include sc(px2rem(15), #ccc);
          }
          svg {
            @include wh(px2rem(15), px2rem(15));
            fill: #ccc;
          }
        }
        .choosed {
          @include sc(px2rem(15), #000);
          span {
            @include sc(px2rem(15), #000);
          }
          svg {
            @include wh(px2rem(15), px2rem(15));
            fill: $green;
          }
        }
      }
    }
    .slide-right-enter-active, .slide-right-leave-active {
      transition: all .4s;
    }
    .slide-right-enter, .slide-right-leave-active {
      transform: translateX(px2rem(50));
      opacity: 0;
    }
    .fade-enter-active, .fade-enter-leave-active {
      transition: all .4s;
    }
    .fade-enter, .fade-enter-leave-active {
      opacity: 0;
    }
    .slide-up-enter-active, .slide-up-leave-active {
      transition: all .4s;
    }
    .slide-up-enter, .slide-up-leave-active {
      transform: translateY(px2rem(50));
      opacity: 0;
    }
</style>
