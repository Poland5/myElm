<template>
<div class="fixed-page">
  <head-top goback="true" headTitle="编辑地址">
    <span slot="edit" @click="switchType">{{editText}}</span>
  </head-top>
  <ul class="address-list">
    <li v-for="(item,index) in addressList" :key="index">
      <div>
        <p>{{ item.address }}</p>
        <p>{{ item.phone }}</p>
      </div>
      <span v-if="deletedLi" @click="deleteList(item,index)">X</span>
    </li>
  </ul>
  <router-link to="/profile/info/address/add" class="add-address">新增地址</router-link>
  <router-view></router-view>
</div>
</template>
<script>
import headTop from '@/components/headTop'
import { getAddressList, deleteAddress } from '@/api/getData'
import { mapState } from 'vuex';
  export default {
  data () {
    return {
      editText: '编辑',
      user_id:'',
      addressList: [],
      deletedLi:false,  //删除列表
    }
  },
  components: {
    headTop
  },
  mounted() {
    if (this.userInfo && this.userInfo.user_id) {
      this.initData();
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods:{
    switchType(){
      if (this.editText == '编辑') {
        this.editText = '完成',
        this.deletedLi = true
      } else {
        this.editText = '编辑',
        this.deletedLi = false
      }
    },
    async initData() {
      this.addressList = await getAddressList(this.userInfo.user_id);
    },
    deleteList(item,index) {
      if (this.userInfo && this.userInfo.user_id) {
        deleteAddress(this.userInfo.user_id, item.id);
        this.addressList.splice(index, 1);
      }
    }
  },
  watch: {
    userInfo: function() {
      this.initData();
    }
  }
}
</script>
<style lang="scss">
  @import 'src/style/mixin';
  .address-list {
    border-top:1px solid #e4e4e4;
    margin-top: .2rem;
    li {
      border-bottom: 1px solid #e4e4e4;
      padding:.2rem;
      background-color: #fff;
      @include fjc;
    }
  }
  .add-address {
    display: block;
    border-top:1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    padding:.2rem;
    background-color: #fff;
    margin-top: .2rem;
  }
</style>


