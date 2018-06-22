<template>
    <div class="page">
        <head-top goback="true" head-title="会员中心"></head-top>
        <section class="vip-pay">为账号<strong>{{userInfo.username}}</strong>购买会员</section>
        <section class="vip-privilege">
            <section class="vip-header">
                <div class="vip-left">
                    <span>会员特权</span>
                </div>
                <div class="vip-right">
                    <span>会员说明</span>
                    <svg class="arrow-right">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                    </svg>
                </div>
            </section>
            <section>
                <div class="vip-left">
                    <img src="../../images/sheng.jpeg">
                </div>
                <div class="vip-right">
                    <h4>减免配送费</h4>
                    <p>每月减免30单，每日可减免3单，每单最高减4元</p>
                    <p>蜂鸟专送专享</p>
                </div>
            </section>
            <section>
                <div class="vip-left">
                    <img src="../../images/jifen.jpeg">
                </div>
                <div class="vip-right">
                    <h4>减免配送费</h4>
                    <p>每月减免30单，每日可减免3单，每单最高减4元</p>
                    <p>蜂鸟专送专享</p>
                </div>
            </section>
        </section>
        <section class="vip-apply">
            <header>开通会员</header>
            <div class="vip-apply-buy">
                <span>一个月<strong>￥20</strong></span>
                <span class="pay">购买</span>
            </div>
        </section>
        <section class="vip-group">
            <span>兑换会员</span>
            <div class="vip-right">
                <span>使用卡号卡密</span>
                <svg class="arrow-right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </div>
        </section>
        <section class="vip-group">
            <span>购买记录</span>
            <div class="vip-right">
                <span>开发票</span>
                <svg class="arrow-right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
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
                'userInfo'
            ])
        }
    }
</script>
<style lang="scss" scoped>
    @import 'src/style/mixin';
    .vip-pay{
        padding:.25rem .2rem;
        background-color: #f4f4f4;
        @include sc(.24rem, #666);
        strong{
            margin:0 .05rem;
        }
    }
    .vip-privilege{
        background-color: #fff;
        section{
            margin-left: .2rem;
            padding:.2rem;
            border-bottom: 1px solid #f5f5f5;
            display: flex;
            .vip-left{
                img{
                    @include wh(.7rem, .8rem);
                }
            }
            .vip-right{
                padding-left: .2rem;
                h4{
                    @include sc(.24rem, #000);
                }
                p{
                    @include sc(.24rem, #666);
                }
            }
        }
        .vip-header{
            @include fj;
            .vip-right{
                .arrow-right{
                    @include wh(.2rem, .2rem);
                    fill: #666;
                }
            }
            span{
                @include sc(.28rem, #666);
            }
        }
    }
    .vip-apply{
        background-color: #fff;
        margin-top: .15rem;
        padding-left:.2rem;
        header{
            border-bottom: 1px solid #f5f5f5;
            @include sc(.28rem, #666);
            padding:.2rem 0;
        }
        .vip-apply-buy{
            border-bottom: 1px solid #f5f5f5;
            padding:.2rem 0;
            @include fj;
            align-items: center;
            @include sc(.28rem, #666);
            strong{
                color: $orange;
            }
            .pay{
                border:1px solid $orange;
                border-radius: 3px;
                @include sc(.28rem, $orange);
                margin-right: .2rem;
                padding:.1rem .2rem;
            }
        }
    }
    .vip-group{
        margin-top: .15rem;
        background-color: #fff;
        padding:.2rem;
        @include fj;
        span{
            @include sc(.28rem, #666);
        }
        .vip-right{
            span{
                @include sc(.28rem, #999);
            }
            svg{
                @include wh(.2rem, .2rem);
                fill: #999;
            }
        }
    }
</style>