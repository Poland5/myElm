<template>
  <div class="sub-page">
    <section class="choose-address-wrap">
      <head-top goback="true" head-title="选择地址"></head-top>
      <section class="container-scroll">
        <section>
          <ul class="choose-address-container">
            <li class="choose-address-li" :class="{ selected:defaultIndex == index }" v-for="(item, index) in deliverable" :key="index" @click="choosedAddress(item, index)">
              <div class="select-div">
                <svg class="select_icon" v-if="defaultIndex == index">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                </svg>
              </div>
              <div class="info">
                <p class="address-title">
                  <span class="name">{{ item.name }}</span>
                  <span>{{ item.sex == 1 ? '先生' : '女士' }}</span>
                  <span>{{ item.phone }}</span>
                </p>
                <p class="address-detail">
                  <span class="address-tag" :style="{ borderColor: iconColor(item.tag), color: iconColor(item.tag) }">{{ item.tag }}</span>
                  <span class="address-text">{{ item.address }}{{ item.address_detail }}</span>
                </p>
              </div>
              <div class="deleted" @click.stop="deleteAddresList(item, index)">
                <font-icon id="icon-delete"></font-icon>
              </div>
            </li>
          </ul>
        </section>
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
  import { mapState, mapMutations } from 'vuex'
  import { getAddressList, deleteAddress } from '@/api/getData'
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
        'userInfo', 'addressIndex', 'newAddress'
      ]),
      defaultIndex: function () {
        if (this.addressIndex) {
          return this.addressIndex
        } else {
          return 0
        }
      }
    },
    methods: {
      ...mapMutations([
        'CHOOSE_ADDRESS'
      ]),
      async initData() {
        this.deliverable = []
        this.deliverdisble = []
        if (this.userInfo && this.userInfo.user_id) {
          this.addressList = await getAddressList(this.userInfo.user_id)
          this.addressList.forEach(item => {
            if (item.is_deliverable) {
              this.deliverable.push(item)
            } else {
              this.deliverdisble.push(item)
            }
          })
        }

      },
      async deleteAddresList(item, index) {
        let res = await deleteAddress(item.user_id, item.id)
        this.addressList.splice(index, 1)
        if (res.status == 1) {
          this.initData()
        }
      },
      choosedAddress(address, index) {
        this.CHOOSE_ADDRESS({ address, index })
        this.$router.go(-1)
      },
      iconColor(value) {
        switch(value){
          case '家' : return '#ff5722'
          case '学校' : return '#3190e8'
          case '公司' : return '#4cd964'
        }
      }
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id) {
          this.initData()
        }
      },
      newAddress: function (value) {
        if (value) {
          this.initData()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .sub-page {
    z-index: 205;
    background-color: $bgGray;
  }
  .container-scroll {
    padding-bottom: px2rem(100);
  }
  .choose-address-container {
    background-color: #fff;
    .choose-address-li {
      border-bottom: 1px solid #f4f4f4;
      padding:px2rem(10) .25rem;
      .select-div {
        display: flex;
        width: px2rem(30);
        align-items: center;
        justify-content: flex-end;
        .select_icon {
          @include wh(px2rem(20), px2rem(22));
        }
      }
    }
  }
  .add-new-address {
    position: fixed;
    bottom: 0;
    padding:px2rem(14) 0;
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #fff;
    justify-content: center;
    border-top: 1px solid #ddd;
    span {
      @include sc(px2rem(15), $blue);
      margin-left: px2rem(5);
    }
  }
  .choose-address-container {
    .choose-address-li {
      display: flex;
      align-items: center;
      .select_icon {
        fill: #666;
      }
      .info {
        flex-grow: 1;
        margin-left: px2rem(10);
        .address-title {
          span {
            @include sc(px2rem(14), #666);
          }
          .name {
            font-weight: bold;
            @include sc(px2rem(18), #666);
          }
        }
        .address-detail {
          display: flex;
          @include fc;
          text-align: left;
          .address-tag {
            display: inline-block;
            transform: scale(.7) translateX(px2rem(-1));
            line-height: px2rem(16);
            padding: px2rem(1);
            border: 1px solid #eee;
            color: #fff;
            font-size: px2rem(14);
            white-space: nowrap;
          }
          .address-text {
            display: inline-block;
            font-size: px2rem(14);
            color: #666;
          }
        }
      }
      .deleted {
        .icon-delete {
          @include sc(px2rem(24), #999);
        }
      }
    }
    .selected {
        .select_icon {
          fill: $green;
      }
    }
  }
</style>
