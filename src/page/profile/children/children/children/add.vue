<template>
  <div class="fixed-page">
    <head-top goback="true" headTitle="新增地址"></head-top>
    <form class="address-form">
      <div class="formblock">
        <input type="text" placeholder="请填写你的姓名" v-model="name">
      </div>
      <div class="formblock">
        <router-link to="/profile/info/address/add/addDetail">
          <input type="text" placeholder="小区/写字楼/学校等" v-model="addAddress">
        </router-link>
      </div>
      <div class="formblock">
          <input type="text" placeholder="请填写详细送餐地址" v-model="address_detail">
      </div>
      <div class="formblock">
        <input type="text" placeholder="请填写能够联系到您的手机号" v-model="phone">
      </div>
      <div class="formblock">
        <input type="text" placeholder="备用联系电话（选填）" v-model="phone_bk">
      </div>
    </form>
    <section class="btn-addAddress">
      <span :class="{ 'autoOpacity': ischeck }">新增地址</span>
    </section>
    <router-view></router-view>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import { mapState } from 'vuex';
  export default {
    data () {
      return {
        name:'',
        ischeck: false,
        address_detail: '',
        phone: '',
        phone_bk: ''
      }
    },
    components: {
      headTop
    },
    computed: {
      ...mapState([
        'addAddress'
      ]),
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .address-form{
    margin-top: .2rem;
    background-color: #fff;
    padding:.2rem;
    .formblock{
      margin-bottom: .2rem;
      input{
        padding:.15rem;
        border:1px solid #ddd;
        border-radius: .1rem;
        width: 100%;
        background-color: #eee;
      }
      a{
        @include wh(100%, 100%)
      }
    }
  }
  .btn-addAddress{
    background-color: $green;
    padding: .2rem 0;
    margin: .2rem;
    text-align: center;
    span{
      color:#fff;
      opacity: .7;
      transition: all .4s;
    }
    .autoOpacity{
      opacity: 1;
      transition: all .4s;
    }
  }
</style>


