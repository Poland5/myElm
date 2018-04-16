<template>
<div class="fixed-page">
  <head-top goback="true" headTitle="修改用户名"></head-top>
  <form class="user-form">
    <div class="form-input">
      <input type="text" placeholder="输入用户名">
    </div>
    <p>用户名只能修改一次（5-24字符之间）</p>
  </form>
  <div class="btn-confirm" @click="confirmChange">
    <span>确认修改</span>
  </div>
</div>
</template>
<script>
import headTop from '@/components/headTop'
  export default {
  data () {
    return {

    }
  },
  components: {
    headTop
  }
}
</script>
<style lang="scss" scoped>
  @import '../../../../style/mixin';
  .user-form{
    padding:.2rem;
    .form-input{
      input{
        background: none;
        border:1px solid #ddd;
        @include wh(100%, .8rem);
        padding:.1rem;
        border-radius: .1rem;
      }
    }
    p{
      @include sc(.24rem, #666);
      line-height: .6rem;
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
    }
  }
</style>


