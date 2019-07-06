<template>
  <div class="search-page">
    <section class="search-container">
      <div class="search-back" @click="goback()">
        <font-icon id="icon-back"></font-icon>
      </div>
      <form class="search-form">
        <font-icon id="icon-search"></font-icon>
        <input type="search" class="form-input" placeholder="请输入商家、商品名称" v-model="seachValue" @input="checkInput" ref="inputFocus">
        <button type="submit" class="btn-submit" @click.prevent="searchTarget('')">搜索</button>
      </form>
    </section>
    <ul class="search-list-ul" v-if="foodRestaurantsList.length">
      <router-link :to="{ path:'/shop', query:{ id:item.id } }" tag="li" v-for="(item, index) in foodRestaurantsList" :key="index" class="search-list-li">
        <section class="item-left">
          <img :src="imgBaseUrl + item.image_path" class="restaurant_img">
        </section>
        <section class="item-right">
          <div class="item-right-txt">
            <span>{{ item.name }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="14" class="pay_icon">
              <polygon points="0,14 4,0 24,0 20,14" style="fill:none;stroke:#FF6000;stroke-width:1" />
              <line x1="1.5" y1="12" x2="20" y2="12" style="stroke:#FF6000;stroke-width:1.5"/>
              <text x="3.5" y="9" style="fill:#FF6000;font-size:9;font-weight:bold;">支付</text>
            </svg>
            <p>月售 {{ item.month_sales||item.recent_order_num }} 单</p>
            <p>{{ item.delivery_fee||item.float_minimum_order_amount }} 元起送 / 距离{{ item.distance }}</p>
          </div>
          <ul class="item-right-detail">
            <li v-for="activities in item.activities" :key="activities.id">
              <span :style="{ backgroundColor: '#' + activities.icon_color }" class="activities_icon">{{ activities.icon_name }}</span>
              <span>{{ activities.name }}</span>
              <span class="only_phone">(手机客户端专享)</span>
            </li>
          </ul>
        </section>
      </router-link>
    </ul>
    <section class="search-history" v-if="historyList.length && showHistoryList">
      <header class="search-history-header">
        <span>历史搜索</span>
        <button @click="clearHistory">
          <font-icon id="icon-empty"></font-icon>
        </button>
      </header>
      <ul class="history-list-ul">
        <li v-for="(subItem, index) in historyList" :key="index">
          <span @click="searchTarget(subItem)">{{ subItem }}</span>
          <!-- <svg data-v-3726cde6="" xmlns="http://www.w3.org/2000/svg" version="1.1" class="delete_icon" @click="deleteHistory(index)">
            <line data-v-3726cde6="" x1="8" y1="8" x2="18" y2="18" style="stroke: rgb(153, 153, 153); stroke-width: 3;"></line>
            <line data-v-3726cde6="" x1="18" y1="8" x2="8" y2="18" style="stroke: rgb(153, 153, 153); stroke-width: 3;"></line>
          </svg> -->
        </li>
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
  import { mapState } from 'vuex'
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
    mounted() {
      this.$refs.inputFocus.focus()
      if(getStore('searchHistory')) {
        this.historyList = JSON.parse(getStore('searchHistory'))
      }
    },
    methods: {
      goback() {
        this.$router.go(-1)
      },
      async searchTarget(historyValue) {
        if (historyValue) {
          this.seachValue = historyValue
        } else if (!this.seachValue) {
          return
        }
        this.foodRestaurantsList = await searchFoodRestaurants(this.geohash, this.seachValue)
        this.emptyInfo = !this.foodRestaurantsList.length
        //搜索记录保存并判断搜索历史是否为空&重复
        let history = getStore('searchHistory')
        if (history) {
          let checkRepeat = false
          this.historyValue = JSON.parse(history)
          this.historyValue.forEach(item => {
            if(item === this.seachValue){
              checkRepeat = true
            }
          })
          if (!checkRepeat) {
            this.historyList.unshift(this.seachValue)
          }
        } else {
          this.historyList.unshift(this.seachValue)
        }
        this.showHistoryList = false
        setStore('searchHistory', this.historyList)
      },
      clearHistory() {
        this.historyList = []
        this.showHistoryList = false
      },
      // deleteHistory(index) {
      //   this.historyList.splice(index, 1)
      //   setStore('searchHistory', this.historyList)
      // },
      //搜索框为空时，显示历史搜索列表
      checkInput() {
        if (this.seachValue === '') {
          this.showHistoryList = true
          this.emptyInfo = false
          this.foodRestaurantsList = {}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';
  .search-page {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #fff;
    button {
      background-color: #fff;
    }
  }
  .search-container {
    .search-back {
      padding: px2rem(10);
      display: inline-block;
      .icon-back {
        @include sc(px2rem(24), #999);
      }
    }
    background-color: #fff;
    .search-form {
      position: relative;
      display: flex;
      padding:px2rem(10);
      text-align: center;
      .icon-search {
        position: absolute;
        top: px2rem(20);
        left: px2rem(20);
        @include sc(px2rem(14), #999);
      }
      .form-input {
        flex-grow: 1;
        background-color: #f2f2f2;
        border-radius: px2rem(1);
        padding:px2rem(8) px2rem(8) px2rem(8) px2rem(30);
      }
      .btn-submit {
        margin-left: px2rem(10);
        align-items: center;
        justify-content: center;
        background-color: #fff;
        @include sc(px2rem(14), $black);
        font-weight: bold;
      }
    }
  }
  .search-list-ul {
  background-color: #fff;
  padding-bottom:px2rem(50);
  .title_restaurant {
    @include sc(px2rem(12), #666);
    background-color: #eee;
    padding:px2rem(5) px2rem(10);
  }
  .search-list-li {
    border-bottom: 1px solid #f4f4f4;
    padding:px2rem(10);
    display: flex;
    .item-left {
      flex: 1;
      .restaurant_img {
        @include wh(px2rem(50), px2rem(50));
      }
    }
    .item-right {
      flex: 5;
      margin-left: px2rem(10);
      .item-right-txt {
        border-bottom: 1px solid #f4f4f4;
        padding-bottom: px2rem(5);
        span {
          @include sc(px2rem(12), #666);
        }
        p {
          @include sc(px2rem(12), #666);
        }
      }
      .item-right-detail {
        padding:px2rem(5) 0;
        span {
          @include sc(px2rem(12), #666);
        }
        .activities_icon {
          @include sc(px2rem(12), #fff);
          border-radius: 3px;
          padding:1px;
        }
        .only_phone {
          @include sc(px2rem(12), $orange)
        }
      }
    }
  }
}
.search-history {
  .search-history-header {
    padding:px2rem(10);
    @include fjc;
    span {
      @include sc(px2rem(16), #666);
      font-weight: 700;
    }
    .icon-empty {
      padding: px2rem(3);
      @include sc(px2rem(14), #cecece);
    }
  }
  .history-list-ul {
    background-color: #fff;
    padding: 0 px2rem(10);
    li {
      display: inline-block;
      margin-top: px2rem(15);
      margin-right: px2rem(15);
      padding: px2rem(10);
      border-radius: px2rem(3);
      background-color: #f7f7f7;
      span {
        @include sc(px2rem(14), #666);
      }
      .delete_icon {
        @include wh(px2rem(25), px2rem(25));
      }
    }
    .clear-history {
      @include sc(px2rem(12), $blue);
      justify-content: center;
    }
  }
}
.empty-info {
  padding: px2rem(10);
  background-color: #fff;
  margin-top: px2rem(5);
  text-align: center;
  @include sc(px2rem(12), #666);
}
</style>
