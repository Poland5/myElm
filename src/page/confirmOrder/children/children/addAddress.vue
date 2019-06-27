<template>
  <div class="sub-page">
    <head-top goback="true" head-title="添加地址"></head-top>
    <section class="addAddress-container">
      <section class="form-group">
        <div class="left-txt">联系人</div>
        <div class="right-txt">
          <input type="text" v-model="name" class="form-input border-bottom" placeholder="姓名">
          <div class="form-choose">
            <div class="sex-box" @click="sex = 1">
              <svg class="select_icon" :class="{choosed:sex == 1}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>先生</span>
            </div>
            <div class="sex-box" @click="sex = 2">
              <svg class="select_icon" :class="{choosed:sex == 2}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>女士</span>
            </div>
          </div>
        </div>
      </section>
      <section class="form-group">
        <div class="left-txt">联系电话</div>
        <div class="right-txt">
          <div class="form-div">
            <input type="text" v-model="phone" class="form-input" placeholder="手机号码">
            <!-- <img src="../../../../images/add_phone.png" width="20" height="20" @click="show_bkPhone = true"> -->
          </div>
          <input class="form-input border-top" type="text" v-model="phone_bk" placeholder="备选电话" v-if="show_bkPhone">
        </div>
      </section>
      <section class="form-group">
        <div class="left-txt">送餐地址</div>
        <div class="right-txt">
          <router-link to="/confirmOrder/chooseAddress/addAddress/searchAddress">
            <div class="form-search border-bottom ellipsis">{{search_address ? search_address : '小区/写字楼/学校等'}}</div>
          </router-link>
          <input type="text" class="form-input" v-model="address_detail" placeholder="详细地址（如门牌号）">
        </div>
      </section>
      <section class="form-group">
        <div class="left-txt">标签</div>
        <div class="right-txt">
          <input type="text" class="form-input" v-model="tag" placeholder="无/家/学校/公司">
        </div>
      </section>
    </section>
    <section class="confirm-address" @click="confirmAddress">确定</section>
    <transition name="slide-right">
      <router-view></router-view>
    </transition>
    <alert-tips :alertTxt="alertTxt" v-if="showAlert" @closeTips="showAlert = false"></alert-tips>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import { postAddress } from '@/api/getData'
  import { mapState, mapMutations } from 'vuex';
  import alertTips from '@/components/alertTips'
  export default {
    data () {
      return {
        sex: 1,               // 默认选择男士
        name: null,           // 姓名
        phone: null,          // phone num
        address_detail: '',   // 详细地址
        tag: null,            // 标签
        show_bkPhone: false,  // 默认不显示备选电话
        phone_bk: '',         // 备选电话
        tag_type: 1,          // 标签类型，2:家，3:学校，4:公司
        alertTxt: '',
        showAlert: false,
      }
    },
    components: {
      headTop, alertTips
    },
    computed: {
      ...mapState([
        'userInfo', 'search_address', 'geohash'
      ]),
    },
    methods: {
      ...mapMutations([
        'CONFIRM_ADDRESS'
      ]),
      async confirmAddress(){
        if (!(this.userInfo&&this.userInfo.user_id)) {
          this.alertTxt = "请先登录";
          this.showAlert = true;
        } else if (!(this.name)) {
          this.alertTxt = "请输入姓名";
          this.showAlert = true;
        } else if(!(this.phone)) {
          this.alertTxt = "请输入手机号码";
          this.showAlert = true;
        } else if(/^[1][358][0-9]{9}$/.test(this.phone)) {
          this.alertTxt = "请输入正确的电话号码";
          this.showAlert = true;
        }
        else if (!(this.search_address)) {
          this.alertTxt = "请输入地址";
          this.showAlert = true;
        } else if (!(this.address_detail)) {
          this.alertTxt = "请输入详细地址";
          this.showAlert = true;
        }
        if (this.tag == 2) {
          this.tag_type = '家';
        } else if(this.tag == 3) {
          this.tag_type = '学校';
        } else if(this.tag == 4) {
          this.tag_type = '公司';
        }
        let res = await postAddress(this.userInfo.user_id, this.search_address, this.address_detail, this.geohash, this.name, this.phone, this.phone_bk, 0, this.sex, this.tag, this.tag_type)
        if (res.message) {
          // this.alertTxt = res.message;
          this.showAlert = true;
        } else {
          this.CONFIRM_ADDRESS(1);
          this.$router.go(-1);
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .sub-page{
    background-color: #f5f5f5;
  }
  .addAddress-container {
    background-color: #fff;
    padding:0 px2rem(12.5);
    .form-group {
      display: flex;
      border-bottom: 1px solid #f4f4f4;
      .left-txt {
        @include sc(px2rem(14), #333);
        flex: 1;
        height: px2rem(50);
        line-height: px2rem(50);
      }
      .right-txt {
        flex: 3;
        .form-div {
          @include fj;
          align-items: center;
        }
        .form-search {
          @include sc(px2rem(14), #666);
          padding: px2rem(14) 0;
        }
        .form-input {
          padding: px2rem(14) 0;
          font-size: px2rem(14);
          width: 100%;
        }
        .border-bottom {
          border-bottom: 1px solid #f4f4f4;
        }
        .border-top {
          border-top: 1px solid #f4f4f4;
        }
        .form-choose {
          height: px2rem(50);
          @include fc;
          .sex-box {
            @include fc;
            .select_icon {
              @include wh(px2rem(18), px2rem(18));
              margin-right: px2rem(5);
              fill: #666;
            }
            .choosed {
              fill: $green;
            }
            span:nth-of-type(1) {
              margin-right: px2rem(5);
            }
          }
        }
      }
    }
  }
  .confirm-address {
    @include sc(px2rem(16), #fff);
    background-color: $green;
    padding:px2rem(10) 0;
    border-radius: px2rem(5);
    width: 95%;
    margin: px2rem(12.5) auto;
    text-align: center;
  }
</style>
