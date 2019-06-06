<template>
  <div class="fixed-page">
    <head-top head-title="商家详情" goback="true"></head-top>
    <section class="scroll-wrap">
      <div>
        <section class="shopDetail_box">
            <header class="header">活动与属性</header>
            <section class="activitise-container">
              <ul class="activitise_ul" v-for="(item, index) in shopDetail.activities" :key="index">
                <li>
                  <span class="icon-name" :style="{backgroundColor:'#'+item.icon_color}">{{item.icon_name}}</span>
                  <span class="desc">{{item.description}}(APP专享)</span>
                </li>
              </ul>
              <ul class="activitise_ul" v-for="(item, index) in shopDetail.supports" :key="index">
                <li>
                  <span class="icon-name" :style="{backgroundColor:'#'+item.icon_color}">{{item.icon_name}}</span>
                  <span class="desc">{{item.description}}(APP专享)</span>
                </li>
              </ul>
            </section>
        </section>
        <section class="shopDetail_box">
          <router-link class="header">
            <span>食品监督安全公示</span>
            <div class="company_legalize">
              企业认证详情
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
                <path d="M0 0 L8 7 L0 14"  stroke="#bbb" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
          </router-link>
          <section class="shop_statu_detail">
            <div>
              <svg class="shop_status" v-if="shopDetail.status == 1">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#res-well"></use>
              </svg>
              <svg class="res-well" v-else>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#res-bad"></use>
              </svg>
            </div>
            <div class="check_detail">
              <p>
                监督检查结果:
                <span class="res_good" v-if="shopDetail.status == 1">良好</span>
                <span class="res_bad" v-else>差</span>
              </p>
              <p>检查日期:<span class="check_date"></span></p>
            </div>
          </section>
        </section>
        <section class="shopDetail_box">
          <header class="header">商家信息</header>
          <div class="shop_status_info">
            <p>{{shopDetail.name}}</p>
            <p>地址: {{shopDetail.address}}</p>
            <p>营业时间: {{shopDetail.opening_hours[0]}}</p>
            <p>
              <span>营业执照</span>
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
                  <path d="M0 0 L8 7 L0 14"  stroke="#bbb" stroke-width="1.5" fill="none"/>
              </svg>
            </p>
            <p>
              <span>餐饮服务许可证</span>
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
                  <path d="M0 0 L8 7 L0 14"  stroke="#bbb" stroke-width="1.5" fill="none"/>
              </svg>
            </p>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
import { mapState } from 'vuex';
  export default {
    data () {
      return {

      }
    },
    components: {
      headTop
    },
    computed: {
      ...mapState([
        'shopDetail'
      ])
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .fixed-page{
    z-index: 100;
  }
  .shopDetail_box{
    background-color: #fff;
    margin-top:.2rem;
    .header{
      border:1px solid #f4f4f4;
      @include sc(.3rem, #666);
      padding:.25rem;
      @include fj;
    }
    .activitise-container{
      padding:.25rem;
    }
    .activitise_ul{
      li{
        margin-bottom: .15rem;
        .icon-name{
          @include sc(.24rem, #fff);
          padding: .04rem;
          border-radius: .02rem;
        }
        .desc{
          @include sc(.24rem, #666);
          margin-left: .1rem;
        }
      }
    }
    .shop_statu_detail{
      display: flex;
      padding:.25rem;
      svg{
        @include wh(.9rem,.9rem);
      }
      .check_detail{
        margin-left: .2rem;
        p{
          @include sc(.24rem, #666);
          margin-bottom:.1rem;
        }
        .res_good{
          @include sc(.24rem, #7ed321)
        }
        .res-bad{
          @include sc(.24rem, red)
        }
      }
    }
    .shop_status_info{
      p{
        border-bottom: 1px solid #f4f4f4;
        padding: .25rem 0;
        @include sc(.24rem, #999);
        margin-left: .25rem;
      }
    }
  }

</style>
