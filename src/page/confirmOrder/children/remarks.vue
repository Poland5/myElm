<template>
  <div class="sub-page">
    <section class="remarks-container" v-if="!showloading"> 
      <head-top goback="true" head-title="订单备注"></head-top>
      <section class="remark-box">
        <header>快速备注</header>
        <ul class="remark-ul">
          <li v-for="(item,index) in remarksData.remarks" :key="index">
            <span v-for="(remarkItem, remarkIndex) in item" :key="remarkIndex" :class="{frist:remarkIndex == 0,last:remarkIndex == item.length - 1,choose:remarkText[index] && (remarkText[index][0] == remarkIndex)}" @click="chooseRemark(index, remarkIndex, remarkItem)">
              {{remarkItem}}
            </span>
          </li>
        </ul>
      </section>
      <section class="remark-box">
        <header>其他备注</header>
        <textarea placeholder="请填写备注信息（可以不填）" class="input-txt" v-model="inputText"></textarea>
      </section>
      <section class="confirm-remarks" @click="confirmRemarks">确定</section>
    </section>
    <loading v-show="showloading"></loading>
  </div>
</template>
<script>
  import headTop from '@/components/headTop'
  import {getRemarks} from '@/api/getData'
  import loading from '@/components/loading'
  import { mapMutations } from 'vuex';
  export default {
    data () {
      return {
        remarksData:null,
        cart_id:null,
        remarkText:{},
        showloading:true,
        inputText:null,
      }
    },
    components: {
      headTop, loading
    },
    mounted () {
      this.cart_id = this.$route.query.id;
      this.initData();
    },
    methods: {
      ...mapMutations([
        'RECODE_REMARKDS'
      ]),
      async initData(){
        this.remarksData = await getRemarks(this.cart_id);
        this.showloading = false;
      },
      chooseRemark(index, remarkIndex, remarkItem){
        this.remarkText[index] = [remarkIndex, remarkItem];
        this.remarkText = Object.assign({}, this.remarkText);
      },
      confirmRemarks(){
        this.RECODE_REMARKDS({remarkText:this.remarkText, inputText:this.inputText});
        this.$router.go(-1);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .remarks-container{
    background-color: #fff;
    padding-bottom:.3rem;
  }
  .remark-box{
    padding:0 .25rem;
    margin-top: .2rem;
    header{
      @include sc(.3rem, #333);
      padding:.25rem 0;
    }
    .remark-ul{
      li{
        margin-right:.1rem;
        margin-bottom: .1rem;
        display: inline-block;
        span{
          border:1px solid $blue;
          display: inline-block;
          padding:.1rem .2rem;
          border-left:0;
          @include sc(.24rem, #333);
        }
        .choose{
          background-color: $blue;
          color: #fff;
        }
        .frist{
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
          border-left: 1px solid $blue;
        }
        .last{
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }
      }
    }
    .input-txt{
      min-height: 2rem;
      width: 100%;
      @include sc(.24rem, #999);
      padding:.2rem;
      border:1px solid #eee;
      background-color: #f9f9f9;
      border-radius: 3px;
    }
  }
  .confirm-remarks{
    border-radius: .1rem;
    padding: .2rem 0;
    width: 100%;
    @include sc(.3rem, #fff);
    background-color: $green;
    text-align: center;
    width: 95%;
    margin: 0 auto;
    margin-top: .2rem;
  }

</style>