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
          <ul>
            <li class="menu-list" v-for="(item,index) in menuList" :key="index" @click="choosedMenu(index)" :class="{menu_activity:index == menuIndex}">
              <img :src="getImgPath(item.icon_url)" v-if="item.icon_url">
              {{item.name}}
              <span class="category-num" v-if="categoryNum[index]">{{categoryNum[index]}}</span>
            </li>
          </ul>
        </section>
        <section class="menu-content" ref="menuContent">
          <ul class="foods-list-ul">
            <li v-for="(item,index) in menuList" :key="index">
              <header class="foods-list-header">
                <h3>
                  {{item.name}}
                </h3>
                <span class="desc">{{item.description}}</span>
                <span class="ellipsis" @click="showDescDetail(index)">...</span>
                <div class="foods-list-tips" v-if="descIndex == index">{{item.name}}<span>{{item.description}}</span></div>
              </header>
              <section class="foods-list-content" v-for="(foods,subIndex) in item.foods" :key="subIndex">
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
                    <buy-cart :foods="foods" :shopId="shop_id" @showMoveDot="showMoveDotFunc" @showSpeciList="showSpeciListFunc" @showRemoveInfo='showRemoveInfo'></buy-cart>
                  </section>
                </div>
              </section>
            </li>
          </ul>
        </section>
        <section class="buycart-container">
          <section class="left-cart-num">
            <div class="cart-icon-box" :class="{activeCart:totalPrice > 0, animationCart:arriveCart}" ref="cart_icon_box">
              <svg class="cart_icon">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
              </svg>
              <span class="total-num" v-if="totalNum">{{totalNum}}</span>
            </div>
            <div class="pd-txt">
              <p>￥{{totalPrice}}</p>
              <p>配送费</p>
            </div>
          </section>
          <section class="gotopay">
            <span>还差￥20起送</span>
          </section>
        </section>
      </section>
      <section class="review-container" v-if="tabType == 'review'">
        2
      </section>
    </section>
    <section class="animation_opacity shop_back_svg_container" v-if="showloading">
      <img src="../../images/shop_back_svg.svg">
    </section>
    <transition appear @after-appear='afterEnter' @before-appear='beforeEnter' v-for="(item, index) in showMoveDot" :key="index">
      <span class="move-dot" v-if="item">
        <svg class="move-liner">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
        </svg>
      </span>
    </transition>
    <transition name="fade">
      <section v-if="showSpecs" class="bg-cover" @click="closedFoodsSpecs"></section>
    </transition>
    <transition name="fade">
      <section v-if="showSpecs" class="specs-container">
        <header>
          <h4>{{chooseFoods.name}}</h4>
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1" class="specs_cancel" @click="closedFoodsSpecs">
            <line x1="0" y1="0" x2="16" y2="16"  stroke="#666" stroke-width="1.2"/>
            <line x1="0" y1="16" x2="16" y2="0"  stroke="#666" stroke-width="1.2"/>
          </svg>
        </header>
        <section class="specs-content">
          <h5>{{chooseFoods.specfoods[0].name}}</h5>
          <ul class="specs-ul">
            <li v-for="(chooseItem, chooseIndex) in chooseFoods.specfoods" :key="chooseIndex" @click="selectedSpecsFoods(chooseIndex)" :class="{activeSpec:chooseIndex == itemIndex}">
              {{chooseItem.specs_name}}
            </li>
          </ul>
        </section>
        <footer class="specs-footer">
          <span class="price">￥{{chooseFoods.specfoods[itemIndex].price}}</span>
          <span class="add-cart" @click="addSpec(
            chooseFoods.category_id,
            chooseFoods.item_id,
            chooseFoods.specfoods[itemIndex].food_id,
            chooseFoods.specfoods[itemIndex].name,
            chooseFoods.specfoods[itemIndex].packing_fee,
            chooseFoods.specfoods[itemIndex].price,
            chooseFoods.specfoods[itemIndex].sku_id,
            chooseFoods.specifications[0].values[itemIndex],
            chooseFoods.specfoods[itemIndex].stock
          )">加入购物车</span>
        </footer>
      </section>
    </transition>
    <transition name="fade">
      <section v-if="show_remove_info" class="show-remove-info">
        多规格商品只能去购物车删除哦
      </section>
    </transition>
    <loading v-show="showloading"></loading>
  </div> 
</template>
<script>
  import {shopDetail,foodList} from '@/api/getData'
  import {getImgPath} from '@/components/mixins'
  import {mapState,mapMutations} from 'vuex'
  import loading from '@/components/loading'
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
        menuList: null,  //食品类别
        baseImgPath: 'http://cangdu.org:8001/img/',
        showMoveDot:[],
        elLeft:0,
        elBottom:0,
        foodsListTop: [], //食物分类高度集
        foodScroll:null,  //获取BScorll实例
        categoryNum:[],  //已加入购物车商品分类数量
        showSpecs:false, //显示选择规格窗口
        chooseFoods:null,   //选择规格食品
        itemIndex:0,    //规格默认索引
        show_remove_info: false, //规格删除提示
        totalPrice:0,   //购物车总价格
        arriveCart:false, //到达cart图标执行动画
        cartFoodsList: [],  //保存已选购物车列表
      }
    },
    components: {
      buyCart,
      loading
    },
    created () {
      this.shop_id = this.$route.query.id;
      this.geohash = this.$route.query.geohash;
      this.INIT_CART();
    },
    mounted () {
      this.initData();
    },
    mixins: [getImgPath],
    computed: {
      ...mapState([
        'cartList'
      ]),
      shopCart:function(){
        return {...this.cartList[this.shop_id]};
      },
      totalNum: function(){
        let num = 0;
        this.cartFoodsList.forEach(item => {
          num += parseInt(item.num);
        });
        return num;
      }
    },
    methods:{
      ...mapMutations([
        'INIT_CART','ADD_CART'
      ]),
      async initData(){
        this.shop_detail = await shopDetail(this.shop_id);
        this.menuList = await foodList(this.shop_id);
        this.showloading = false;
      },
      goback(){
        this.$router.go(-1);
      },
      showDescDetail(index){
        if(this.descIndex == index){
          this.descIndex = null;
        }else{
          this.descIndex = index;
        }
      },
      beforeEnter(el){
        //从终点位置设置到当前icon目标位置
        el.style.transform = `translate3d(0,${this.elBottom - window.innerHeight + 37}px,0)`;
        el.children[0].style.transform = `translate3d(${this.elLeft - 30}px,0,0)`;
        el.children[0].style.opacity = 0;
      },
      afterEnter(el){
        //返回到终点位置
        el.style.transform = `translate3d(0, 0, 0)`;
        el.children[0].style.transform = `translate3d(0, 0, 0)`;
        el.style.transition = `transform .55s cubic-bezier(.3,-.25,.7,-.1)`;
        el.children[0].style.transition = `transform .55s linear`;
        el.children[0].style.opacity = 1;
        this.showMoveDot = this.showMoveDot.map(item => false);
        el.children[0].addEventListener('transitionend',() => {
          this.arriveCart = true;
          this.$refs.cart_icon_box.addEventListener('animationend', () => {
            this.arriveCart = false
          })
        })
      },
      //获取移动图标，当前规格图标的相对值
      showMoveDotFunc(showMoveDot, elLeft, elBottom){
        this.showMoveDot = [...showMoveDot];
        this.elLeft = elLeft;
        this.elBottom = elBottom;
      },
      //每一个shopListTop高度
      getFoodListHeight(){
        const listContainer = this.$refs.menuContent;
        const listArr = Array.from(listContainer.children[0].children);
        listArr.forEach((item, index) => {
          this.foodsListTop[index] = item.offsetTop;
        })
        this.listenScroll(listContainer);
      },
      listenScroll(element){
       this.foodScroll = new BScroll((element),{
          probeType: 3,
          deceleration: 0.001,
          bounce:false,
          swipeTime:2000,
          click:true
        })
        const menuWrap = new BScroll(('#menuWrap'),{
          click:true
        })
        const wrapMenuHeight = this.$refs.menuWrap.clientHeight;
        this.foodScroll.on('scroll',(pos) => {
          if(!this.$refs.menuWrap){
            return
          }
          this.foodsListTop.forEach((item, index) => {
            if(Math.abs(Math.round(pos.y)) >= item){
              this.menuIndex = index;
              const menuList = this.$refs.menuWrap.querySelectorAll('.menu_activity');
              const el = menuList[0];
              menuWrap.scrollToElement(el, 800, 0, -(wrapMenuHeight/2 - 50));                          
            }
          })
        })
      },
      /**
       * 显示规格
       */
      showSpeciListFunc(foods){
        this.showSpecs = !this.showSpecs;
        if(foods){
          this.chooseFoods = foods;
        }
      },
      //关闭规格窗口
      closedFoodsSpecs(){
        this.showSpecs = false;
      },
      //选择规格
      selectedSpecsFoods(index){
        this.itemIndex = index;
      },
      addSpec(category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock){
        this.ADD_CART({shopId:this.shop_id, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock});
        this.showSpecs = false;
      },
      showRemoveInfo(){
        this.show_remove_info = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.show_remove_info = false;
        },3000)
      },
      choosedMenu(index){
        this.menuIndex = index;
        this.foodScroll.scrollTo(0,-this.foodsListTop[index],400);
      },
      /**
       * 初始化cartShop商品改变时，重新统计购物车数据。
       * categoryNum统计加入购物车分类数量，
       * totalPrice购物车总价格
       * cartNum购物车总商品数量
       */
      initCategoryNum(){
        let arrNum = [];
        let cartFoodNum = 0;
        this.totalPrice = 0;
        this.cartFoodsList = [];
        if(this.menuList){
          this.menuList.forEach((item,index) => {
            if(this.shopCart&&this.shopCart[item.foods[0].category_id]){
              let num = 0;
              Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemId => {
                Object.keys(this.shopCart[item.foods[0].category_id][itemId]).forEach(foodsId => {
                  let foodsItem = this.shopCart[item.foods[0].category_id][itemId][foodsId];
                  num += parseInt(foodsItem.num);
                  this.totalPrice += foodsItem.num * foodsItem.price;
                  if(foodsItem.num){
                    this.cartFoodsList[cartFoodNum] = {};
                    this.cartFoodsList[cartFoodNum].category_id = item.foods[0].category_id;
                    this.cartFoodsList[cartFoodNum].item_id = itemId;
                    this.cartFoodsList[cartFoodNum].num = foodsItem.num;
                    this.cartFoodsList[cartFoodNum].foods_id = foodsId;
                    this.cartFoodsList[cartFoodNum].name = foodsItem.name;
                    this.cartFoodsList[cartFoodNum].price = foodsItem.price;
                    this.cartFoodsList[cartFoodNum].specs = foodsItem.specs;
                    cartFoodNum++;
                  }
                })
              })
              arrNum[index] = num;
            }else{
              arrNum[index] = 0;
            }
          })
        }
        this.categoryNum = [...arrNum];
      }
    },
    watch:{
      showloading:function(value){
        if(!value){
          this.$nextTick(() => {
            this.getFoodListHeight();
            this.initCategoryNum();
          })
        }
      },
      shopCart:function(value){
        this.initCategoryNum();
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .page-container{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    position: absolute; 
    right: 0; 
    left: 0; 
    height: 100%;
    padding-top: 0rem;
  }
  .goback{
    position: absolute;
    top: .1rem;
    left: .1rem;
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
    flex: 1;
    overflow-y: hidden;
    position: relative;
    margin-top:0;
    .menu-wrap{
      width: 1.5rem;
      overflow-y: auto;
      .menu-list{
        @include sc(.26rem, #999);
        padding: .4rem .2rem;
        border-bottom: 1px solid #ededed;
        background-color: #f5f5f5;
        position: relative;
        img{
          @include wh(.2rem, .2rem)
        }
      }
      .menu_activity{
        background-color: #fff;
        color: #666;
      }
      .category-num{
        position: absolute;
        top: 2px;
        right: 2px;
        @include sc(.24rem, #fff);
        background-color: #ff461d;
        border-radius: .5rem;
        padding:.02rem;
        transform: scale(.9);
      }
    }
  }
  .menu-content{
    flex: 5;
    background-color: #fff;
    overflow-y: auto;
    .foods-list-ul{
      li{
        .foods-list-header{
          background-color: #f5f5f5;
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
  .bg-cover{
    background-color: rgba($color: #000000, $alpha: .5);
    position: fixed;
    @include wh(100%, 100%);
  }
  .move-dot{
    position: fixed;
    bottom:30px;
    left: 30px;
    svg{
      @include wh(.4rem, .4rem);
      fill: $blue;
    }
  }
  .specs-container{
    background-color: #fff;
    border-radius: .1rem;
    @include center;
    @include wh(5rem, 3rem);
    header{
      padding:.2rem;
      position: relative;
      text-align: center;
      .specs_cancel{
        position: absolute;
        top: .2rem;
        right: .2rem;
      }
    }
    .specs-content{
      padding:.2rem;
      h5{
        color: #666;
      }
      .specs-ul{
        display: flex;
        margin-top:.1rem;
        li{
          border:1px solid #ddd;
          display: inline-block;
          margin-right:.1rem;
          padding:.1rem .2rem;
          border-radius: .1rem;
          @include sc(.24rem, #666)
        }
        .activeSpec{
          border-color: $blue;
          color: $blue;
        }
      }
    }
    .specs-footer{
      background-color: #f9f9f9;
      margin-top:.2rem;
      padding:.2rem .2rem;
      @include fj;
      align-items: center;
      .price{
        @include sc(.3rem, $orange)
      }
      .add-cart{
        color: #fff;
        background-color: $blue;
        border-radius: .1rem;
        padding:.1rem .2rem;
      }
    }
  }
  .show-remove-info{
    background-color: rgba($color: #000000, $alpha: .7);
    padding:.1rem;
    border-radius: .1rem;
    @include center;
    @include sc(.3rem, #fff);
    width: 4.5rem;
    text-align: center;
  }
  .buycart-container{
    background-color: #333;
    position:fixed;
    bottom:0;
    left: 0;
    width: 100%;
    display: flex;
    .left-cart-num{
      position: relative;
      flex: 3;
      .cart-icon-box{
        border-radius: 50%;
        border:.08rem solid #444;
        background-color: #333;
        text-align: center;
        align-items: center;
        position: absolute;
        padding:.1rem;
        top: -.3rem;
        left: .2rem;
        .cart_icon{
          @include wh(.6rem, .5rem);
        }
        .total-num{
          background-color: red;
          @include sc(.24rem, #fff);
          position: absolute;
          top: -.1rem;
          right: -.1rem;
          border-radius: 50%;
          min-width: .3rem;
        }
      }
      .activeCart{
        background-color: $blue;
      }
      .pd-txt{
        margin-left: 1.5rem;
        p:nth-of-type(1){
          @include sc(.3rem, #ffffff);
          font-weight: bold;
        }
        p:nth-of-type(2){
          @include sc(.24rem, #ffffff);
        }
      }
    }
    .gotopay{
      background-color: #535356;
      padding:.2rem .1rem;
      color: #fff;
      span{
        font-weight: bold;
      }
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
  .fade-enter-active, .fade-leave-active{
    transition: all .4s;
  }
  .fade-enter, .fade-leave-active{
    opacity: 0;
  }
  .animationCart{
    animation: aniBound .5s ease-in-out;
  }
  @keyframes aniBound {
    0%{transform: scale(1);}
    20%{transform: scale(.8);}
    40%{transform: scale(1.1);}
    60%{transform: scale(.9);}
    100%{transform: scale(1);}
  }
</style>