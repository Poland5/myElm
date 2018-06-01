<template>
  <div class="sub-page">
    <head-top goback="true" head-title="发票选择抬头"></head-top>
    <section class="invoice-container" @click="chooseInvoice">
      <span>需要发票</span>
      <svg class="invoice-icon" :class="{selected_icon:invoice}">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
      </svg>
    </section>
    <section class="confirm-invoice" @click="confirmInovice">确定</section>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import { mapMutations } from 'vuex';
  export default {
    data () {
      return {
        invoice:false
      }
    },
    components: {
      headTop
    },
    methods: {
      ...mapMutations([
        'CONFIRM_INVOICE'
      ]),
      chooseInvoice(){
        this.invoice = !this.invoice;
      },
      confirmInovice(){
        this.CONFIRM_INVOICE(this.invoice);
        this.$router.go(-1);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .invoice-container{
    background-color: #fff;
    padding:.25rem;
    @include fj;
    align-items: center;
    margin-top: .15rem;
    span{
      @include sc(.3rem, #666);
    }
    .invoice-icon{
      fill: #999;
      @include wh(.3rem, .3rem);
    }
    .selected_icon{
      fill: $green;
    }
  }
  .confirm-invoice{
    background-color: $green;
    padding:.2rem 0;
    border-radius: .1rem;
    width: 95%;
    margin: 0 auto;
    margin-top: .15rem;
    color: #fff;
    text-align: center;
  }
</style>