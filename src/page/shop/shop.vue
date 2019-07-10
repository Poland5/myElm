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
        <img :src="imgBaseUrl + shop_detail.image_path" class="img_bg">
        <section class="desc-cover">
          <router-link to="/shop/shopDetail" class="desc-container">
            <img :src="imgBaseUrl + shop_detail.image_path">
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
          <!-- 左侧菜单栏 -->
          <section class="menu-left" id="menuWrap" ref="menuWrap">
            <ul>
              <li class="menu-list" v-for="(item,index) in menuFoodsList" :key="index" @click="choosedMenu(index)" :class="{menu_activity:index == menuIndex}">
                <img :src="getImgPath(item.icon_url)" v-if="item.icon_url">
                <p>{{item.name}}</p>
                <span class="category-num" v-if="categoryNum[index]">{{categoryNum[index]}}</span>
              </li>
            </ul>
          </section>
          <!-- 右侧列表 -->
          <section class="menu-right" ref="menuContent">
            <ul class="foods-list-ul">
              <li v-for="(item,index) in menuFoodsList" :key="index">
                <header class="foods-list-header">
                  <h3 class="ellipsis">{{item.name}}</h3>
                  <span class="desc">{{item.description}}</span>
                  <span class="sl" @click="showDescDetail(index)">...</span>
                  <div class="foods-list-tips" v-if="descIndex == index">{{item.name}}<span>{{item.description}}</span></div>
                </header>
                <div class="foods-box" v-for="(foods, subIndex) in item.foods" :key="subIndex">
                  <router-link :to="{path:'/shop/foodsDetail',query:{
                    name: foods.name,
                    image_path: foods.image_path,
                    description: foods.description,
                    mouth_sales: foods.mouth_sales,
                    price: foods.specfoods[0].price,
                    rating: foods.rating,
                    rating_count: foods.rating_count,
                    satisfy_rate: foods.satisfy_rate}}"
                    class="foods-list-content">
                    <i>
                      <img :src="imgBaseUrl + foods.image_path">
                    </i>
                    <div class="foods-list-desc">
                      <h4 class="ellipsis">
                        {{foods.name}}
                        <ul v-if="foods.attributes.length" class="foods-attr-ul">
                          <li v-for="(attrItem, attrIndex) in foods.attributes" :key="attrIndex">
                            <div v-if="attrItem" :style="{color: attrItem.icon_name == '新'?'#5ec452':'#f07373', borderColor: attrItem.icon_name == '新'?'#5ec452':'#f07373'}">
                              {{attrItem.icon_name}}
                            </div>
                          </li>
                        </ul>
                      </h4>
                      <p>{{foods.description}}</p>
                      <p>{{foods.tips}}</p>
                      <p class="ellipsis"
                        v-if="foods.activity"
                        :style="{color:'#' + foods.activity.image_text_color, borderColor:'#' + foods.activity.image_text_color}">
                        {{foods.activity.image_text}}
                      </p>
                      <section class="foods-specs">
                        <span class="txt">
                          <span class="price">{{foods.specfoods[0].price}}</span>
                          <span v-if="foods.specifications.length">起</span>
                        </span>
                        <buy-cart :foods="foods"
                                  :shopId="shop_id"
                                  @showMoveDot="showMoveDotFunc"
                                  @showSpeciList="showSpeciListFunc"
                                  @showRemoveInfo='showRemoveInfo'>
                                  </buy-cart>
                      </section>
                    </div>
                  </router-link>
                </div>
              </li>
            </ul>
          </section>
          <!-- 底部购物车 -->
          <section class="food-container">
            <section class="buycart-container">
              <section class="left-cart-num" @click="toggleCartList">
                <div class="cart-icon-box" :class="{activeCart:totalPrice > 0, animationCart:receiveInCart}" ref="cart_icon_box">
                  <svg class="cart_icon">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
                  </svg>
                  <span class="total-num" v-if="totalNum">{{totalNum}}</span>
                </div>
                <div class="pd-txt">
                  <p>￥{{totalPrice}}</p>
                </div>
              </section>
              <section class="gotopay" :class="{actived_gotopay:miniOrderAmount <= 0}">
                <span v-if="miniOrderAmount > 0">还差￥20起送</span>
                <router-link :to="{path:'/confirmOrder', query:{geohash,shop_id}}" v-else>去结算</router-link>
              </section>
            </section>
            <!-- 切换购物车列表 -->
            <transition name="toggle_cart_list">
              <section class="cart-list-container" v-if="cartFoodsList.length && showCartList">
                <header>
                  <h4>已选商品</h4>
                  <div class="cart-list-clear" @click="clearCartList">
                    <svg>
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
                    </svg>
                    <span>清空</span>
                  </div>
                </header>
                <ul class="cart-list-ul">
                  <li v-for="(item, index) in cartFoodsList" class="border-1px" :key="index">
                    <div class="name">{{item.name}}</div>
                    <div class="price">{{item.price}}</div>
                    <section class="control-side">
                      <span @click="reduceCart(item.category_id, item.item_id, item.food_id, item.name, item.packing_fee, item.price, item.specs)">
                        <svg>
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                        </svg>
                      </span>
                      <span class="num">{{item.num}}</span>
                      <span @click="addCart(item.category_id, item.item_id, item.image_path, item.food_id, item.name, item.packing_fee, item.price, item.specs)">
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
      <transition name="fade">
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
      </transition>
    </section>
    <!-- 骨架屏 -->
    <section class="animation_opacity shop_back_svg_container" v-if="showloading">
      <img src="../../images/shop_back_svg.svg">
    </section>
    <!-- 购物车点击动画 -->
    <transition appear
                @after-appear='afterEnter'
                @before-appear='beforeEnter'
                v-for="(item, index) in showMoveDot"
                :key="index">
      <span class="move-dot" v-if="item">
        <svg class="move-liner">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
        </svg>
      </span>
    </transition>
    <!-- 规格背景板 -->
    <transition name="fade">
      <section v-if="showSpecs" class="bg-cover" @click="closedFoodsSpecs"></section>
    </transition>
    <!-- 购物车列表背景板 -->
    <transition name="fade">
      <section v-if="cartFoodsList.length && showCartList" class="bg-cover" @click="toggleCartList"></section>
    </transition>
    <transition name="fade">
      <section v-if="show_remove_info" class="show-remove-info">
        多规格商品只能去购物车删除哦
      </section>
    </transition>
    <!-- 规格弹出框 -->
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
    <!-- <loading v-show="showloading || showRating"></loading> -->
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { shopDetail, foodList, getScores, getRatingTags, getRatingInfo } from '@/api/getData'
  import { getImgPath, loadMore } from '@/components/mixins'
  import { mapState, mapMutations } from 'vuex'
  import { imgBaseUrl } from '@/config/env'
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
        menuFoodsList: [], // 食品列表
        imgBaseUrl,
        showMoveDot: [],
        elLeft: 0, // 点击图标按钮
        elBottom: 0,
        foodsListTop: [], // 食物分类高度集合
        foodScroll: null, // 获取BScorll实例
        categoryNum: [], // 已加入购物车商品分类数量
        showSpecs: false, // 显示选择规格窗口
        chooseFoods: null, // 选择规格食品
        itemIndex: 0,    // 规格默认索引
        show_remove_info: false, // 规格删除提示
        totalPrice: 0,   // 购物车总价格
        receiveInCart: false, // 到达cart图标执行动画
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
      shopCart:function() {
        return {...this.cartList[this.shop_id]}
      },
      promotionInfo:function() {
        return this.shop_detail.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'
      },
      totalNum:function() {
        let num = 0
        this.cartFoodsList.forEach(item => {
          num += parseInt(item.num)
        })
        return num
      },
      miniOrderAmount:function() {
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
      // 初始化渲染数据
      async initData() {
        this.shop_detail = await shopDetail(this.shop_id)
        this.menuFoodsList = await foodList(this.shop_id)
        this.showloading = false
        this.RECODE_SHOPDETAIL(this.shop_detail)
        this.scores = await getScores(this.shop_id)
        this.ratingTags = await getRatingTags(this.shop_id)
        this.ratingInfo = await getRatingInfo(this.shop_id)
      },
      goback() {
        this.$router.go(-1)
      },
      showDescDetail(index) {
        if(this.descIndex == index){
          this.descIndex = null
        }else{
          this.descIndex = index
        }
      },
      // 从终点位置设置到当前icon目标位置
      beforeEnter(el) {
        el.style.transform = `translate3d(0, ${this.elBottom - window.innerHeight + 37}px, 0)`
        el.children[0].style.transform = `translate3d(${this.elLeft - 30}px, 0, 0)`
        el.children[0].style.opacity = 0
      },
      // 返回到终点位置
      afterEnter(el) {
        el.style.transform = `translate3d(0, 0, 0)`
        el.children[0].style.transform = `translate3d(0, 0, 0)`
        el.style.transition = `transform .55s cubic-bezier(.3, -.25, .7, -.1)`
        el.children[0].style.transition = `transform .55s linear`
        el.children[0].style.opacity = 1
        this.showMoveDot = this.showMoveDot.map(item => false)
        el.children[0].addEventListener('transitionend', () => {
          this.listenerInCart()
        })
        el.children[0].addEventListener('webkitAnimationEnd', () => {
          this.listenerInCart()
        })
      },
      // 监听购物车添加商品时增加响应动画
      listenerInCart() {
        if (!this.receiveInCart) {
          this.receiveInCart = true
          this.$refs.cart_icon_box.addEventListener('animationend', () => {
            this.receiveInCart = false
          })
          this.$refs.cart_icon_box.addEventListener('WebkitAnimationEnd', () => {
            this.receiveInCart = false
          })
        }
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
       this.foodScroll = new BScroll((element), {
          probeType: 3,
          deceleration: 0.001,
          bounce:false,
          swipeTime:2000,
          click:true
        })
        const menuWrap = new BScroll(('#menuWrap'), {
          click:true
        })
        // const wrapMenuHeight = this.$refs.menuWrap.clientHeight
        this.foodScroll.on('scroll', (pos) => {
          if (!this.$refs.menuWrap) {
            return
          }
          // 右侧内容滚动时，左侧菜单能同步到对应位置
          this.foodsListTop.forEach((item, index) => {
            if (Math.abs(Math.round(pos.y)) >= item) {
              this.menuIndex = index
              const menuFoodsList = this.$refs.menuWrap.querySelectorAll('.menu_activity')
              const el = menuFoodsList[0]
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
      closedFoodsSpecs() {
        this.showSpecs = false;
      },
      //选择规格
      selectedSpecsFoods(index) {
        this.itemIndex = index;
      },
      addSpec(category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock) {
        this.ADD_CART({shopId:this.shop_id, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock})
        this.showSpecs = false
      },
      showRemoveInfo() {
        this.show_remove_info = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          clearTimeout(this.timer)
          this.show_remove_info = false
        }, 3000)
      },
      // 点击左侧菜单，右侧内容响应滚动到顶部
      choosedMenu(index) {
        this.menuIndex = index
        this.menuIndexChange = false // 防止滚动事件重复触发
        this.foodScroll.scrollTo(0, -this.foodsListTop[index], 400)
        this.foodScroll.on('scrollEnd', () => {
          this.menuIndexChange = true
        })
      },
      // 展示购物车列表数据
      toggleCartList() {
        this.cartFoodsList.length ? this.showCartList = !this.showCartList : true
      },
      // 清空购物车
      clearCartList() {
        this.showCartList = false
        this.CLEAR_CART(this.shop_id)
      },
      // 购物车中增加商品数量
      addCart(category_id, item_id, image_path, food_id, name, packing_fee, price, specs){
        this.ADD_CART({shopId:this.shop_id, category_id, item_id, image_path, food_id, name, packing_fee, price, specs})
      },
      // 购物车中减少商品数量
      reduceCart(category_id, item_id, food_id, name, packing_fee, price, specs) {
        this.REDUCE_CART({shopId:this.shop_id, category_id, item_id, food_id, name, packing_fee, price, specs})
      },
      async selectedTags(index, name) {
        this.tagsIndex = index
        let res = await getRatingInfo(this.shop_id, this.ratingOffset, name)
        this.ratingInfo = [...res]
      },
      /**
       * 统计购物车数据;
       * 购物车商品总价格: totalPrice;
       * 购物车商品列表: cartFoodsList;
       * 食品分类数量统计: categoryNum;
       */
      initBuyCartData() {
        let arrNum = []
        let cartFoodNum = 0
        this.totalPrice = 0
        this.cartFoodsList = []
        this.menuFoodsList.forEach((item,index) => {
          if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
            let num = 0
            Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemId => {
              Object.keys(this.shopCart[item.foods[0].category_id][itemId]).forEach(foodsId => {
                let foodsItem = this.shopCart[item.foods[0].category_id][itemId][foodsId]
                num += parseInt(foodsItem.num)
                if (item.type == 1) {
                  this.totalPrice += foodsItem.num * foodsItem.price
                  if (foodsItem.num > 0) {
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
      showloading :function(value) {
        if (!value) {
          this.$nextTick(() => {
            this.getFoodListHeight()
            this.initBuyCartData()
          })
        }
      },
      shopCart:function() {
        this.initBuyCartData()
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
    padding-top: 0;
  }
  .goback{
    position: absolute;
    top: px2rem(5);
    left: px2rem(5);
    height: px2rem(25);
    z-index: 2;
  }
  .shop-header{
    overflow: hidden;
    height: px2rem(90);
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
        padding: px2rem(10);
        display: flex;
        img{
          @include wh(px2rem(68), px2rem(68))
        }
        .desc{
          margin-left: px2rem(7);
          .title{
            font-weight: bold;
            @include sc(px2rem(18), #fff);
            margin-bottom: px2rem(7)
          }
          .txt{
            margin-bottom: px2rem(7);
            span{
              @include sc(px2rem(12), #fff);
            }
          }
          .notice{
            @include sc(px2rem(12), #fff);
            width: 4px2rem(10);
          }

        }
        .footer_arrow{
          @include wh(px2rem(14), px2rem(14));
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: px2rem(5);
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
      text-align: center;
      padding: px2rem(10) 0 px2rem(10) 0;
      span{
        @include sc(px2rem(16), #666);
      }
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
    padding-bottom: px2rem(40);
    .menu-left{
      width: px2rem(80);
      overflow-y: auto;
      .menu-list{
        @include fc;
        padding: px2rem(16) px2rem(7);
        border-bottom: 1px solid #ededed;
        background-color: #f5f5f5;
        position: relative;
        vertical-align: middle;
        p{
          @include sc(px2rem(14), #999);
        }
        img{
          @include wh(px2rem(12), px2rem(12));
          margin-right: px2rem(6);
        }
      }
      .menu_activity{
        background-color: #fff;
        color: #666;
        border-left: px2rem(3) solid $blue;
      }
      .category-num{
        position: absolute;
        top: 2px;
        right: 2px;
        @include sc(px2rem(10), #fff);
        background-image: linear-gradient(-90deg,#ff7416,#ff3c15 98%);
        border-radius: px2rem(25);
        padding:.02rem;
        transform: scale(.8);
        padding: 0 px2rem(4);
      }
    }
  }
  .menu-right{
    flex: 5;
    background-color: #fff;
    overflow-y: auto;
    .foods-list-ul{
      li{
        .foods-list-header{
          background-color: #f5f5f5;
          padding:px2rem(10);
          position: relative;
          display: flex;
          align-items: center;
          .foods-list-tips{
            background-color: #39373a;
            opacity: .95;
            @include sc(px2rem(12), #fff);
            position: absolute;
            right: px2rem(5);
            top: px2rem(30);
            width: px2rem(160);
            padding: px2rem(11) px2rem(9);
            border-radius: px2rem(5);
            z-index: 10;
            span{
              margin-left: px2rem(5);
              @include sc(px2rem(12), #fff);
            }
          }
          .foods-list-tips::after{
            content:'';
            @include wh(px2rem(8), px2rem(8));
            background-color: #39373a;
            position: absolute;
            right: px2rem(5);
            top: px2rem(-4);
            transform: rotate(45deg);
          }
          h3{
            @include sc(px2rem(12), #666);
            font-weight: bold;
          }
          .desc{
            @include sc(px2rem(12), #999);
            margin-left: px2rem(5);
          }
          .sl{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: px2rem(10);
            @include sc(px2rem(15), #999);
            margin-top: px2rem(-5);
          }
        }
        .foods-box{
          border-bottom: 1px solid #f1f1f1;
          background-color: #fff;
          padding: px2rem(10);
          position: relative;
          min-height: px2rem(95);
        }
        .foods-list-content{
          display: flex;
          i{
            img{
              @include wh(px2rem(95), px2rem(95))
            }
          }
          .foods-list-desc{
            position: relative;
            margin-left: px2rem(6);
            width: 100%;
            h4{
              @include sc(px2rem(14), #666);
              font-weight: bold;
              @include fj;
              .foods-attr-ul{
                display: flex;
                li{
                  div{
                    border:1px solid #666;
                    font-size: px2rem(12);
                    margin-left: px2rem(2.5);
                    margin-right:-px2rem(5);
                    padding: 0 px2rem(2);
                    transform: scale(.875);
                  }
                }
              }
            }
            p:nth-of-type(1){
              @include sc(px2rem(12), #999);
              transform: translateX(px2rem(-11)) scale(0.875);
            }
            p:nth-of-type(2){
              @include sc(px2rem(12), #999);
              transform: translateX(px2rem(-11)) scale(0.875);
            }
            p:nth-of-type(3){
              @include sc(px2rem(12), #666);
              padding: px2rem(1) px2rem(2);
              display: inline-block;
              border:1px solid #666;
              border-radius: px2rem(1);
              transform: scale(.8) translateX(px2rem(-5));
            }
          }
        }
        .foods-specs{
          @include fj;
          .txt:before{
            content: '\A5';
            @include sc(px2rem(16), $orange);
          }
          .txt{
            display: -webkit-flex;
            display: flex;
            -webkit-align-items: baseline;
            align-items: baseline;
            position: absolute;
            bottom: 0;
            span{
              @include sc(px2rem(12), $orange);
              vertical-align:bottom;
            }
            .price{
              @include sc(px2rem(16), $orange);
              margin-right: px2rem(3);
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
    z-index: 9;
    top: 0;
  }
  .move-dot{
    position: fixed;
    bottom:30px;
    left: 30px;
    svg{
      @include wh(px2rem(25), px2rem(25));
      fill: $blue;
    }
  }
  .specs-container{
    background-color: #fff;
    border-radius: px2rem(5);
    @include center;
    @include wh(px2rem(250), px2rem(150));
    z-index: 12;
    header{
      padding:px2rem(10);
      position: relative;
      text-align: center;
      .specs_cancel{
        position: absolute;
        top: px2rem(10);
        right: px2rem(10);
      }
    }
    .specs-content{
      padding:px2rem(10);
      h5{
        color: #666;
      }
      .specs-ul{
        display: flex;
        margin-top:px2rem(5);
        li{
          border:1px solid #ddd;
          display: inline-block;
          margin-right:px2rem(5);
          padding:px2rem(5) px2rem(10);
          border-radius: px2rem(5);
          @include sc(px2rem(12), #666)
        }
        .activeSpec{
          border-color: $blue;
          color: $blue;
        }
      }
    }
    .specs-footer{
      background-color: #f9f9f9;
      margin-top:px2rem(10);
      padding:px2rem(10) px2rem(10);
      @include fj;
      align-items: center;
      .price{
        @include sc(px2rem(15), $orange)
      }
      .add-cart{
        color: #fff;
        background-color: $blue;
        border-radius: px2rem(5);
        padding:px2rem(5) px2rem(10);
      }
    }
  }
  .show-remove-info{
    background-color: rgba($color: #000000, $alpha: .7);
    padding: px2rem(5);
    border-radius: px2rem(5);
    @include center;
    @include sc(px2rem(15), #fff);
    width: px2rem(225);
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
    height: px2rem(46);
    .left-cart-num{
      position: relative;
      flex: 3;
      .cart-icon-box{
        border-radius: 50%;
        border:px2rem(4) solid #444;
        background-color: #333;
        text-align: center;
        align-items: center;
        position: absolute;
        padding: px2rem(8);
        top: px2rem(-18);
        left: px2rem(11);
        .cart_icon{
          @include wh(px2rem(30), px2rem(28));
        }
        .total-num{
          background-image: linear-gradient(-90deg,#ff7416,#ff3c15 98%);
          @include sc(px2rem(12), #fff);
          position: absolute;
          top: px2rem(-5);
          right: px2rem(-5);
          border-radius: px2rem(8);
          min-width: px2rem(15);
          transform: scale(0.9);
          padding: px2rem(1) px2rem(4);
        }
      }
      .activeCart{
        background-color: $blue;
      }
      .pd-txt{
        margin-left: px2rem(82);
        height: 100%;
        @include fc;
        p:nth-of-type(1){
          @include sc(px2rem(18), #ffffff);
        }
      }
    }
    .gotopay{
      background-color: #535356;
      color: #fff;
      width: px2rem(110);
      line-height: px2rem(46);
      text-align: center;
      span{
        font-weight: bold;
      }
      a{
        width: 100%;
        height: 100%;
        display: inline-block;
        font-weight: bold;
        color: #fff;
        font-size: px2rem(14);
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
      bottom: px2rem(46);
      left: 0;
      width: 100%;
      z-index: 10;
      header{
        background-color: #eceff1;
        padding:px2rem(10) px2rem(14);
        @include fj;
        h4{
          @include sc(px2rem(16), #666);
        }
        .cart-list-clear{
          display: flex;
          align-items: center;
          svg{
            @include wh(px2rem(15), px2rem(15));
          }
          span{
            @include sc(px2rem(12), #666);
            margin-left:px2rem(5);
          }
        }
      }
      .cart-list-ul{
        max-height: px2rem(300);
        overflow-y: auto;
        li{
          padding:px2rem(10);
          padding-left: 0;
          margin-left: px2rem(10);
          @include fj;
          align-items: center;
          height: px2rem(55);
          .name{
            font-size: px2rem(16);
            width: 55%;
          }
          .price{
            @include sc(px2rem(14), $orange);
            &::before{
              content: '\A5';
              font-size: px2rem(12);
            }
          }

          .control-side{
            align-items: center;
            display: flex;
            .num{
              @include sc(px2rem(14), #666);
              min-width: px2rem(24);
              text-align: center;
            }
            svg{
              fill: $blue;
              @include wh(px2rem(25), px2rem(25));
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
        padding:px2rem(10);
        display: flex;
        .rating-left-side{
          flex: 3;
          text-align: center;
          p:nth-of-type(1){
            @include sc(px2rem(25), $orange);
          }
          p:nth-of-type(2){
            @include sc(px2rem(15), #666);
            margin-bottom: px2rem(2.5);
          }
          p:nth-of-type(3){
            @include sc(px2rem(12), #999);
          }
        }
        .rating-right-side{
          flex: 4;
          p{
            display: flex;
            align-items: center;
            .txt{
              @include sc(px2rem(15), #666);
              margin-right:px2rem(5);
            }
            .orange{
              @include sc(px2rem(12), $orange);
              margin-left:px2rem(5);
            }
            .minute{
              @include sc(px2rem(12), #999);
              margin-left:px2rem(5);
            }
          }
        }
      }
    }
    .ratingTags-section{
      margin-top: px2rem(10);
      background-color: #fff;
      padding:px2rem(10);
      .ratingTags-ul{
        display: flex;
        flex-wrap: wrap;
        li{
          @include sc(px2rem(12), #6d7885);
          background-color: #ebf5ff;
          padding:px2rem(5);
          border-radius: px2rem(5);
          margin-right:px2rem(5);
          margin-bottom: px2rem(5);
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
      padding:px2rem(10);
      .rating-list-li{
        border-top: 1px solid #f1f1f1;
        padding:px2rem(10) 0;
        display: flex;
        .rating-avatar{
          @include wh(px2rem(35), px2rem(35));
          border-radius: 50%;
        }
        .rating-content{
          width: 100%;
          padding: 0 px2rem(5);
          header{
            @include fj;
            h4{
              @include sc(px2rem(12), #666);
            }
            .rating-date{
              @include sc(px2rem(12), #999);
            }
          }
          .rating-desc{
            display: flex;
            align-items: center;
            margin-bottom: px2rem(5);
            span{
              @include sc(px2rem(12), #999);
              margin-left:px2rem(5);
            }
          }
          .food-img-ul{
            display: flex;
            li{
              img{
                @include wh(1rem, 1rem);
                margin-right: px2rem(5);
                margin-bottom: px2rem(5);
              }
            }
          }
          .food-name-ul{
            display: flex;
            li{
              width:1rem;
              margin-right: px2rem(5);
              border:1px solid #eee;
              text-align: center;
              border-radius: px2rem(5);
              color: #999;
              span{
                @include sc(px2rem(12), #999);
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
  .toggle_cart_list-enter-active, .toggle_cart_list-leave-active{
    transition: all .4s;
  }
  .toggle_cart_list-enter, .toggle_cart_list-leave-active{
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
