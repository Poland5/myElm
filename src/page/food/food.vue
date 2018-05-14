<template>
  <div class="page">
    <head-top goback="true" :head-title="headTitle"></head-top>
    <section class="sort-container">
      <section class="sort-item">
        <header class="sort-header" :class="{chooseItem:sortType == 'food'}" @click="chooseType('food')">
          <span class="sort-title">{{foodTitle}}</span>
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
            <polygon points="0,3 10,3 5,8"/>
          </svg>
        </header>
        <transition name="slideDown">
          <section class="food-type-container" v-if="sortType == 'food'">
            <section class="food-type-left">
              <ul class="food-list-ul">
                <li v-for="(item,index) in foodsType" :key="index" :class="{selected:restuarant_category_id == item.id}" @click="selectedType(index,item.id)">
                  <div class="foods-name">
                    <img :src="getImgPath(item.image_url)" v-if="index">
                    {{item.name}}
                  </div>
                  <div class="foods-count">
                    <span>
                      {{item.count}} 
                    </span>
                    <svg v-if="index" width="8" height="8" xmlns="http://www.w3.org/2000/svg" version="1.1" class="category_arrow">
                      <path d="M0 0 L6 4 L0 8"  stroke="#bbb" stroke-width="1" fill="none"/>
                    </svg>
                  </div>
                </li>
              </ul>
            </section>
            <section class="food-type-right">
              <ul class="subFood-list-ul">
                <li v-for="(subItem, subIndex) in subfoodsType" :key="subIndex" v-if="subIndex" @click="getFoodCategory(subItem.id, subItem.name)">
                  <span>{{subItem.name}}</span>
                  <span>{{subItem.count}}</span>
                </li> 
              </ul>
            </section>
          </section>
        </transition>
      </section>
      <section class="sort-item">
        <header class="sort-header" :class="{chooseItem:sortType == 'sort'}" @click="chooseType('sort')">
          <span class="sort-title">排序</span>
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
            <polygon points="0,3 10,3 5,8"/>
          </svg>
        </header>
        <transition name="slideDown">
          <section v-if="sortType == 'sort'" class="sort-type-container">
            <div class="sort-list-div" @click="sortList($event)">
              <svg class="icon-default">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#default"></use>
              </svg>
              <p data="4" class="sort-inner-right" @click="sortByType = '4'" :class="{selected:sortByType == '4'}">
                <span>智能排序</span>
                <svg class="icon-selected" v-if="sortByType == 4">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                </svg>
              </p>
            </div>
            <div class="sort-list-div" @click="sortList($event)">
              <svg class="icon-default">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#distance"></use>
              </svg>
              <p data="5" class="sort-inner-right" @click="sortByType = '5'" :class="{selected:sortByType == '5'}">
                <span>最近距离</span>
                <svg class="icon-selected" v-if="sortByType == 5">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                </svg>
              </p>
            </div>
            <div class="sort-list-div" @click="sortList($event)">
              <svg class="icon-default">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hot"></use>
              </svg>
              <p data="6" class="sort-inner-right" @click="sortByType = '6'" :class="{selected:sortByType == '6'}">
                <span>销量最高</span>
                <svg class="icon-selected" v-if="sortByType == 6">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                </svg>
              </p>
            </div>
            <div class="sort-list-div" @click="sortList($event)">
              <svg class="icon-default">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#price"></use>
              </svg>
              <p data="1" class="sort-inner-right" @click="sortByType = '1'" :class="{selected:sortByType == '1'}">
                <span>起送价最低</span>
                <svg class="icon-selected" v-if="sortByType == 1">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                </svg>
              </p>
            </div>
            <div class="sort-list-div" @click="sortList($event)">
              <svg class="icon-default">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#speed"></use>
              </svg>
              <p data="2" class="sort-inner-right" @click="sortByType = '2'" :class="{selected:sortByType == '2'}">
                <span>配送速度最快</span>
                <svg class="icon-selected" v-if="sortByType == 2">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                </svg>
              </p>
            </div>
            <div class="sort-list-div" @click="sortList($event)">
              <svg class="icon-default">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rating"></use>
              </svg>
              <p data="3" class="sort-inner-right" @click="sortByType = '3'" :class="{selected:sortByType == '3'}">
                <span>评分最高</span>
                <svg class="icon-selected" v-if="sortByType == 3">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                </svg>
              </p>
            </div>
          </section>
        </transition>
      </section>
      <section class="sort-item">
        <header class="sort-header" :class="{chooseItem:sortType == 'filter'}" @click="chooseType('filter')">
          <span class="sort-title">筛选</span>
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
            <polygon points="0,3 10,3 5,8"/>
          </svg>
        </header>
        <transition name="slideDown">
          <section class="filter-container" v-if="sortType == 'filter'">
            <div class="filter-div">
              <header>配送方式</header>
              <ul class="multiple-choise">
                <li v-for="(item,index) in delivery_mode" :class="{activity_delivery:delivery_id == item.id}" :key="index" @click="selectedDelivery(item.id)">
                  <svg>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="delivery_id == item.id ? '#selected' : '#fengniao'"></use>
                  </svg>
                  <span>{{item.text}}</span>
                </li>
              </ul>
            </div>
            <div class="filter-div">
              <header>商家属性(可以多选)</header>
              <ul class="multiple-choise">
                <li v-for="(item,index) in restuarant_activityList" :key="index" @click="selectedActivityList(item.id, index)">
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
    <transition name="cover">
      <div class="back-cover" v-show="sortType"></div>
    </transition>
    <div class="shoplist-container">
      <shopList :geohash="geohash" :restuarantCategoryIds="restuarant_category_ids" :orderBy="sortByType" :deliveryMode="delivery_id" :supportIds="support_ids" :statuFilter="statu_filter"></shopList>
    </div>
  </div>
</template> 
<script>
  import headTop from '@/components/headTop'
  import {foodCategory, deliveryMode, activityAttributesList} from '@/api/getData'
  import {getImgPath} from '@/components/mixins'
  import shopList from '@/components/shopList'
  export default {
    data () {
      return {
        geohash:'',
        headTitle: '',      //头部名称
        foodTitle: '',      //食品分类名称
        sortType:'',        //排序类型
        sortByType:'',      //选择排序
        foodsType:null,     //所有商铺分类列表
        subfoodsType: null, //子类分类列表
        restuarant_category_id:null,   //商品分类
        restuarant_category_ids: null, //商品分类对应的食物ID
        showBG:false,  //黑色背景色
        delivery_mode:null, //配送方式
        delivery_id:null, //配送ID
        restuarant_activityList:null,  //商家属性激活列表
        activity_id:null, //激活ID
        activity_num:0, //激活个数
        support_ids:[], //设置 激活的属性ID/及判断是否选中的参数
        statu_filter:false, //同步筛选
      }
    },
    components: {
      headTop,
      shopList
    },
    mixins: [getImgPath],
    created(){
      this.headTitle = this.$route.query.title;
      this.geohash = this.$route.query.geohash;
      this.foodTitle = this.headTitle;
    },
    mounted () {
      this.initData();
    },
    methods: {
      async initData(){
        this.foodsType = await foodCategory();
          this.foodsType.forEach((item, index) => {
            this.subfoodsType = item.sub_categories;
        });
        this.delivery_mode = await deliveryMode();
        this.restuarant_activityList = await activityAttributesList();
        this.restuarant_activityList.forEach((item,index) => {
          this.support_ids[index] = {statu:false, id:item.id}
        })
      },
      chooseType(type){
        if(this.sortType !== type){
          this.sortType = type;
          if(this.foodsType == 'food'){
            this.foodTitle = '分类';
          }else{
            this.foodTitle = this.headTitle;
          }
        }else{
          this.sortType = '';
        }
      },
      selectedType(index, id){
        this.restuarant_category_id = id;
        this.subfoodsType = this.foodsType[index].sub_categories;
      },
      //食物筛选
      getFoodCategory(id,name){
        this.restuarant_category_ids = id;
        this.foodTitle = this.headTitle = name;
        this.sortType = '';
      },
      sortList(event){
        let node;
        if(event.target.nodeName.toUpperCase() !== 'P'){
          node = event.target.parentNode;
        }else{
          node = event.target
        }
        this.sortByType = node.getAttribute('data');
        this.sortType = '';
      },
      selectedDelivery(id){
        this.delivery_id = id;
      },
      selectedActivityList(id,index){
        this.support_ids.splice(index,1,{statu:!this.support_ids[index].statu,id:id});
        if(this.support_ids[index].statu){
          this.activity_num++;
        }else{
          this.activity_num--;
        }
      },
      //确定筛选内容
      confirmFilter(){
        this.statu_filter = !this.statu_filter;
        this.sortType = '';
      },
      //清空筛选选项
      clearFilter(){
        this.delivery_id = 0;
        this.support_ids.map(item => {
          item.statu = false
        })
        this.activity_num = 0;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .page{
    padding-top:1rem;
  }
  .sort-container{
    border-bottom:1px solid #f1f1f1;
    display: flex;
    width: 100%;
    z-index: 98;
    position: relative;
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
        .sort-title{
          @include sc(.24rem, #666)
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
              @include sc(.24rem, #666);
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
    transition: all .5s;
    opacity: 1;
  }
  .slideDown-enter, .slideDown-leave-active{
    transform: translateY(-10rem);
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