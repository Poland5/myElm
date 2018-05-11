<template>
  <div class="page">
    <head-top goback="true" :head-title="cityName">
      <router-link to="/home" slot="changeCity" class="change-city">切换城市</router-link>
    </head-top>
    <section class="city-form">
      <input type="text" placeholder="请输入学校、商务楼、地址" v-model="inputValue" class="city-input">
      <div class="btn-submit" @click="postAddress">提交</div>
    </section>
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
  import {mapState} from 'vuex'
  import {currentCity,searchAddress} from '@/api/getData'
  import {getStore, setStore} from '@/config/store'
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
      this.cityId = this.$route.params.cityId;
      currentCity(this.cityId).then(res => {
        this.cityName = res.name;
      });
      this.initData();
    },
    methods: {
      initData(){
        let history = getStore('historyPlace');
        if(history) {
          this.cityList = JSON.parse(history);
        }else{
          this.cityList = [];
        }
      },
      async postAddress(){
        this.cityList = await searchAddress(this.cityId, this.inputValue);
        if(this.cityList.length === 0){
          this.placeNone = true;
        }else{
          this.showHistoryList = true;
          this.placeNone = false;
        }
      },
      clearHistory(){
        this.cityList = [];
        this.showHistoryList = false;
      },
      nextPage(index, geohash){
        let history = getStore('historyPlace');
        let choosePlace = this.cityList[index];
        if(history){
          let cheackRepeat = false;
          this.historyPlace = JSON.parse(history);
          this.historyPlace.forEach(item => {
            if(item.geohash == history.geohash){
              cheackRepeat = true;
            }
          })
          if(!cheackRepeat){
            this.historyPlace.push(choosePlace);
          }
        }else{
          this.historyPlace.push(choosePlace);
        }
        setStore('historyPlace',this.historyPlace);
        this.$router.push({path:'/msite', query:{geohash}})
      }
    },
    watch: {
      userInfo:function(){
        this.initData();
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .change-city{
    @include sc(.3rem, #fff)
  }
  .city-form{
    background-color: #fff;
    padding:.2rem .3rem;
    .city-input{
      padding:.1rem;
      border:1px solid #e4e4e4;
      width: 100%;
    }
    .btn-submit{
      background-color: $blue;
      color: #fff;
      text-align: center;
      padding:.1rem 0;
      margin-top: .2rem;
    }
  }
  .city-history-section{
    border-top:2px solid #e4e4e4;
    header{
      @include sc(.2rem, #666);
      padding:0.05rem .2rem;
    }
    .city-list{
      background-color: #fff;
      li{
        padding:.3rem;
        border-bottom: 1px solid #eee;
        .city-title{
          @include sc(.3rem, #666);
          margin-bottom:.1rem;
        }
        .city-address{
          @include sc(.2rem, #999);
        }
      }
    }
    .clear-history{
      padding:.3rem;
      background-color: #fff;
      border-top: 2px solid #eee;
      @include sc(.3rem, #666);
      text-align: center;
    }
    .history-none{
      text-align: center;
      padding:.5rem 0;
      @include sc(.3rem, #999);
    }
  }
</style>