<template>
  <div class="page">
    <head-top goback="true" head-title="我的优惠"></head-top>
    <section v-if="showLoading">
      <section class="category-title">
        <span :class="{choosed:categoryType === 1}" @click="categoryType = 1">红包</span>
        <span :class="{choosed:categoryType === 2}" @click="categoryType = 2">商家代金券</span>
      </section>
      <transition name="fade">
        <section v-if="categoryType === 1" class="hongbao-container">
          <header>
            <span>有<i>{{hongbaoList.length}}</i>个红包即将到期</span>
            <router-link to="/benefit/description"><i class="icon iconfont icon-help icon-small"></i>红包说明</router-link>
          </header>
          <ul class="hongbao-list-ul">
            <li class="honbbao-list-li" v-for="(item, index) in hongbaoList" :key="index">
              <section class="hongbao-item">
                <div class="item-left">
                  <div class="text">
                    <span>￥</span>
                    <span>{{String(item.amount).split('.')[0]}}</span>
                    <span>.</span>
                    <span>{{String(item.amount).split('.')[1]||0}}</span>
                  </div>
                  <p class="description">满20元可用</p>
                </div>
                <div class="item-right">
                  <p>{{item.name}}</p>
                  <p>{{item.end_date}}到期</p>
                  <p>限收货手机为{{item.phone}}</p>
                </div>
                <div class="last-time">{{item.description_map.validity_delta}}</div>
              </section>
              <footer class="item-footer" v-if="item.limit_map">
                {{item.limit_map.restaurant_flavor_ids}}
              </footer>
            </li>
          </ul>
          <router-link to="/benefit/hbHistory" class="check-history">查看历史红包></router-link>
        </section>
      </transition>
      <transition name="fade">
        <section v-if="categoryType === 2" class="voucher-container">
          <header>
            <i class="icon iconfont icon-help icon-small"></i>
            <router-link to="/benefit/coupon" class="hongbao_detail">商家代金券说明</router-link>
          </header>
          <section class="unable_use">
            <img src="../../images/voucher.png" />
            <p>无法使用代金券</p>
            <p>非客户端或客户端版本过低</p>
            <router-link to="/download" class="download-app">下载或升级客户端</router-link>
          </section>
        </section>
      </transition>      
      <footer class="hongbao-footer">
        <router-link to="/benefit/exchange" class="footer-style">兑换红包</router-link>
        <router-link to="/benefit/commend" class="footer-style">推荐有奖</router-link>
      </footer>
    </section>
    <loading v-if="!showLoading"></loading>
    <transition name="router-slide">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import headTop from '@/components/headTop'
import loading from '@/components/loading'
import {getHongbao} from '@/api/getData'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      categoryType:1,
      limit:20,
      offset:0,
      count:0,  //红包个数
      hongbaoList: null,   //红包列表
      showLoading: false
    }
  },
  components: {
    headTop,
    loading
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  mounted () {
    this.initData();
  },
  methods: {
    async initData(){
      if(this.userInfo && this.userInfo.user_id){
        this.hongbaoList = await getHongbao(this.userInfo.user_id, this.limit, this.offset);
        this.showLoading = true;
      }
    }
  },
  watch: {
    userInfo:function(value){
      this.initData();
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'src/style/mixin';
.category-title{
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 1rem;
  background-color: #fff;
  text-align: center;
  span{
    border-bottom: .05rem solid #fff;
    padding-bottom:.1rem;
  }
  .choosed{
    color: $blue;
    border-color:$blue;
  }
}
.hongbao-container{
  padding:0 .2rem;
  header{
    @include fj;
    margin-top: .2rem;
    .icon-help{
      color: $blue;
      margin-right:.1rem;
    }
    span{
      @include sc(.2rem, #666);
      i{
        font-style: normal;
        color: red;
        margin: 0 .05rem;
        display: inline-block;
      }
    }
    a{
      @include sc(.2rem, $blue)
    }
  }
  .hongbao-list-ul{
    li{
      overflow: hidden;
      background:#fff url('../../images/hongbao.png') repeat-x;
      background-size: .2rem;
      border-radius: .1rem;
      margin-top: .3rem;
      .hongbao-item{
        @include fj;
        padding:.4rem .2rem;
      }
      .item-left{
        flex:1;
        border-right:.02rem solid #eee;
        .text{
          font-size: 0px;
          span{
            font-family: Helvetica Neue,Tahoma,Arial;
          }
          span:nth-of-type(1){
            @include sc(.36rem, red);
          }
          span:nth-of-type(2){
            @include sc(.65rem, red);
            font-weight: bold;
          }
          span:nth-of-type(3){
            @include sc(.36rem, red);
          }
          span:nth-of-type(4){
            @include sc(.36rem, red);
            font-weight: bold;
          }
        }
        .description{
          @include sc(.18rem, #999)
        }
      }
      .item-right{
        flex:2;
        margin-left:.3rem;
        p:nth-of-type(1){
          @include sc(.3rem, #666);
        }
        p:nth-of-type(2),p:nth-of-type(3){
          @include sc(.18rem, #999);
        }
      }
      .last-time{
        @include sc(.3rem, red);
      }
    }
  }
  .item-footer{
    @include sc(.18rem, #999);
    background-color: #f9f9f9;
    padding:.2rem;
    clear: both;
  }
  .check-history{
    @include sc(.24rem, #999);
    padding:.3rem 0;
    text-align: center;
    display: flex;
    justify-content: center;
    padding-bottom: 1.5rem;
  }
}
.voucher-container{
  padding:0 .15rem;
  header{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding:.15rem;
    .icon-help{
      color: $blue;
      margin-right: .1rem;
    }
    a{
      @include sc(.24rem, $blue)
    }
  }
  .unable_use{
    width: 100%;
    text-align: center;
    margin-top:1.5rem;
    img{
      width: 3rem;
    }
    p:nth-of-type(1){
      @include sc(.3rem, #666);
      margin-top:.3rem;
    }
    p:nth-of-type(2){
      @include sc(.2rem, #999);
      margin-top:.1rem;
    }
    .download-app{
      background-color:$green;
      border-radius: .03rem;
      @include sc(.3rem, #fff);
      text-align: center;
      padding:.2rem;
      display: inline-block;
      margin-top:.2rem;
    }
  }
}
.hongbao-footer{
  position: fixed;
  bottom:0;
  left: 0;
  width: 100%;
  display: flex;
  background-color: #fff;
  .footer-style{
    flex: 1;
    padding:.2rem 0;
    text-align: center;
    @include sc(.30rem, #666)
  }
  .footer-style:nth-of-type(1){
    border-right: 1px solid #eee;
  }
}
.fade-enter-active, .fade-leave-active{
  transition: opacity .3s;
}
.fade-enter, .fade-leave-active{
  opacity: 0;
}
.router-slide-enter-active, .router-slide-leave-active{
  transition: all .4s;
}
.router-slide-enter, .router-slide-leave-active{
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>