<template>
<div class="fixed-page">
  <head-top goback="true" headTitle="修改用户名"></head-top>
  <form class="user-form">
    <div class="form-input">
      <input type="text" placeholder="输入用户名" :class="{'input-border': borderColor}" @input="inputThing" v-model="inputValue">
    </div>
    <p v-if="like">用户名只能修改一次（5-24字符之间）</p>
    <p v-else class="unlike">用户名必须5-24个字符</p>
  </form>
  <div class="btn-confirm" @click="resetName">
    <span :class="{'opacity-font': like}">确认修改</span>
  </div>
</div>
</template>
<script>
import headTop from '@/components/headTop'
import {mapMutations} from 'vuex'
  export default {
  data () {
    return {
      like:false,
      borderColor:false,
      inputValue:''
    }
  },
  components: {
    headTop
  },
  methods: {
    ...mapMutations([
      'RESET_NAME'
    ]),
    inputThing(){
      if(this.inputValue.length < 5 || this.inputValue.length > 24 ){
        this.like = false;
        this.borderColor = true;
      }else{
        this.like = true;
        this.borderColor = false;
      }
    },
    resetName(){
      if(this.like){
        this.RESET_NAME(this.inputValue);
        this.$router.go(-1);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .user-form{
    padding:.2rem;
    .form-input{
      input{
        background: none;
        border:1px solid #ddd;
        @include wh(100%, .8rem);
        padding:.1rem;
        border-radius: .1rem;
        display: block;
      }
      .input-border{
        border-color: #ea3106;
      }
    }
    p{
      @include sc(.24rem, #666);
      line-height: .6rem;
    }
    .unlike{
      color: red;
    }
  }
  .btn-confirm{
    background-color: $blue;
    text-align: center;
    padding:.2rem;
    margin: .2rem;
    span{
      opacity: .6;
      color: #fff;
      transition: all .4s;
    }
    .opacity-font{
      transition: all .4s;
      opacity: 1;
    }
  }
</style>


