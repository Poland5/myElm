<template>
  <div>
    <section class="page-container" v-if="!showloading">
      <nav class="goback">
        <svg width="4rem" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" @click="goback">
          <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:3"/>
        </svg>
      </nav>
      <header class="shop-header" v-if="shop_detail">
        <img :src="baseImgPath + shop_detail.image_path" class="img_bg">
        <section class="desc-cover">
          <router-link to="/shop/shopDetail" class="desc-container">
            <img :src="baseImgPath + shop_detail.image_path">
            <div class="desc">
              <p class="title">{{shop_detail.name}}</p>
              <p class="txt"><span>商家配送/分钟送达/{{shop_detail.piecewise_agent_fee.tips}}</span></p>
              <p class="notice ellipsis" v-if="shop_detail.promotion_info">公告:{{shop_detail.promotion_info}}</p>
            </div>
            <svg class="footer_arrow">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use>
            </svg>
          </router-link>
        </section>
      </header>
      <section class="tab-container">
        <div @click="tabType = 'shop'"><span :class="{selected:tabType == 'shop'}">商品</span></div>
        <div @click="tabType = 'review'"><span :class="{selected:tabType == 'review'}">评价</span></div>
      </section>
      <section class="shop-container" v-if="tabType == 'shop'">
        <section class="menu-wrap" id="menuWrap" ref="menuWrap">
          <div class="menu-list" v-for="(item,index) in foodCategory_list" :key="index" @click="choosedMenu(index)" :class="{menu_activity:index == menuIndex}">
            <img :src="getImgPath(item.icon_url)" v-if="item.icon_url">
            {{item.name}}
          </div>
        </section>
        <section class="menu-content">
          <ul class="foods-list-ul">
            <li v-for="(item,index) in foodCategory_list" :key="index">
              <header class="foods-list-header">
                <h3>
                  {{item.name}}
                </h3>
                <span class="desc">{{item.description}}</span>
                <span class="ellipsis" @click="showDescDetail(index)">...</span>
                <div class="foods-list-tips" v-if="descIndex == index">{{item.name}}<span>{{item.description}}</span></div>
              </header>
              <div class="foods-list-content" v-for="(foods,subIndex) in item.foods" :key="subIndex">
                <img :src="baseImgPath + foods.image_path">
                <div class="foods-list-desc">
                  <h4>
                    {{foods.name}}
                    <ul v-if="foods.attributes" class="foods-attr-ul">
                      <li v-for="(attrItem,attrIndex) in foods.attributes" :key="attrIndex" :style="{color:attrItem.icon_name == '新'?'#5ec452':'#f07373',borderColor:attrItem.icon_name == '新'?'#5ec452':'#f07373'}">
                        {{attrItem.icon_name}}
                      </li>
                    </ul>
                  </h4>
                  <p>{{foods.description}}</p>
                  <p>{{foods.tips}}</p>
                  <p v-if="foods.activity" :style="{color:'#' + foods.activity.image_text_color, borderColor:'#' + foods.activity.image_text_color}">{{foods.activity.image_text}}</p>
                  <section class="foods-specs">
                    <div class="txt">
                      ￥
                      <span class="price">{{foods.specfoods[0].price}}</span>
                      <span v-if="foods.specifications.length">起</span>
                    </div>
                    <buy-cart :foods="foods" :shopId="shop_id"></buy-cart>
                  </section>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </section>
      <section class="review-container" v-if="tabType == 'review'">
        2
      </section>
    </section>
    <section class="animation_opacity shop_back_svg_container" v-if="showloading">
      <img src="../../images/shop_back_svg.svg">
    </section>
  </div> 
</template>
<script>
  import {shopDetail,foodList} from '@/api/getData'
  import {getImgPath} from '@/components/mixins'
  import buyCart from '@/components/buyCart'
  import BScroll from 'better-scroll'
  export default {
    data () {
      return {
        showloading: true, 
        tabType:'shop', 
        descIndex: null, //点击显示详细列表头信息
        shop_id:null, //商铺ID
        shop_detail:null, //商铺详情
        menuIndex: 0, //默认选择Menu
        foodCategory_list: null,  //食品类别
        baseImgPath: 'http://cangdu.org:8001/img/',
      }
    },
    components: {
      buyCart
    },
    mounted () {
      this.shop_id = this.$route.query.id;
      this.initData();
    },
    mixins: [getImgPath],
    methods:{
      async initData(){
        this.shop_detail = await shopDetail(this.shop_id);
        this.foodCategory_list = await foodList(this.shop_id);
        this.showloading = false;
      },
      goback(){
        this.$router.go(-1);
      },
      choosedMenu(index){
        this.menuIndex = index;
      },
      showDescDetail(index){
        if(this.descIndex == index){
          this.descIndex = null;
        }else{
          this.descIndex = index;
        }
      }
    },
    watch:{
      showloading:function(value){

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .goback{
    position: absolute;
    top: .1rem;
    left: .1rem;
    width: 100%;
    height: .5rem;
    z-index: 99;
  }
  .shop-header{
    overflow: hidden;
    height: 1.6rem;
    position: relative;
    .img_bg{
      position:absolute;
      width:100%;
      filter:blur(10px);
    }
    .desc-cover{
      background-color: rgba(119, 103, 137, .4);
      width: 100%;
      position:absolute;
      top: 0;
      left:0;
      display: block;
      overflow: hidden;
      .desc-container{
        padding:.2rem;
        display: flex;
        img{
          @include wh(1.2rem, 1.2rem)
        }
        .desc{
          margin-left:.1rem;
          .title{
            font-weight: bold;
            @include sc(.3rem, #fff);
          }
          .txt{
            margin-bottom: .1rem;
            span{
              @include sc(.24rem, #fff);
            }
          }
          .notice{
            @include sc(.24rem, #fff);
            width: 4.2rem;
          }

        }
        .footer_arrow{
          @include wh(.3rem, .3rem);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: .1rem;
        }
      }
    }
  }
  .tab-container{
    display: flex;
    border-bottom:1px solid #f1f1f1;
    background-color: #fff;
    div{
      flex: 1;
      @include sc(.3rem, #666);
      text-align: center;
      padding:.2rem 0;
      .selected{
        color: $blue;
        border-bottom: 2px solid $blue;
      }
    }
  }
  .shop-container{
    display: flex;
    position:relative;
    .menu-wrap{
      width: 1.5rem;
      .menu-list{
        @include sc(.26rem, #999);
        padding: .4rem .2rem;
        border-bottom: 1px solid #eee;
        background-color: #f1f1f1;
        img{
          @include wh(.2rem, .2rem)
        }
      }
      .menu_activity{
        background-color: #fff;
        color: #666;
      }
    }
    .menu-content{
      flex: 5;
      background-color: #fff;
    }
  }
  .menu-content{
    overflow-y: auto;
    .foods-list-ul{
      li{
        .foods-list-header{
          background-color: #f1f1f1;
          padding:.2rem;
          position: relative;
          display: flex;
          align-items: center;
          .foods-list-tips{
            background-color: #39373a;
            @include sc(.24rem, #fff);
            position: absolute;
            right: .1rem;
            top: .6rem;
            width: 3rem;
            padding:.2rem .1rem;
            border-radius: .1rem;
            span{
              margin-left: .1rem;
              @include sc(.24rem, #fff);
            }
          }
          .foods-list-tips::after{
            content:'';
            @include wh(.2rem, .2rem);
            background-color: #39373a;
            position: absolute;
            right: .1rem;
            top: -.08rem;
            transform: rotate(45deg);
          }
          h3{
            @include sc(.28rem, #666);
            font-weight: bold;
          }
          .desc{
            @include sc(.24rem, #999);
            margin-left: .1rem;
          }
          .ellipsis{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: .2rem;
            @include sc(.3rem, #999);
            margin-top:-.1rem;
          }
        }
        .foods-list-content{
          background-color: #fff;
          border-bottom: 1px solid #f1f1f1;
          padding:.2rem;
          display: flex;
          img{
            @include wh(.8rem, .8rem)
          }
          .foods-list-desc{
            margin-left:.15rem;
            width: 100%;
            h4{
              @include sc(.28rem, #666);
              font-weight: bold;
              margin-bottom: .05rem;
              @include fj;
              .foods-attr-ul{
                display: flex;
                li{
                  font-size: .24rem;
                  border:1px solid #666;
                  border-radius: .1rem;
                  margin-left: .05rem;
                  margin-right:-.1rem;
                  padding:0 .05rem;
                  transform: scale(.8);
                }
              }
            }
            p:nth-of-type(1){
              @include sc(.24rem, #999);
              margin-bottom: .05rem;
            }
            p:nth-of-type(2){
              @include sc(.24rem, #666);
            }
            p:nth-of-type(3){
              @include sc(.20rem, #666);
              margin-bottom: .05rem;
              display: inline-block;
              border:1px solid #666;
              border-radius: .3rem;
              transform: scale(.8);
              margin-left:-.1rem;
            }
            .foods-specs{
              @include fj;
              .txt{
                .price{
                  font-weight: bold;
                }
                @include sc(.26rem, $orange);
              }
            }
          }
        }
      }
    }
  }
  .shop_back_svg_container{
    position: fixed;
    @include wh(100%, 100%);
    img{
        @include wh(100%, 100%);
    }
  }
  .animation_opacity{
    animation:backOpacity 2s ease-in-out infinite;
  }
  @keyframes backOpacity{
    0%{opacity: 1;}
    25%{opacity: .5;}
    50%{opacity: .1;}
    75%{opacity: .5;}
    100%{opacity: .1;}
  }
</style>