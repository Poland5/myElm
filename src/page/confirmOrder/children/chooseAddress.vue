<template>
  <div class="sub-page">
    <section class="choose-address-wrap">
      <head-top goback="true" head-title="选择地址"></head-top>
      <section class="container-scroll">
        <ul class="choose-address-container">
          <li class="choose-address-li" :class="{selected:defaultIndex == index}" v-for="(item, index) in deliverable" :key="index" @click="choosedAddress(item, index)">
            <svg class="select_icon">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
            </svg>
            <div class="info">
              <p>
                <span class="name">{{item.name}}</span>
                <span>{{item.sex == 1 ? '先生' : '女士'}}</span>
                <span>{{item.phone}}</span>
              </p>
              <p>
                <span class="tag" :style="{backgroundColor:iconColor(item.tag)}">{{item.tag}}</span>
                <span>{{item.address_detail}}</span>
              </p>
            </div>
          </li>
        </ul>
      </section>
      <router-link to="/confirmOrder/chooseAddress/addAddress" class="add-new-address">
        <img src="../../../images/add_address.png" width="24" height="24">
        <span>新增收货地址</span>
      </router-link>
    </section>
    <router-view></router-view>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import { mapState, mapMutations } from 'vuex';
  import { getAddressList } from '@/api/getData'
  export default {
    data () {
      return {
        addressList: [],    //地址列表
        deliverable: [],    //有效地址列表
        deliverdisble: [],  //无效地址列表
      }
    },
    components: {
      headTop, 
    },
    computed: {
      ...mapState([
        'userInfo', 'addressIndex'
      ]),
      defaultIndex:function(){
        if(this.addressIndex){
          return this.addressIndex
        }else{
          return 0;
        }
      }
    },
    mounted () {
      this.initData();
    },
    methods: {
      ...mapMutations([
        'CHOOSE_ADDRESS'
      ]),
      async initData(){
        this.deliverable = [];
        this.deliverdisble = [];
        if(this.userInfo && this.userInfo.user_id){
          this.addressList = await getAddressList(this.userInfo.user_id);
          let res = await getAddressList(this.userInfo.user_id);
          res.forEach(item => {
            if(item.is_deliverable){
              this.deliverable.push(item);
            }else{
              this.deliverdisble.push(item);
            }
          })
        }
      },
      choosedAddress(address, index){
        this.CHOOSE_ADDRESS({address, index});
        this.$router.go(-1);
      },
      iconColor(value){
        switch(value){
          case '学校' : return '#3190e8';
          case '公司' : return '#4cd964';
        }
      }
    },
    // watch: {
    //   userInfo:function(value){
    //     if(value && value.user_id){
    //       this.initData();
    //     }
    //   }
    // }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .sub-page{
    z-index: 205;
    background-color: #fff;
  }
  .choose-address-container{
    background-color: #fff;
    .choose-address-li{
      border-bottom: 1px solid #f4f4f4;
      padding:.2rem .25rem;
      .select_icon{
        @include wh(.3rem, .3rem);
      }
    }
  }
  .add-new-address{
    position: fixed;
    bottom: 0;
    padding:.2rem 0;
    display: flex;
    align-items: center;
    left:50%;
    transform: translateX(-50%);
    span{
      @include sc(.3rem, $blue);
      margin-left: .1rem;
    }
  }
  .choose-address-container{
    .choose-address-li{
      display: flex;
      align-items: center;
      .select_icon{
        fill: #666;
      }
      .info{
        margin-left: .2rem;
        p{
          span{
            @include sc(.24rem, #666); 
          }
          .name{
            font-weight: bold;
            @include sc(.3rem, #666);
          }
          .tag{
            color: #fff;
            padding:0 .1rem;
            border-radius: 3px;
          }
        }
      }
    }
    .selected{
        .select_icon{
        fill: $green;
      }
    }
  }
</style>