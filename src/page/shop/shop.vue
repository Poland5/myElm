<template>
  <div>
    <section class="page-container" v-if="!showloading">
      <nav class="goback">
        <svg width="4rem" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" @click="goback">
          <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:3"/>
        </svg>
      </nav>
      <!-- 顶部信息 -->
      <header class="shop-header" v-if="shop_detail">
        <img :src="baseImgPath + shop_detail.image_path" class="img_bg">
        <section class="desc-cover">
          <router-link to="/shop/shopDetail" class="desc-container">
            <img :src="baseImgPath + shop_detail.image_path">
            <div class="desc">
              <p class="title">{{shop_detail.name}}</p>
              <p class="txt"><span>商家配送/{{shop_detail.order_lead_time}}分钟送达/配送费￥{{shop_detail.float_delivery_fee}}</span></p>
              <p class="notice ellipsis">公告:{{promotionInfo}}</p>
            </div>
            <svg class="footer_arrow">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use>
            </svg>
          </router-link>
        </section>
      </header>
      <!-- 导航 -->
      <section class="tab-container">
        <div @click="tabType = 'shop'"><span :class="{selected:tabType == 'shop'}">商品</span></div>
        <div @click="tabType = 'review'"><span :class="{selected:tabType == 'review'}">评价</span></div>
      </section>
      <!-- 商店 -->
      <transition name="fade">
        <section class="shop-container" v-show="tabType == 'shop'">
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
                <div class="foods-box" v-for="(foods,subIndex) in item.foods" :key="subIndex">
                  <router-link :to="{path:'/shop/foodsDetail',query:{
                    name: foods.name,
                    image_path: foods.image_path,
                    description: foods.description,
                    mouth_sales: foods.mouth_sales,
                    price: foods.specfoods[0].price,
                    rating: foods.rating,
                    rating_count: foods.rating_count,
                    satisfy_rate: foods.satisfy_rate}}" class="foods-list-content" >
                    <img :src="baseImgPath + foods.image_path">
                    <div class="foods-list-desc">
                      <h4>
                        {{foods.name}}
                        <!-- <ul v-if="foods.attributes" class="foods-attr-ul">
                          <li v-for="(attrItem,attrIndex) in foods.attributes" :key="attrIndex" :style="{color:attrItem.icon_name == '新'?'#5ec452':'#f07373',borderColor:attrItem.icon_name == '新'?'#5ec452':'#f07373'}">
                            {{attrItem.icon_name}}
                          </li>
                        </ul> -->
                      </h4>
                      <p>{{foods.description}}</p>
                      <p>{{foods.tips}}</p>
                      <p v-if="foods.activity" :style="{color:'#' + foods.activity.image_text_color, borderColor:'#' + foods.activity.image_text_color}">{{foods.activity.image_text}}</p>
                    </div>
                  </router-link>
                  <section class="foods-specs">
                    <div class="txt">
                      ￥
                      <span class="price">{{foods.specfoods[0].price}}</span>
                      <span v-if="foods.specifications.length">起</span>
                    </div>
                    <buy-cart :foods="foods" :shopId="shop_id" @showMoveDot="showMoveDotFunc" @showSpeciList="showSpeciListFunc" @showRemoveInfo='showRemoveInfo'></buy-cart>
                  </section>
                </div>
              </li>
            </ul>
          </section>
          <section class="food-container">
            <section class="buycart-container">
              <section class="left-cart-num" @click="taggleCartList">
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
              <section class="gotopay" :class="{actived_gotopay:miniOrderAmount <= 0}">
                <span v-if="miniOrderAmount > 0">还差￥20起送</span>
                <router-link :to="{path:'/confirmOrder',query:{geohash,shop_id}}" v-else>去结算</router-link>
              </section>
            </section>
            <transition name="slideUp">
              <section class="cart-list-container" v-if="cartFoodsList.length&&showCartList">
                <header>
                  <h4>购物车</h4>
                  <div class="cart-list-clear" @click="clearFoodsList">
                    <svg>
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
                    </svg>
                    <span>清空</span>
                  </div>
                </header>
                <ul class="cart-list-ul">
                  <li v-for="(item,index) in cartFoodsList" :key="index">
                    <div class="name">{{item.name}}</div>
                    <div class="price">￥{{item.price}}</div>
                    <section class="control-side">
                      <span @click="reduceCart(item.category_id,item.item_id, item.food_id, item.name, item.packing_fee, item.price, item.specs)">
                        <svg>
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                        </svg>
                      </span>
                      <span class="num">{{item.num}}</span>
                      <span @click="addCart(item.category_id,item.item_id, item.food_id, item.name, item.packing_fee, item.price, item.specs)">
                        <svg>
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                        </svg>
                      </span>
                    </section>
                  </li>
                </ul>
              </section>
            </transition>
          </section>
        </section>
      </transition>
      <!-- 评价 -->
      <!-- <transition name="fade">
        <section class="review-container" v-show="tabType == 'review'" ref="reviewContainer">
          <section>
            <section class="rating-box" v-if="scores">
              <div class="rating-left-side">
                <p>{{scores.overall_score.toFixed(1)}}</p>
                <p>综合评价</p>
                <p>高于周边商家{{(scores.compare_rating * 100).toFixed(1)}}%</p>
              </div>
              <div class="rating-right-side">
                <p>
                  <span class="txt">服务态度</span>
                  <ratingStar rating="scores.service_score.toFixed(1)"></ratingStar>
                  <span class="orange">{{scores.service_score.toFixed(1)}}</span>
                </p>
                <p>
                  <span class="txt">菜品评价</span>
                  <ratingStar rating="scores.food_score.toFixed(1)"></ratingStar>
                  <span class="orange">{{scores.food_score.toFixed(1)}}</span>
                </p>
                <p>
                  <span class="txt">送达时间</span>
                  <span class="minute">{{scores.deliver_time}}分钟</span>
                </p>
              </div>
            </section>
            <section class="ratingTags-section">
              <ul class="ratingTags-ul">
                <li v-for="(item, index) in ratingTags" :key="index" @click="selectedTags(index, item.name)" :class="{activity_Tags:index == tagsIndex, unsatisfied:item.unsatisfied}">
                  {{item.name}}
                </li>
              </ul>
            </section>
            <ul class="rating-list-ul">
              <li class="rating-list-li" v-for="(infoItem, infoIndex) in ratingInfo" :key="infoIndex">
                <img :src="getImgPath(infoItem.avatar)" class="rating-avatar">
                <div class="rating-content">
                  <header>
                    <h4>{{infoItem.username}}</h4>
                    <span class="rating-date">{{infoItem.rated_at}}</span>
                  </header>
                  <p class="rating-desc">
                    <rating-star :rating="infoItem.rating_star"></rating-star>
                    <span>{{infoItem.time_spent_desc}}</span>
                  </p>
                  <ul class="food-img-ul">
                    <li v-for="(subItem, subIndex) in infoItem.item_ratings" :key="subIndex">
                      <img :src="getImgPath(subItem.image_hash)">
                    </li>
                  </ul>
                  <ul class="food-name-ul">
                    <li class="ellipsis" v-for="(subItem, subIndex) in infoItem.item_ratings" :key="subIndex">
                      <span class="food-name">{{subItem.food_name}}</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </section>
        </section>
      </transition> -->
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
      <section v-if="cartFoodsList.length&&showCartList" class="bg-cover" @click="taggleCartList"></section>
    </transition>
    <transition name="fade">
      <section v-if="show_remove_info" class="show-remove-info">
        多规格商品只能去购物车删除哦
      </section>
    </transition>
    <loading v-show="showloading || showRating"></loading>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import { shopDetail, foodList, getScores, getRatingTags, getRatingInfo } from '@/api/getData'
  import { getImgPath, loadMore } from '@/components/mixins'
  import { mapState, mapMutations } from 'vuex'
  import loading from '@/components/loading'
  import buyCart from '@/components/buyCart'
  import ratingStar from '@/components/ratingStar'
  import BScroll from 'better-scroll'
  export default {
    data () {
      return {
        showloading: true, // 显示加载动画
        tabType:'shop', // 切换显示商品/评价
        descIndex: null, // 点击显示详细列表头信息
        shop_id: null, // 商铺ID
        shop_detail: null, // 商铺详情
        menuIndex: 0, // 默认选择Menu
        menuIndexChange: true, // 解决选中index时，scroll监听事件重复判断设置index的bug
        menuList: [], // 食品类别
        baseImgPath: 'http://cangdu.org:8001/img/',
        showMoveDot: [],
        elLeft: 0,
        elBottom: 0,
        foodsListTop: [], // 食物分类高度集合
        foodScroll: null, // 获取BScorll实例
        categoryNum: [], // 已加入购物车商品分类数量
        showSpecs: false, // 显示选择规格窗口
        chooseFoods: null, // 选择规格食品
        itemIndex: 0,    // 规格默认索引
        show_remove_info: false, // 规格删除提示
        totalPrice: 0,   // 购物车总价格
        arriveCart: false, // 到达cart图标执行动画
        cartFoodsList: [],  // 保存已选购物车列表
        showCartList: false, // 显示购物车列表
        scores: null,  // 获取评价分数
        ratingTags: null,  // 获取评价分类
        tagsIndex: null, // 选择评价分类
        ratingInfo: null,  // 获取评论信息
        ratingOffset: 0,  // 跳转条数
        prevantReapterRequest: false, // 防止重复请求
        showRating: false, // 加载更多评论
      }
    },
    components: {
      buyCart,
      loading,
      ratingStar
    },
    created () {
      this.shop_id = this.$route.query.id
      this.geohash = this.$route.query.geohash
      this.INIT_CART()
    },
    mounted () {
      this.initData()
    },
    mixins: [ getImgPath, loadMore ],
    computed: {
      ...mapState([
        'cartList','userInfo'
      ]),
      shopCart: function() {
        return {...this.cartList[this.shop_id]}
      },
      promotionInfo: function() {
        return this.shop_detail.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'
      },
      totalNum: function() {
        let num = 0
        this.cartFoodsList.forEach(item => {
          num += parseInt(item.num)
        })
        return num
      },
      miniOrderAmount: function() {
        if (this.shop_detail) {
          return this.shop_detail.float_minimum_order_amount - this.totalPrice
        } else {
          return null
        }
      }
    },
    methods:{
      ...mapMutations([
        'INIT_CART','ADD_CART','CLEAR_CART','REDUCE_CART','RECODE_SHOPDETAIL'
      ]),
      async initData(){
        this.shop_detail = await shopDetail(this.shop_id)
        this.menuList = await foodList(this.shop_id)
        this.showloading = false
        this.RECODE_SHOPDETAIL(this.shop_detail)
        this.scores = await getScores(this.shop_id)
        this.ratingTags = await getRatingTags(this.shop_id)
        this.ratingInfo = await getRatingInfo(this.shop_id)
      },
      goback(){
        this.$router.go(-1)
      },
      showDescDetail(index) {
        if(this.descIndex == index){
          this.descIndex = null
        }else{
          this.descIndex = index
        }
      },
      beforeEnter(el) {
        //从终点位置设置到当前icon目标位置
        el.style.transform = `translate3d(0,${this.elBottom - window.innerHeight + 37}px,0)`;
        el.children[0].style.transform = `translate3d(${this.elLeft - 30}px,0,0)`;
        el.children[0].style.opacity = 0;
      },
      afterEnter(el) {
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
      // 获取移动图标，当前规格图标的相对值
      showMoveDotFunc(showMoveDot, elLeft, elBottom) {
        this.showMoveDot = [...showMoveDot]
        this.elLeft = elLeft
        this.elBottom = elBottom
      },
      // 获得listContainer容器和每个li离顶部高度
      getFoodListHeight() {
        const listContainer = this.$refs.menuContent
        const listArr = Array.from(listContainer.children[0].children)
        listArr.forEach((item, index) => {
          this.foodsListTop[index] = item.offsetTop
        })
        this.listenScroll(listContainer)
      },
      // 滚动监听
      listenScroll(element) {
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
        const wrapMenuHeight = this.$refs.menuWrap.clientHeight
        this.foodScroll.on('scroll',(pos) => {
          if (!this.$refs.menuWrap) {
            return
          }
          this.foodsListTop.forEach((item, index) => {
            if (Math.abs(Math.round(pos.y)) >= item) {
              this.menuIndex = index
              const menuList = this.$refs.menuWrap.querySelectorAll('.menu_activity')
              const el = menuList[0]
              // 右侧内容滚动时，左侧菜单能同步到对应
              menuWrap.scrollToElement(el, 800, 0, true)
            }
          })
        })
      },
      showSpeciListFunc(foods) {
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
        this.ADD_CART({shopId:this.shop_id, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock})
        this.showSpecs = false
      },
      showRemoveInfo(){
        this.show_remove_info = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          clearTimeout(this.timer)
          this.show_remove_info = false
        },3000)
      },
      // 点击左侧菜单，右侧内容响应滚动到顶部
      choosedMenu(index) {
        this.menuIndex = index
        // 防止滚动事件重复触发
        this.menuIndexChange = false
        this.foodScroll.scrollTo(0, -this.foodsListTop[index], 400)
        this.foodScroll.on('scrollEnd', () => {
          this.menuIndexChange = true
        })
      },
      taggleCartList() {
        this.cartFoodsList.length ? this.showCartList = !this.showCartList : true
      },
      reduceCart(category_id, item_id, food_id, name, packing_fee, price, specs) {
        this.REDUCE_CART({shopId:this.shop_id, category_id, item_id, food_id, name, packing_fee, price, specs})
      },
      addCart(category_id, item_id, food_id, name, packing_fee, price, specs){
        this.ADD_CART({shopId:this.shop_id, category_id, item_id, food_id, name, packing_fee, price, specs})
      },
      clearFoodsList() {
        this.showCartList = false
        this.CLEAR_CART(this.shop_id)
      },
      async selectedTags(index, name) {
        this.tagsIndex = index
        let res = await getRatingInfo(this.shop_id, this.ratingOffset, name)
        this.ratingInfo = [...res]
      },
      /**
       * 初始化cartShop商品改变时，重新统计购物车数据。
       * categoryNum统计加入购物车分类数量，
       * totalPrice购物车总价格
       * cartNum购物车总商品数量
       */
      initCategoryNum(){
        let arrNum = []
        let cartFoodNum = 0
        this.totalPrice = 0
        this.cartFoodsList = []
        this.menuList.forEach((item,index) => {
          if (this.shopCart&&this.shopCart[item.foods[0].category_id]) {
            let num = 0
            Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemId => {
              Object.keys(this.shopCart[item.foods[0].category_id][itemId]).forEach(foodsId => {
                let foodsItem = this.shopCart[item.foods[0].category_id][itemId][foodsId]
                num += parseInt(foodsItem.num)
                this.totalPrice += foodsItem.num * foodsItem.price
                if(foodsItem.num){
                  this.cartFoodsList[cartFoodNum] = {}
                  this.cartFoodsList[cartFoodNum].category_id = item.foods[0].category_id
                  this.cartFoodsList[cartFoodNum].item_id = itemId
                  this.cartFoodsList[cartFoodNum].num = foodsItem.num
                  this.cartFoodsList[cartFoodNum].food_id = foodsId
                  this.cartFoodsList[cartFoodNum].name = foodsItem.name
                  this.cartFoodsList[cartFoodNum].price = foodsItem.price
                  this.cartFoodsList[cartFoodNum].specs = foodsItem.specs
                  cartFoodNum++
                }
              })
            })
            arrNum[index] = num
          } else {
            arrNum[index] = 0
          }
        })
        this.categoryNum = [...arrNum]
      },
      async loadMoreReview() {
        if(this.prevantReapterRequest){
          return
        }
        this.prevantReapterRequest = true
        this.showRating = true
        this.ratingOffset += 10
        let data = await getRatingInfo(this.shop_id, this.ratingOffset)
        this.ratingInfo = [...this.ratingInfo, ...data]
        this.showRating = false
        if(data.length >= 10){
          this.prevantReapterRequest = false
        }
      }
    },
    watch:{
      showloading:function(value) {
        if (!value) {
          this.$nextTick(() => {
            this.getFoodListHeight()
            this.initCategoryNum()
          })
        }
      },
      shopCart:function(value) {
        this.initCategoryNum()
      },
      tabType:function(value) {
        if (value === 'review') {
          this.$nextTick(() => {
            this.reviewScroll = new BScroll(this.$refs.reviewContainer, {
              click: true,
              bounce: true,
              deceleration: 0.001,
              swipeTime: 1800,
              probeType:3,
            })
            this.reviewScroll.on('scroll',(pos) => {
              if(Math.abs(Math.round(pos.y)) > (Math.abs(Math.round(this.reviewScroll.maxScrollY)))){
                this.loadMoreReview()
                //加载完成后务必重新刷新让BScroll重新计算高度
                this.reviewScroll.refresh()
              }
            })
          });
        }
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
    z-index: 2;
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
    padding-bottom: .8rem;
    .menu-wrap{
      width: 1.5rem;
      overflow-y: auto;
      .menu-list{
        @include sc(.24rem, #999);
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
        border-left:3px solid $blue;
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
        .foods-box{
          border-bottom: 1px solid #f1f1f1;
          background-color: #fff;
          padding:.2rem;
        }
        .foods-list-content{
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
          }
        }
        .foods-specs{
          @include fj;
          margin-left: .9rem;
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
    z-index: 9;
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
    z-index: 12;
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
  .food-container{
    position:fixed;
    bottom:0;
    left: 0;
    width: 100%;
    z-index: 11;
  }
  .buycart-container{
    background-color: #333;
    position:absolute;
    bottom:0;
    left: 0;
    width: 100%;
    display: flex;
    z-index: 12;
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
      width: 2.2rem;
      text-align: center;
      span{
        font-weight: bold;
      }
      a{
        font-weight: bold;
        color: #fff;
      }
    }
    .actived_gotopay{
      background-color: $green;
      color: #fff;
    }
  }
  .cart-list-container{
      background-color: #fff;
      position: fixed;
      bottom: .8rem;
      left: 0;
      width: 100%;
      z-index: 10;
      header{
        background-color: #eceff1;
        padding:.15rem;
        @include fj;
        h4{
          @include sc(.28rem, #666);
        }
        .cart-list-clear{
          display: flex;
          align-items: center;
          svg{
            @include wh(.3rem, .3rem);
          }
          span{
            @include sc(.24rem, #666);
            margin-left:.1rem;
          }
        }
      }
      .cart-list-ul{
        overflow-y: auto;
        max-height: 7.5rem;
        li{
          padding:.2rem;
          @include fj;
          align-items: center;
          .name{
            @include sc(.28rem, #666);
            font-weight: bold;
            width: 55%;
          }
          .price{
            @include sc(.28rem, $orange);
            font-weight: bold;
          }
          .control-side{
            align-items: center;
            display: flex;
            .num{
              @include sc(.24rem, #666);
              min-width: .4rem;
              text-align: center;
            }
            svg{
              fill: $blue;
              @include wh(.35rem, .35rem);
              vertical-align: middle;
            }
          }
        }
      }
    }
    .review-container{
      position: relative;
      overflow-y: hidden;
      flex: 1;
      .rating-box{
        background-color: #fff;
        padding:.2rem;
        display: flex;
        .rating-left-side{
          flex: 3;
          text-align: center;
          p:nth-of-type(1){
            @include sc(.5rem, $orange);
          }
          p:nth-of-type(2){
            @include sc(.3rem, #666);
            margin-bottom: .05rem;
          }
          p:nth-of-type(3){
            @include sc(.24rem, #999);
          }
        }
        .rating-right-side{
          flex: 4;
          p{
            display: flex;
            align-items: center;
            .txt{
              @include sc(.3rem, #666);
              margin-right:.1rem;
            }
            .orange{
              @include sc(.24rem, $orange);
              margin-left:.1rem;
            }
            .minute{
              @include sc(.24rem, #999);
              margin-left:.1rem;
            }
          }
        }
      }
    }
    .ratingTags-section{
      margin-top: .2rem;
      background-color: #fff;
      padding:.2rem;
      .ratingTags-ul{
        display: flex;
        flex-wrap: wrap;
        li{
          @include sc(.24rem, #6d7885);
          background-color: #ebf5ff;
          padding:.1rem;
          border-radius: .1rem;
          margin-right:.1rem;
          margin-bottom: .1rem;
        }
        .activity_Tags{
          color: #fff;
          background-color: $blue;
        }
        .unsatisfied{
          background-color: #f5f5f5;
          color: #aaa;
        }
      }
    }
    .rating-list-ul{
      background-color: #fff;
      padding:.2rem;
      .rating-list-li{
        border-top: 1px solid #f1f1f1;
        padding:.2rem 0;
        display: flex;
        .rating-avatar{
          @include wh(.7rem, .7rem);
          border-radius: 50%;
        }
        .rating-content{
          width: 100%;
          padding: 0 .1rem;
          header{
            @include fj;
            h4{
              @include sc(.24rem, #666);
            }
            .rating-date{
              @include sc(.24rem, #999);
            }
          }
          .rating-desc{
            display: flex;
            align-items: center;
            margin-bottom: .1rem;
            span{
              @include sc(.24rem, #999);
              margin-left:.1rem;
            }
          }
          .food-img-ul{
            display: flex;
            li{
              img{
                @include wh(1rem, 1rem);
                margin-right: .1rem;
                margin-bottom: .1rem;
              }
            }
          }
          .food-name-ul{
            display: flex;
            li{
              width:1rem;
              margin-right: .1rem;
              border:1px solid #eee;
              text-align: center;
              border-radius: .1rem;
              color: #999;
              span{
                @include sc(.24rem, #999);
              }
            }
          }
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
  .slideUp-enter-active, .slideUp-leave-active{
    transition: all .4s;
  }
  .slideUp-enter, .slideUp-leave-active{
    transform: translateY(100%);
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
