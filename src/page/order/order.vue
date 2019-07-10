<template>
  <div>
    <!-- <head-top goback="true" head-title="订单列表"></head-top> -->
    <section class="order-scroll" ref="orderScroll">
      <ul class="order-list-ul">
        <li v-for="(item, index) in orderList" :key="index">
          <img class="order-avatar" :src="baseImgPath + item.restaurant_image_url">
          <section class="right-content">
            <header class="order-header">
              <div class="title">
                <h2>
                  <span class="order-name ellipsis">{{ item.restaurant_name }}</span>
                  <svg fill="#333" class="arrow_right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                  </svg>
                </h2>
                <p>{{ item.status_bar.title }}</p>
              </div>
              <p class="order-time">{{ item.formatted_created_at }}</p>
            </header>
            <div class="order-name-price">
              <span>{{ item.basket.group[0][0].name }}等{{ item.total_quantity }}件商品</span>
              <span>￥{{ item.total_amount.toFixed(2) }}</span>
            </div>
            <div class="order-wait-pay">
              <compute-time v-if="item.status_bar.title == '等待支付'" :time="item.time_pass"></compute-time>
              <router-link class="order-again" :to="{ path: '/shop', query: { geohash, id: item.restaurant_id }}" v-else>再来一单</router-link>
            </div>
          </section>
        </li>
        <div class="loading" v-if="showLoading">
          <font-icon id="icon-load"></font-icon>
        </div>
      </ul>
    </section>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
  import headTop from '@/components/headTop'
  import footGuide from '@/components/footGuide'
  import computeTime from '@/components/computeTime'
  import { getOrderList } from '@/api/getData'
  import { mapState, mapActions } from 'vuex'
  import BScroll from 'better-scroll'
  export default {
    data () {
      return {
        limit: 8,
        offset: 0,
        orderList: null,
        myScroll: null,
        baseImgPath: 'http://cangdu.org:8001/img/',
        totalPrice: null,
        showLoading: true,
        loadMoreEnd: false,
        preventRepeat: false // 阻止滚动内容重复触发
      }
    },
    components: {
      headTop, footGuide, computeTime
    },
    computed: {
      ...mapState([
        'userInfo', 'geohash'
      ])
    },
    created() {
      this.initData()
    },
    mounted () {
      this.getUserinfo()
    },
    methods: {
      ...mapActions([
        'getUserinfo'
      ]),
      async initData() {
        if (this.userInfo && this.userInfo.user_id) {
          let res = await getOrderList(this.userInfo.user_id, this.limit, this.offset)
          this.orderList = [...res]
          if (res.length < 8) {
            this.loadMoreEnd = true
          }
          this.hideLoading()
        } else {
          this.hideLoading()
        }
        this.$nextTick(() => {
          this.myScroll = new BScroll(this.$refs.orderScroll, {
            pullUpLoad: {
              threshold: 10 // 当上拉距离超过盒子高度10px的时候，就派发一个上拉加载事件
            },
            useTransition: false  // 防止iphone微信滑动卡顿
          })
          this.myScroll.on('pullingUp', () => {
            this.loadMore()
          })
        })
      },
      loadMore() {
        if (this.preventRepeat || this.loadMoreEnd) {
          return
        }
        this.showLoading = true
        setTimeout(() => {
          this.preventRepeat = true
          this.offset += 8
          getOrderList(this.userInfo.user_id, this.limit, this.offset).then(res => {
            if (res.length < 8) {
              this.loadMoreEnd = true
            }
            this.orderList = [...this.orderList, ...res]
            this.preventRepeat = false
            this.hideLoading()
            this.myScroll.finishPullUp() // 上拉加载动作完成后调用此方法告诉BScroll完成一次上拉动作
            this.myScroll.refresh()
          })
        }, 1000)
      },
      hideLoading() {
        this.showLoading = false
      }
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id && !this.orderList) {
          this.initData()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  @import 'src/style/animations';
  .order-scroll {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: px2rem(45);
    overflow-y: auto;
  }
  .order-list-ul {
    margin-bottom: px2rem(48);
    li {
      padding:px2rem(12.5) px2rem(12.5) 0 px2rem(12.5);
      display: flex;
      background-color: #fff;
      margin-top: px2rem(10);
      .order-avatar {
        @include wh(px2rem(40), px2rem(40));
        margin-right: px2rem(8);
      }
    }
    .loading {
      height: px2rem(30);
      @include fjc(center);
      .icon-load {
        font-size: px2rem(20);
        color: #999;
        animation: load 2s linear infinite;
      }
    }
    .right-content {
      margin-left: px2rem(5);
      width: 100%;
      .order-header {
        border-bottom: 1px solid #f4f4f4;
        padding-bottom: px2rem(10);
        .title  {
          @include fj;
          h2 {
            display: flex;
            align-items: center;
            .order-name {
              max-width: px2rem(160);
              @include sc(px2rem(16), #666);
            }
            .arrow_right {
              @include wh(px2rem(8), px2rem(8));
              fill: #999;
            }
          }
          p {
            @include sc(px2rem(14), #666);
          }
        }
        .order-time {
          @include sc(px2rem(12), #999);
        }
      }
      .order-name-price {
        @include fj;
        padding: px2rem(12.5) 0;
        border-bottom: 1px solid #f4f4f4;
        span:nth-of-type(1) {
          @include sc(px2rem(12), #666);
        }
        span:nth-of-type(2) {
          @include sc(px2rem(12), #333);
          font-weight: bold;
        }
      }
      .order-wait-pay {
        padding: px2rem(12.5) 0;
        display: flex;
        justify-content: flex-end;
        .order-again {
          @include sc(px2rem(12), $blue);
          padding: px2rem(5) px2rem(8);
          border-radius: 3px;
          border: 1px solid $blue;
          display: inline-block;
        }
      }
    }
  }
</style>
