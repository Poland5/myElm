<template>
  <section v-if="!foods.specifications.length" class="single-section">
    <transition name="fade-reduce">
      <svg class="reduce_icon" v-if="foodNum" @click="removeCart(
        foods.category_id, 
        foods.item_id, 
        foods.specfoods[0].food_id,
        foods.specfoods[0].name,
        foods.specfoods[0].packing_fee,
        foods.specfoods[0].price,
        foods.specfoods[0].sku_id,
        foods.specfoods[0].specs,
        foods.specfoods[0].stock
      )">
    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
    </svg>
    </transition>
    <transition name="fade">
      <span v-if="foodNum" class="cart-num">{{foodNum}}</span>
    </transition>
    <svg class="add_icon" @click="addCart(
      foods.category_id, 
      foods.item_id, 
      foods.specfoods[0].food_id,
      foods.specfoods[0].name,
      foods.specfoods[0].packing_fee,
      foods.specfoods[0].price,
      foods.specfoods[0].sku_id,
      foods.specfoods[0].specs,
      foods.specfoods[0].stock,
      $event
      )">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
    </svg>
  </section>
  <section class="specification" v-else>
    <transition name="fade-reduce">
      <svg class="reduce_icon" v-if="foodNum" @click="removeSpec">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
      </svg>
    </transition>
    <span v-if="foodNum" class="specNum">{{foodNum}}</span>
    <span class="show-speciList" @click="showSpeciList(foods)">选规格</span>
  </section>
</template>
<script>
  import {mapState,mapMutations} from 'vuex'
  export default {
    data () {
      return {
        showMoveDot:[]
      }
    },
    props:['foods','shopId'],
    computed: {
      ...mapState([
        'cartList'
      ]),
      
      //监听购物车商品变化
      shopCart:function(){
        return Object.assign({},this.cartList[this.shopId])
      },
      
      //购物车发生变化时重新计算当前商品数量。
      foodNum:function (){
        let category_id = this.foods.category_id;
        let item_id = this.foods.item_id;
        if(this.shopCart&&this.shopCart[category_id]&&this.shopCart[category_id][item_id]){
          let num = 0;
          Object.values(this.shopCart[category_id][item_id]).forEach((item,index) => {
            num += parseInt(item.num);
          })
          return num;
        }else{
          return 0;
        }
      }
    },
    methods: {
      ...mapMutations([
        'ADD_CART','REDUCE_CART'
      ]),
      addCart(category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock, event){
        this.ADD_CART({shopId:this.shopId, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock})
        let elLeft = event.target.getBoundingClientRect().left;
        let leBottom = event.target.getBoundingClientRect().bottom;
        this.showMoveDot.push(true);//每次点击复制一个add-icon
        this.$emit('showMoveDot', this.showMoveDot, elLeft, leBottom);
      },
      //移出购物车
      removeCart(category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock){
        if(this.foodNum > 0){
          this.REDUCE_CART({shopId:this.shopId, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock})
        }
      },
      showSpeciList(specfoods){
        this.$emit('showSpeciList',specfoods);
      },
      removeSpec(){
        this.$emit('showRemoveInfo');
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .single-section{
    align-items: center;
    display: flex;
    .cart-num{
      margin-right: .11rem;
      @include sc(.24rem, #666);
    }
    .add_icon{
      @include wh(.4rem, .4rem);
      fill: $blue;
    }
    .reduce_icon{
      @include wh(.4rem, .4rem);
      fill: $blue;
      margin-right: .09rem;
    }
  }
  .specification{
    display: flex;
    align-items: center;
    .show-speciList{
      background-color: $blue;
      @include sc(.24rem,#fff);
      border-radius: .1rem;
      display: inline-block;
      padding:.08rem;
    }
    .specNum{
      margin-right: .11rem;
      @include sc(.24rem, #666);
    }
    .reduce_icon{
      @include wh(.4rem, .4rem);
      fill: #999;
      margin-right: .09rem;
    }
  }

  .fade-enter-active, .fade-leave-active{
    transition: all .4s;
  }
  .fade-enter, .fade-leave-active{
    opacity: 0;
  }
  .fade-reduce-enter-active, .fade-reduce-leave-active{
    transition: all .3s;
  }
  .fade-reduce-enter, .fade-reduce-leave-to{
    transform: translateX(1rem);
    opacity: 0;
  }
</style>