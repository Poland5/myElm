<template>
  <div class="page">
    <head-top goback="true" head-title="搜索"></head-top>
    <section class="search-container">
      <form class="search-form">
        <input class="form-input" placeholder="请输入商家或者美食名称" v-model="seachValue" @input="checkInput">
        <div class="btn-submit" @click.prevent="searchTarget('')">提交</div>
      </form>
    </section>
    <ul class="search-list-ul" v-if="foodRestaurantsList.length">
      <h4 class="title_restaurant">商家</h4>
      <router-link :to="{path:'/shop', query:{id:item.id}}" tag="li" v-for="(item, index) in foodRestaurantsList" :key="index" class="search-list-li">
        <section class="item-left">
          <img :src="imgBaseUrl + item.image_path" class="restaurant_img">
        </section>
        <section class="item-right">
          <div class="item-right-txt">
            <span>{{item.name}}</span>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="14" class="pay_icon">
              <polygon points="0,14 4,0 24,0 20,14" style="fill:none;stroke:#FF6000;stroke-width:1" />
              <line x1="1.5" y1="12" x2="20" y2="12" style="stroke:#FF6000;stroke-width:1.5"/>
              <text x="3.5" y="9" style="fill:#FF6000;font-size:9;font-weight:bold;">支付</text>
            </svg>
            <p>月售 {{item.month_sales||item.recent_order_num}} 单</p>
            <p>{{item.delivery_fee||item.float_minimum_order_amount}} 元起送 / 距离{{item.distance}}</p>
          </div>
          <ul class="item-right-detail">
            <li v-for="activities in item.activities" :key="activities.id">
              <span :style="{backgroundColor: '#' + activities.icon_color}" class="activities_icon">{{activities.icon_name}}</span>
              <span>{{activities.name}}</span>
              <span class="only_phone">(手机客户端专享)</span>
            </li>
          </ul>
        </section>
      </router-link>
    </ul>
    <section class="search-history" v-if="historyList.length&&showHistoryList">
      <h4>搜索历史</h4>
      <ul class="history-list-ul">
        <li v-for="(subItem, index) in historyList" :key="index">
          <span @click="searchTarget(subItem)">{{subItem}}</span>
          <svg data-v-3726cde6="" xmlns="http://www.w3.org/2000/svg" version="1.1" class="delete_icon" @click="deleteHistory(index)">
            <line data-v-3726cde6="" x1="8" y1="8" x2="18" y2="18" style="stroke: rgb(153, 153, 153); stroke-width: 3;"></line> 
            <line data-v-3726cde6="" x1="18" y1="8" x2="8" y2="18" style="stroke: rgb(153, 153, 153); stroke-width: 3;"></line>
          </svg>
        </li>
        <li class="clear-history" @click="clearHistory">清空历史记录</li>
      </ul>
    </section>
    <div class="empty-info" v-if="emptyInfo">很抱歉! 无搜索结果</div>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import footGuide from '@/components/footGuide'
  import { imgBaseUrl } from '@/config/env'
  import { searchFoodRestaurants } from '@/api/getData'
  import {getStore, setStore} from '@/config/store'
  import { mapState } from 'vuex';
  export default {
    data () {
      return {
        seachValue: '',           //输入商家食品
        foodRestaurantsList: {},  //商家食品列表
        imgBaseUrl,
        emptyInfo:false,          //搜索结果为空
        historyList: [],          //搜索历史列表
        showHistoryList: true,   //显示历史列表
      }
    },
    components: {
      headTop, footGuide
    },
    computed: {
      ...mapState([
        'geohash'
      ]),
    },
    mounted () {
      if(getStore('searchHistory')){
        this.historyList = JSON.parse(getStore('searchHistory'));
      }
    },
    methods: {
      async searchTarget(historyValue){
        if(historyValue){
          this.seachValue = historyValue;
        }
        this.foodRestaurantsList = await searchFoodRestaurants(this.geohash, this.seachValue);
        this.emptyInfo = !this.foodRestaurantsList.length;

        //搜索记录保存并判断搜索历史是否为空&重复
        let history = getStore('searchHistory');
        if(history){
          let isRepeat = false;
          this.historyValue = JSON.parse(history);
          this.historyValue.forEach(item => {
            if(item === this.seachValue){
              isRepeat = true;
            }
          })
          if(!isRepeat){
            this.historyList.push(this.seachValue);
          }
        }else{
          this.historyList.push(this.seachValue);
        }
        this.showHistoryList = false;
        setStore('searchHistory', this.historyList);
      },
      clearHistory(){
        this.historyList = [];
        this.showHistoryList = false;
      },
      deleteHistory(index){
        this.historyList.splice(index, 1);
        setStore('searchHistory', this.historyList);
      },
      //搜索框为空时，显示历史搜索列表
      checkInput(){
        if(this.seachValue === ''){
          this.showHistoryList = true;
          this.emptyInfo = false;
          this.foodRestaurantsList = {};
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .search-container{
    background-color: #fff;
    padding:.2rem;
    .search-form{
      display: flex;
      text-align: center;
      .form-input{
        flex: 3;
        background-color: #f2f2f2;
        border:1px solid #e4e4e4;
        border-radius: 3px;
        padding:.1rem;
      }
      .btn-submit{
        flex: 1;
        margin-left: .1rem;
        background-color: $blue;
        border-radius: 3px;
        @include sc(.24rem, #fff);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .search-list-ul{
  background-color: #fff;
  padding-bottom:1rem;
  .title_restaurant{
    @include sc(.24rem, #666);
    background-color: #eee;
    padding:.1rem .2rem;
  }
  .search-list-li{
    border-bottom: 1px solid #f4f4f4;
    padding:.2rem;
    display: flex;
    .item-left{
      flex: 1;
      .restaurant_img{
        @include wh(1rem, 1rem);
      }
    }
    .item-right{
      flex: 5;
      margin-left: .2rem;
      .item-right-txt{
        border-bottom: 1px solid #f4f4f4;
        padding-bottom: .1rem;
        span{
          @include sc(.24rem, #666);
        }
        p{
          @include sc(.24rem, #666);
        }
      }
      .item-right-detail{
        padding:.1rem 0;
        span{
          @include sc(.24rem, #666);
        }
        .activities_icon{
          @include sc(.24rem, #fff);
          border-radius: 3px;
          padding:1px;
        }
        .only_phone{
          @include sc(.24rem, $orange)
        }
      }
    }
  }
}
.search-history{
  h4{
    padding:.2rem;
    @include sc(.24rem, #666);
  }
  .history-list-ul{
    background-color: #fff;
    li{
      padding:0 .2rem;
      border-bottom: 1px solid #f4f4f4;
      @include fj;
      align-items: center;
      height: .8rem;
      span{
        @include sc(.3rem, #666);
        width: 80%;
        height: .8rem;
        display: flex;
        align-items: center;
      }
      .delete_icon{
        @include wh(.5rem, .5rem);
      }
    }
    .clear-history{
      @include sc(.24rem, $blue);
      justify-content: center;
    }
  }
}
.empty-info{
  padding: .2rem;
  background-color: #fff;
  margin-top: .1rem;
  text-align: center;
  @include sc(.24rem, #666);
}
</style>