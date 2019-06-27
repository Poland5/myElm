<template>
  <div class="sub-page">
    <head-top goback="true" head-title="搜索地址"></head-top>
    <section class="searchAddress-container">
      <section class="searchAddress-form">
        <input class="text" type="text" placeholder="请输入小区/写字楼/学校等" v-model="address">
        <button class="btn-search" @click="seachPlace">搜索</button>
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
      async seachPlace() {
        if(this.address){
          this.searchAddressList = await searchNearBy(this.address)
        }
      },
      choosedPlace(item) {
        this.SAVE_SEARCH_ADDRESS(item.name)
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .sub-page{
    background-color: #fff;
  }
  .searchAddress-container {
    overflow-y: auto;
    .searchAddress-form {
      @include fc;
      padding: px2rem(10) px2rem(15);
      .text {
        background-color: #eee;
        border-radius: px2rem(3);
        padding: px2rem(10);
        flex: 1;
      }
      .btn-search {
        @include wh(px2rem(50), px2rem(36)) ;
        @include sc(px2rem(14), #fff);
        border-radius: 3px;
        background-color: $blue;
        text-align: center;
        margin-left: px2rem(10);
      }
    }
    .tips {
      @include center;
      width: 100%;
      p {
        @include sc(px2rem(12), #999);
        text-align: center;
      }
    }
    .addressList-ul {
      padding:0 px2rem(12.5);
      li {
        border-bottom: 1px solid #eee;
        padding: px2rem(12.5) 0;
        .title {
          @include sc(px2rem(15), #666);
        }
        .address_detail {
          @include sc(px2rem(14), #999);
        }
      }
    }
  }
</style>
