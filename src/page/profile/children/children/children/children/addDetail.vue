<template>
<div class="fixed-page">
  <head-top goback="true" headTItle="搜索地址"></head-top>
  <section class="addDetail-section">
    <div class="addDetail-input">
      <input type="text" placeholder="请输入小区/写字楼/学校等" v-model="inputValue">
      <div class="btn-confirm" @click="searchNearBy">确定</div>
    </div>
    <div class="warning">为了满足商家的送餐要求，建议您从列表中选择地址</div>
    <div class="point" v-if="showAddressList">
      <p>找不到地址？</p>
      <p>请尝试输入小区、写字楼或学校名</p>
      <p>详细地址（如门牌号）可稍后输入哦。</p>
    </div>
    <ul v-else class="addressList-ul">
      <li v-for="(item,index) in addressList" @click="chooseAddress(item,index)" :key="index">
        <p>{{item.name}}</p>
        <p>{{item.address}}</p>
      </li>
    </ul>
  </section>
</div>
</template>
<script>
import headTop from '@/components/headTop'
import {searchNearBy} from '@/api/getData'
import {mapMutations} from 'vuex'
  export default {
  data () {
    return {
      inputValue:null,
      showAddressList: true,
      addressList:{}
    }
  },
  components: {
    headTop
  },
  
  methods: {
    ...mapMutations([
      'SAVE_ADDRESS'
    ]),
    async searchNearBy(){
      this.addressList = await searchNearBy(this.inputValue);
      if(this.addressList){
        this.showAddressList = false;
      }
    },
    chooseAddress(item,index){
      this.SAVE_ADDRESS(item.name);
      this.$router.go(-1);
    }
  }

}
</script>
<style lang="scss">
  @import 'src/style/mixin';
  .addDetail-section{
    .addDetail-input{
      padding: .2rem;
      background-color: #fff;
      display: flex;
      input{
        border-radius: .1rem;
        border:1px solid #ddd;
        background-color: #eee;
        padding:.15rem;
        flex: 3;
      }
      .btn-confirm{
        background-color: $blue;
        color: #fff;
        border-radius: .1rem;
        flex: 1;
        text-align: center;
        padding:.15rem 0;
        margin-left: .1rem;
      }
    }
    .warning{
      background: #fff6e4;
      color: #ff883f;
      text-align: center;
      padding:.1rem 0;
    }
    .point{
      text-align: center;
      @include center;
      width: 100%;
      p{
        @include sc(.35rem, #666);
        padding:.1rem 0;
      }
    }
    .addressList-ul{
      background-color: #fff;
      li{
        border-bottom:1px solid #e4e4e4;
        padding: .2rem;
        p{
          color: #969696;
        }
      }
    }
  }
 
</style>


