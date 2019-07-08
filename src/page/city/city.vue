<template>
  <div class="page">
    <head-top goback="true" :head-title="cityName">
      <router-link to="/home" slot="changeCity" class="change-city">切换城市</router-link>
    </head-top>
    <form class="city-form">
      <input type="search" placeholder="输入学校、商务楼、地址" v-model="inputValue" class="city-input" required>
      <button type="button" class="btn-submit" @click="postAddress" value="提交">提交</button>
    </form>
    <section class="city-history-section">
      <header v-if="!showHistoryList">搜索历史</header>
      <ul class="city-list">
        <li v-for="(item,index) in cityList" :key="index" @click="nextPage(index, item.geohash)">
          <p class="city-title">{{item.name}}</p>
          <p class="city-address">{{item.address}}</p>
        </li>
      </ul>
      <footer v-if="cityList.length" class="clear-history" @click="clearHistory">清空所有</footer>
      <div v-if="placeNone" class="history-none">无搜索结果</div>
    </section>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import { mapState, mapMutations } from 'vuex'
  import { currentCity, searchAddress } from '@/api/getData'
  import { getStore, setStore, clearStore } from '@/config/store'
  export default {
    data () {
      return {
        cityId:'',        //城市ID
        cityName:'',      //城市名称
        inputValue:'',    //输入地址
        placeNone:false,  //无搜索结果
        historyPlace:[],  //历史记录
        cityList:[],    //城市列表
        showHistoryList:false //显示城市列表
      }
    },
    components: {
      headTop
    },
    mounted () {
      this.cityId = this.$route.params.cityId
      currentCity(this.cityId).then(res => {
        this.cityName = res.name
      })
      this.initData()
    },
    methods: {
      ...mapMutations([
        'SAVE_GEOHASH'
      ]),
      initData() {
        let history = getStore('historyPlace')
        if (history) {
          this.cityList = JSON.parse(history)
        } else {
          this.cityList = []
        }
      },
      async postAddress() {
        if (this.inputValue) {
          this.cityList = await searchAddress(this.cityId, this.inputValue)
          this.showHistoryList = true
          this.placeNone = this.cityList.length ? false : true
        }
      },
      clearHistory() {
        clearStore('historyPlace')
        this.initData()
      },
      nextPage(index, geohash) {
        let history = getStore('historyPlace')
        let choosePlace = this.cityList[index]
        if (history) {
          let cheackRepeat = false
          this.historyPlace = JSON.parse(history)
          this.historyPlace.forEach(item => {
            if (item.geohash == choosePlace.geohash) {
              cheackRepeat = true
            }
          })
          if (!cheackRepeat) {
            this.historyPlace.push(choosePlace)
          }
        } else {
          this.historyPlace.push(choosePlace)
        }
        setStore('historyPlace', this.historyPlace)
        this.SAVE_GEOHASH(geohash)
        this.$router.push({ path:'/msite', query:{ geohash } })
      }
    },
    watch: {
      userInfo: function() {
        this.initData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .change-city {
    margin-right: px2rem(15);
    @include sc(px2rem(15), #fff);
  }
  .page {
    padding-top: px2rem(45);
  }
  .city-form {
    background-color: #fff;
    padding:px2rem(10) px2rem(15);
    .city-input {
      padding:px2rem(5);
      border:1px solid #e4e4e4;
      width: 100%;
      font-size: px2rem(16);
    }
    .btn-submit {
      background-color: $blue;
      color: #fff;
      text-align: center;
      margin-top: px2rem(10);
      width: 100%;
      height: px2rem(32);
      line-height: px2rem(32);
      font-size: px2rem(16);
    }
  }
  .city-history-section {
    border-top:2px solid #e4e4e4;
    header {
      @include sc(px2rem(10), #666);
      padding:0.05rem px2rem(10);
    }
    .city-list{
      background-color: #fff;
      li{
        padding:px2rem(15);
        border-bottom: 1px solid #eee;
        .city-title{
          @include sc(px2rem(15), #666);
          margin-bottom:px2rem(5);
        }
        .city-address{
          @include sc(px2rem(10), #999);
        }
      }
    }
    .clear-history{
      padding:px2rem(15);
      background-color: #fff;
      border-top: 2px solid #eee;
      @include sc(px2rem(15), #666);
      text-align: center;
    }
    .history-none{
      text-align: center;
      padding: px2rem(25) 0;
      @include sc(px2rem(15), #999);
    }
  }
</style>
