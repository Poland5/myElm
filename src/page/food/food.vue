<template>
  <div class="page">
    <head-top goback="true" :head-title="headTitle"></head-top>
    <!-- 分类、排序、筛选 -->
    <section class="sort-container">
      <!-- 分类 -->
      <section class="sort-item">
        <header class="sort-header" :class="{chooseItem:sortBy == 'food'}" @click="chooseType('food')">
          <span :class="{sortTitle: sortBy == 'food'}">{{foodTitle}}</span>
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
            <polygon points="0,3 10,3 5,8"/>
          </svg>
        </header>
        <transition name="slideDown">
          <section class="food-type-container" v-if="sortBy == 'food'">
            <!-- 左侧食品分类 -->
            <section class="food-type-left">
              <ul class="food-list-ul">
                <li v-for="(item,index) in category" :key="index" :class="{selected:restuarant_category_id == item.id}" @click="selectCategory(index,item.id)">
                  <div class="foods-name">
                    <img :src="getImgPath(item.image_url)" v-if="index">
                    <span>{{item.name}}</span>
                  </div>
                  <div class="foods-count">
                    <span>{{item.count}}</span>
                    <svg v-if="index" width="8" height="8" xmlns="http://www.w3.org/2000/svg" version="1.1">
                      <path d="M0 0 L6 4 L0 8"  stroke="#bbb" stroke-width="1" fill="none"/>
                    </svg>
                  </div>
                </li>
              </ul>
            </section>
            <!-- 右侧详细食品分类 -->
            <section class="food-type-right">
              <ul class="subFood-list-ul">
                <li v-for="(subItem, subIndex) in showSubcategory" :class="{select_right_category: subItem.id == restuarant_category_ids}" :key="subIndex" @click="getFoodCategory(subItem.id, subItem.name)">
                  <span>{{subItem.name}}</span>
                  <span>{{subItem.count}}</span>
                </li>
              </ul>
            </section>
          </section>
        </transition>
      </section>
      <!-- 排序 -->
      <section class="sort-item">
        <header class="sort-header" :class="{chooseItem:sortBy == 'sort'}" @click="chooseType('sort')">
          <span :class="{sortTitle: sortBy == 'sort'}">排序</span>
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
            <polygon points="0,3 10,3 5,8"/>
          </svg>
        </header>
        <transition name="slideDown">
          <section v-if="sortBy == 'sort'" class="sort-type-container">
            <ul @click="sortList($event)">
              <li class="sort-list-div">
                <svg class="icon-default">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#default"></use>
                </svg>
                <p data="4" class="sort-inner-right" :class="{selected:sortByType == '4'}">
                  <span>智能排序</span>
                  <svg class="icon-selected" v-if="sortByType == 4">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-div">
                <svg class="icon-default">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#distance"></use>
                </svg>
                <p data="5" class="sort-inner-right" :class="{selected:sortByType == '5'}">
                  <span>最近距离</span>
                  <svg class="icon-selected" v-if="sortByType == 5">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-div">
                <svg class="icon-default">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hot"></use>
                </svg>
                <p data="6" class="sort-inner-right" :class="{selected:sortByType == '6'}">
                  <span>销量最高</span>
                  <svg class="icon-selected" v-if="sortByType == 6">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-div">
                <svg class="icon-default">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#price"></use>
                </svg>
                <p data="1" class="sort-inner-right" :class="{selected:sortByType == '1'}">
                  <span>起送价最低</span>
                  <svg class="icon-selected" v-if="sortByType == 1">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-div">
                <svg class="icon-default">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#speed"></use>
                </svg>
                <p data="2" class="sort-inner-right" :class="{selected:sortByType == '2'}">
                  <span>配送速度最快</span>
                  <svg class="icon-selected" v-if="sortByType == 2">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-div">
                <svg class="icon-default">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rating"></use>
                </svg>
                <p data="3" class="sort-inner-right" :class="{selected:sortByType == '3'}">
                  <span>评分最高</span>
                  <svg class="icon-selected" v-if="sortByType == 3">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
            </ul>
          </section>
        </transition>
      </section>
      <!-- 筛选 -->
      <section class="sort-item">
        <header class="sort-header" :class="{chooseItem:sortBy == 'filter'}" @click="chooseType('filter')">
          <span :class="{sortTitle: sortBy == 'filter'}">筛选</span>
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
            <polygon points="0,3 10,3 5,8"/>
          </svg>
        </header>
        <transition name="slideDown">
          <section class="filter-container" v-if="sortBy == 'filter'">
            <div class="filter-div">
              <header>配送方式</header>
              <ul class="multiple-choise">
                <li v-for="(item,index) in Delivery" :class="{activity_delivery:delivery_mode == item.id}" :key="index" @click="selectedDelivery(item.id)">
                  <svg>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="delivery_mode == item.id ? '#selected' : '#fengniao'"></use>
                  </svg>
                  <span>{{item.text}}</span>
                </li>
              </ul>
            </div>
            <div class="filter-div">
              <header>商家属性(可以多选)</header>
              <ul class="multiple-choise">
                <li v-for="(item,index) in Activity" :key="index" @click="selectSupportIds(item.id, index)">
                  <svg v-show="support_ids[index].statu" class="box-base">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                  <span v-show="!support_ids[index].statu" class="box-base box-border" :style="{borderColor:'#'+item.icon_color,color:'#'+item.icon_color}" >{{item.icon_name}}</span>
                  <span>{{item.name}}</span>
                </li>
              </ul>
            </div>
            <section class="btn-box">
              <div class="btn-clear" @click="clearFilter">清空</div>
              <div class="btn-confirm" @click="confirmFilter">确定({{activity_num}})</div>
            </section>
          </section>
        </transition>
      </section>
    </section>
    <!-- 遮罩层 -->
    <transition name="cover">
      <div class="back-cover" v-show="sortBy"></div>
    </transition>
    <!-- 商家列表 -->
    <section>
      <shopList :geohash="geohash"
                :restuarantCategoryIds="restuarant_category_ids"
                :orderBy="sortByType"
                :deliveryMode="delivery_mode"
                :supportIds="support_ids"
                :statuFilter="statu_filter">
      </shopList>
    </section>
  </div>
</template>

<script>
  import headTop from '@/components/headTop'
  import { foodCategory, deliveryMode, foodActivity } from '@/api/getData'
  import { getImgPath } from '@/components/mixins'
  import shopList from '@/components/shopList'
  export default {
    data () {
      return {
        geohash:'',                     // 经纬度
        latitude: '',                   // 维度
        longitude: '',                  // 经度
        headTitle: '',                  // 头部名称
        foodTitle: '',                  // 食品分类名称
        sortBy: '',                     // 排序方式
        sortByType: '',                 // 选择排序
        category: null,                 // 所有商铺分类列表
        subcategory: null,              // 商品分类对应的详细列表
        restuarant_category_id: null,   // 食品类型ID
        restuarant_category_ids: null,  // 筛选类型ID
        showBG: false,                  // 黑色背景色
        Delivery: null,                 // 配送方式
        Activity: null,                 // 商家支持活动数据
        delivery_mode: null,            // 选中的配送方式
        activity_num: 0,                // 激活个数
        support_ids: [],                // 选中商铺的活动列表
        statu_filter: false,            // 同步筛选
      }
    },
    components: {
      headTop,
      shopList
    },
    mixins: [ getImgPath ],
    computed: {
      showSubcategory() {
        // 过滤掉所有子分类中的第一项
        return this.subcategory.filter((item, index) => {
          if (index !== 0) return item
        })
      }
    },
    created() {
      this.headTitle = this.$route.query.title
      this.geohash = this.$route.query.geohash
      this.latitude = this.geohash.split(',')[0]
      this.longitude = this.geohash.split(',')[1]
      this.foodTitle = this.headTitle
    },
    mounted() {
      this.initData()
    },
    methods: {
      async initData() {
        this.category = await foodCategory(this.latitude, this.longitude)
          this.category.forEach((item, index) => {
            this.subcategory = item.sub_categories
        })
        // 获取选项列表中的配送模式
        this.Delivery = await deliveryMode()
        // 获取食品激活列表
        this.Activity = await foodActivity()
        this.Activity.forEach((item,index) => {
          this.support_ids[index] = {statu:false, id:item.id}
        })
      },
      // 点击顶部三个选项，展示不同的列表，选中当前选项进行展示，同时收回其他列表
      chooseType(type) {
        // 点击不同选项时
        if(this.sortBy !== type){
          this.sortBy = type
          // 点击食品列表时进行特殊处理
          if(this.sortBy == 'food'){
            this.foodTitle = '分类'
          }else{
            this.foodTitle = this.headTitle
          }
        }else{
          // 将foodTitle和headTitle进行同步
          if (this.sortBy == 'food') this.foodTitle = this.headTitle
          // 点击相同选项时收回列表
          this.sortBy = ''
        }
      },
      // 选择左侧分类，右侧展示对应详细分类列表
      selectCategory(index, id) {
        // 第一个选项为选择全部
        if (index == 0) {
          this.restuarant_category_ids = null
          this.sortBy = ''
        } else {
          // 展示右侧详细列表分类
          this.restuarant_category_id = id
          this.subcategory = this.category[index].sub_categories
        }
      },
      // 选中右侧食物筛选，重新获取对象并渲染
      getFoodCategory(id, name) {
        this.restuarant_category_ids = id
        this.foodTitle = this.headTitle = name
        this.sortBy = ''
      },
      // 选择一种排序方式，重新获取对象并渲染
      sortList(event){
        let node
        if(event.target.nodeName.toUpperCase() !== 'P'){
          node = event.target.parentNode
        }else{
          node = event.target
        }
        this.sortByType = node.getAttribute('data')
        this.sortBy = ''
      },
      // 选择配送模式，如果为null激活个数加一，否则减一
      selectedDelivery(id){
        if (this.delivery_mode == null) {
          this.delivery_mode = id
          this.activity_num++
        } else if (this.delivery_mode == id) {
          this.delivery_mode = null
          this.activity_num--
        } else {
          this.delivery_mode = id
        }
      },
      // 筛选商家支持活动(可以多选)
      selectSupportIds(id, index){
        // 改变当前选中的support_ids.statu状态
        this.support_ids.splice(index, 1, {
          statu: !this.support_ids[index].statu,
          id
        })
        // 判断显示激活数量
        this.activity_num = this.delivery_mode == null ? 0 : 1
        this.support_ids.forEach(item => {
          if (item.statu) {
            this.activity_num++
          }
        })
      },
      //确定筛选内容, 收回列表
      confirmFilter(){
        this.statu_filter = !this.statu_filter
        this.sortBy = ''
      },
      //清空筛选选项
      clearFilter(){
        this.delivery_mode = 0
        this.support_ids.map(item => {
          item.statu = false
        })
        this.activity_num = 0
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .page{
    padding-top:1.62rem;
  }
  .sort-container{
    border-bottom:1px solid #f1f1f1;
    display: flex;
    width: 100%;
    z-index: 98;
    position: fixed;
    top: 1rem;
    .sort-item{
      flex: 1;
      .sort-header{
        position: relative;
        z-index: 88;
        background-color: #fff;
        padding:.1rem 0;
        border-right: 1px solid #f1f1f1;
        border-bottom:1px solid #f1f1f1;
        text-align: center;
        width: 100%;
        span{
          @include sc(.24rem, #666)
        }
        .sortTitle{
          @include sc(.24rem, $blue)
        }
      }
      .sort-item:nth-of-type(3){
        border-right: none;
      }
      .sort_icon{
        transition: all .2s;
      }
    }
    .chooseItem{
      color: $blue;
      .sort_icon{
        transition: all .2s;
        transform: rotate(180deg);
        fill: $blue;
      }
    }
    .food-type-container{
      position: absolute;
      overflow: hidden;
      background-color: #fff;
      display: flex;
      width: 100%;
      z-index: 60;
      .food-type-left{
        background-color: #f1f1f1;
        overflow-y: auto;
        height: 6.5rem;
        flex: 1;
        .food-list-ul{
          li{
            @include fj;
            line-height: .7rem;
            .foods-name{
              padding:0 .1rem;
              img{
                width: .3rem;
                vertical-align:middle;
                margin: 0 .1rem;
              }
              span{
                @include sc(.24rem, #666);
              }
            }
            .foods-count{
              span{
                @include sc(.24rem, #fff);
                background-color: #ccc;
                border-radius: .1rem;
                margin-right: .1rem;
              }
            }
          }
          .selected{
            background-color: #fff;
            color: $blue;
          }
        }
      }
      .food-type-right{
        background-color: #fff;
        flex: 1;
        overflow-y: auto;
        height: 6.5rem;
        .subFood-list-ul{
          li{
            @include fj;
            border-bottom:1px solid #eee;
            padding: .2rem .1rem;
            margin-left: .2rem;
            span{
              @include sc(.24rem, #666);
            }
          }
          .select_right_category{
            span{
              color: $blue;
            }
          }
        }
      }
    }
    .sort-type-container{
      background-color: #fff;
      width: 100%;
      position: absolute;
      top: .6rem;
      left: 0;
      z-index: 60;
      .sort-list-div{
        width: 100%;
        display: flex;
        align-items: center;
        .icon-default{
          @include wh(.3rem, .3rem);
          margin-left:.3rem;
          margin-right: .2rem;
        }
        .sort-inner-right{
          border-bottom: 1px solid #eee;
          padding:.3rem .1rem;
          @include fj;
          align-items: center;
          width: 100%;
          height: 100%;
          .icon-selected{
            @include wh(.3rem, .3rem);
          }
        }
        .selected{
          color: $blue;
        }
      }
    }
    .filter-container{
      position: absolute;
      width: 100%;
      background-color: #fff;
      left: 0px;
      top: .6rem;
      .filter-div{
        padding:.2rem;
        header{
          @include sc(.24rem, #666);
          margin-bottom:.2rem;
        }
        .multiple-choise{
          margin-top:.1rem;
          display: flex;
          flex-wrap:wrap;
          li{
            border:1px solid #f1f1f1;
            border-radius: 3px;
            padding:.06rem;
            width: 1.8rem;
            display: inline-block;
            display: flex;
            align-items: center;
            margin-right: .2rem;
            margin-bottom: .1rem;
            svg{
              @include wh(.3rem,.3rem);
              margin-right: .1rem;
            }
            span{
              @include sc(.24rem, #666);
            }
            .box-border{
              border:1px solid #eee;
              display: inline-block;
              border-radius: 3px;
              text-align: center;
            }
            .box-base{
              margin: 0 .1rem;
              @include wh(.4rem, .4rem)
            }
          }
          .activity_delivery{
            span{
              @include sc(.24rem, $blue);
            }
          }
        }
      }
    }
    .btn-box{
      padding: .2rem 0;
      background-color: #f2f2f2;
      display: flex;
      .btn-clear{
        flex: 1;
        background-color: #fff;
        border-radius: .1rem;
        padding:.2rem 0;
        @include sc(.36rem, #666);
        text-align: center;
        margin-left:.1rem;
        margin-right: .1rem;
      }
      .btn-confirm{
        flex: 1;
        background-color: $green;
        border-radius: .1rem;
        padding:.2rem 0;
        @include sc(.36rem, #fff);
        text-align: center;
        margin-left:.1rem;
        margin-right: .1rem;
      }
    }
  }

  .slideDown-enter-active, .slideDown-leave-active{
    transition: all .3s;
    opacity: 1;
  }
  .slideDown-enter, .slideDown-leave-active{
    transform: translateY(-100%);
    opacity: 0;
  }
  .back-cover{
    position: fixed;
    @include wh(100%, 100%);
    background:rgba(0, 0, 0, .3);
    z-index: 50;
  }
  .cover-enter-activer, .cover-leave-active{
    transition: all .3s;
    opacity: 1;
  }
  .cover-enter-activer, .cover-leave-active{
    opacity: 0;
  }
</style>
