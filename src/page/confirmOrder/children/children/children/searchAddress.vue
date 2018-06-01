<template>
  <div class="sub-page">
    <head-top goback="true" head-title="搜索"></head-top>
    <section class="searchAddress-container">
      <section class="searchAddress-form">
        <input type="text" placeholder="请输入小区/写字楼/学校等" v-model="address">
        <div class="btn-search" @click="seachPlace">搜索</div>
      </section>
      <section class="tips" v-if="!searchAddressList.length">
        <p>找不到地址?</p>
        <p>尝试输入小区,写字楼和学校名</p>
        <p>详细地址(如门牌号)可稍后输入哦</p>
      </section>
      <ul class="addressList-ul" v-else>
        <li v-for="(item, index) in searchAddressList" :key="index" @click="choosedPlace(item)">
          <p class="title">{{item.name}}</p>
          <p class="address_detail">{{item.address}}</p>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import { searchNearBy } from '@/api/getData'
import { mapMutations } from 'vuex';
  export default {
    data () {
      return {
        address:null,
        searchAddressList:[],
      }
    },
    components: {
      headTop
    },
    methods: {
      ...mapMutations([
        'SAVE_SEARCH_ADDRESS'
      ]),
      async seachPlace(){
        if(this.address){
          this.searchAddressList = await searchNearBy(this.address);
        }
      },
      choosedPlace(item){
        this.SAVE_SEARCH_ADDRESS(item.name);
        this.$router.go(-1);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .sub-page{
    background-color: #fff;
  }
  .searchAddress-container{
    overflow-y: auto;
    .searchAddress-form{
      display: flex;
      padding:.3rem;
      input{
        background-color: #eee;
        border-radius: 3px;
        padding:.1rem;
        flex: 4;
      }
      .btn-search{
        flex: 1;
        @include sc(.24rem, #fff);
        padding:.1rem;
        border-radius: 3px;
        background-color: $blue;
        text-align: center;
        margin-left: .2rem;
      }
    }
    .tips{
      @include center;
      width: 100%;
      p{
        @include sc(.24rem, #999);
        text-align: center;
      }
    }
    .addressList-ul{
      padding:0 .25rem;
      li{
        border-bottom: 1px solid #eee;
        padding: .25rem 0;
        .title{
          @include sc(.3rem, #666);
        }
        .address_detail{
          @include sc(.28rem, #999);
        }
      }
    }
  }
</style>