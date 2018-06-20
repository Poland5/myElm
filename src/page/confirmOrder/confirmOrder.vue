<template>
  <div class="page">
    <section v-if="!showloading">
      <head-top goback="true" head-title="确认订单"></head-top>
      <router-link :to="{path:'/confirmOrder/chooseAddress',query:{id:checkData.cart.id, sig:checkData.sig}}" class="address-container">
        <div class="address-left">
          <svg class="location_icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
          </svg>
          <div class="info">
            <p>
              <span class="name">{{chooseAddress.name}}</span>
              <span>{{chooseAddress.sex == 1 ? '先生' : '女士'}}</span>
              <span>{{chooseAddress.phone}}</span>
            </p>
            <p>
              <span class="tag" :style="{backgroundColor:iconColor(chooseAddress.tag)}">{{chooseAddress.tag}}</span>
              <span>{{chooseAddress.address_detail}}</span>
            </p>
          </div>
        </div>
        <svg class="address-right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </router-link>
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
          <li>
            <span class="payWay-text">支付方式</span>
            <div class="right-side" @click="showPayWayFunc">
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
      <section class="foods-list-container">
        <header>
          <img class="header-img" :src="baseImgPath + checkData.cart.restaurant_info.image_path">
          <h2>{{checkData.cart.restaurant_info.name}}</h2>
        </header>
        <ul class="foods-list-ul">
          <li v-for="(item,index) in checkData.cart.groups[0]" :key="index">
            <div class="foods-left ellipsis">{{item.name}}</div>
            <div class="foods-right">
              <span class="quantity">x{{item.quantity}}</span>
              <span>￥{{item.price}}</span>
            </div>
          </li>
          <li>
            <div class="foods-left">
              {{checkData.cart.extra[0].name}}
            </div>
            <div class="foods-right">
              <span>￥{{checkData.cart.extra[0].price}}</span>
            </div>
          </li>
          <li>
            <div class="foods-left">
              配送费
            </div>
            <div class="foods-right">
              <span>￥{{checkData.cart.deliver_amount}}</span>
            </div>
          </li>
        </ul>
      </section>
      <section class="order-box">
        <div class="total-pay">
          <span>订单￥{{checkData.cart.total}}</span>
          <span>待支付￥{{checkData.cart.total}}</span>
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
        <span class="left-txt">待付款￥{{checkData.cart.total}}</span>
        <span class="btn-confirm" @click="confirmOrder">确定下单</span>
      </section>
    </section>
    <transition name="fade">
      <section class="payway-cover" v-if="showPayWay" @click="closedPayWay"></section>
    </transition>
    <transition name="slide-up">
      <section class="payway-container" v-if="showPayWay">
        <header>支付方式</header>
        <ul class="payway-list-ul">
          <li v-for="(item, index) in checkData.payments" :key="index" :class="{choosed:item.select_state == 1}">
            <span>{{item.name}}{{item.disabled_reason}}</span>
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
  import { mapState, mapMutations } from 'vuex';
  import { getAddressList, checkout, postOrders} from '@/api/getData'
  import loading from '@/components/loading'
  export default {
    data () {
      return {
        shop_id: null,
        geohash: null,
        shopCart: null,
        showloading: true,
        checkData: {},
        baseImgPath:'http://cangdu.org:8001/img/',
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
        'userInfo', 'chooseAddress', 'cartList', 'inputText', 'remarkText', 'invoice',
      ]),
      remarkList:function(){
        let str = new String();
        if(this.remarkText){
          Object.values(this.remarkText).forEach(item => {
            str += item[1] + ',';
          })
        }
        if(this.inputText){
            str += this.inputText;
        }else{
            str = str.substr(0, str.lastIndexOf(','));
        }
        return str
      },
      invoiceData:function(){
            if(this.invoice){
                return '需要开发票'
            }else{
                return '不需要开发票'
            }
        }
    },
    created () {
        this.geohash = this.$route.query.geohash;
        this.shop_id = this.$route.query.shop_id;
        this.INIT_CART();
        this.SAVE_SHOPID(this.shop_id);
        this.shopCart = this.cartList[this.shop_id];
    },
    mounted () {
        if(this.geohash){
            this.initData();
        }
    },
    methods: {
        ...mapMutations([
            'CHOOSE_ADDRESS','INIT_CART' ,'SAVE_SHOPID', 'ORDER_SUCCESS'
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
                const addressRes = await getAddressList(this.userInfo.user_id);
                if(addressRes.length && addressRes instanceof Array){
                    this.CHOOSE_ADDRESS({address:addressRes[0], index:0});
                }
            }
        },
        iconColor(value){
            switch(value){
                case '学校' : return '#3190e8';
                case '公司' : return '#4cd964';
            }
        },
      async confirmOrder(){
        if(!(this.userInfo && this.userInfo.user_id)){
          this.alertTxt = '请登录';
          this.showAlert = true;
        }else if(!(this.chooseAddress)){
          this.alertTxt = '选择地址';
          this.showAlert = true;
        }
        //下单
        let resOrders = await postOrders(this.userInfo.user_id, this.checkData.cart.id, this.chooseAddress.id, this.remarkList, this.checkData.cart.groups, this.geohash, this.checkData.sig);
        if(resOrders.need_validation){
          this.NEED_VALIDATION(resOrders);
          this.$router.push('/confirmOrder/userValidation');
        }else{
          this.ORDER_SUCCESS(resOrders);
          this.$router.push('/confirmOrder/payment');
        }
      },
      showPayWayFunc(){
        this.showPayWay = true;
      },
      closedPayWay(){
        this.showPayWay = false;
      }
    },
    watch: {
      userInfo:function(value){
        if(this.userInfo && this.userInfo.user_id){
          this.initAddress();
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .page{
    padding-bottom: 1.5rem;
  }
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
  .foods-list-container{
    background-color: #fff;
    margin-top: .15rem;
    header{
      padding:.25rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f4f4f4;
      .header-img{
        @include wh(.6rem, .6rem);
      }
      h2{
        margin-left: .1rem;
        @include sc(.32rem, #666)
      }
    }
    .foods-list-ul{
      padding:.1rem .25rem;
      li{
        @include fj;
        padding:.15rem 0;
        .foods-left{
          width: 4rem;
          @include sc(.28rem, #666);
        }
        .foods-right{
          span{
            @include sc(.24rem, #666);
          }
          .quantity{
            @include sc(.24rem, $orange);
            width: .7rem;
            display: inline-block;
          }
        }
      }
    }
  }
  .order-box{
      border-top: 1px solid #f4f4f4;
      padding:.2rem .25rem;
      background-color: #fff;
      .total-pay{
        @include fj;
        span:nth-of-type(1){
          @include sc(.3rem, #666);
        }
        span:nth-of-type(2){
          width: 2rem;
          text-align: right;
          line-height: .5rem;
          @include sc(.3rem, $orange);
        }
      }
    }
    .order-list-container{
      margin-top: .2rem;
      background-color: #fff;
      padding:0 .25rem;
      .order-list{
        padding:.2rem 0;
        @include fj;
        .left-txt{
          @include sc(.3rem, #666);
        }
        .right-txt{
          span{
            @include sc(.24rem, #999);
          }
          svg{
            @include wh(.2rem, .2rem);
            fill: #999;
          }
        }
      }
      .border-bottom{
        border-bottom: 1px solid #f4f4f4;
      }
    }
    .confirm-order{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      .left-txt{
        flex: 3;
        padding:.25rem;
        background-color: #3c3c3c;
        @include sc(.3rem, #fff);
      }
      .btn-confirm{
        flex: 1;
        padding:.25rem;
        background-color: #56d176;
        @include sc(.3rem, #fff);
        text-align: center;
      }
    }
    .payway-cover{
      background-color: rgba($color: #000000, $alpha: .2);
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 4;
    }
    .payway-container{
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #fff;
      z-index: 5;
      width: 100%;
      min-height: 4rem;
      header{
        background-color: #f4f4f4;
        text-align: center;
        padding:.2rem 0;
      }
      .payway-list-ul{
        li{
          padding:.3rem;
          @include fj;
          span{
            @include sc(.3rem, #ccc);
          }
          svg{
            @include wh(.3rem, .3rem);
            fill: #ccc;
          }
        }
        .choosed{
          @include sc(.3rem, #000);
          span{
            @include sc(.3rem, #000);
          }
          svg{
            @include wh(.3rem, .3rem);
            fill: $green;
          }
        }
      }
    }
    .slide-right-enter-active, .slide-right-leave-active{
      transition: all .4s;
    }
    .slide-right-enter, .slide-right-leave-active{
      transform: translateX(1rem);
      opacity: 0;
    }
    .fade-enter-active, .fade-enter-leave-active{
      transition: all .4s;
    }
    .fade-enter, .fade-enter-leave-active{
      opacity: 0;
    }
    .slide-up-enter-active, .slide-up-leave-active{
      transition: all .4s;
    }
    .slide-up-enter, .slide-up-leave-active{
      transform: translateY(1rem);
      opacity: 0;
    }
</style>