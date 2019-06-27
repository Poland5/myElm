<template>
  <section v-if="!foods.specifications.length" class="single-section">
    <transition name="fade-reduce">
      <svg width="100%" height="100%" class="reduce_icon" v-if="foodNum"
        @click="reduceCart(
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
    <svg class="add_icon"
      @click="addCart(
        foods.category_id,
        foods.item_id,
        foods.image_path,
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
  import { mapState,mapMutations } from 'vuex'
  export default {
    data () {
      return {
        showMoveDot:[] // 控制下落圆点显示和隐藏
      }
    },
    props:['foods','shopId'],
    computed: {
      ...mapState([
        'cartList'
      ]),
      //监听购物车商品变化
      shopCart:function() {
        return Object.assign({}, this.cartList[this.shopId])
      },
      //购物车发生变化时重新计算当前商品数量。
      foodNum:function() {
        let category_id = this.foods.category_id
        let item_id = this.foods.item_id
        if (this.shopCart && this.shopCart[category_id] && this.shopCart[category_id][item_id]) {
          let num = 0
          Object.values(this.shopCart[category_id][item_id]).forEach((item,index) => {
            num += parseInt(item.num)
          })
          return num
        } else {
          return 0
        }
      }
    },
    methods: {
      ...mapMutations([
        'ADD_CART','REDUCE_CART'
      ]),
      // 增加购物车商品
      addCart(category_id, item_id, image_path, food_id, name, packing_fee, price, sku_id, specs, stock, event) {
        event.preventDefault()
        this.ADD_CART({ shopId:this.shopId, category_id, item_id, image_path, food_id, name, packing_fee, price, sku_id, specs, stock })
        let elLeft = event.target.getBoundingClientRect().left
        let elBottom = event.target.getBoundingClientRect().bottom
        this.showMoveDot.push(true) //每次点击复制一个add-icon
        this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom)
      },
      // 减少购物车商品
      reduceCart(category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock) {
        event.preventDefault()
        if (this.foodNum > 0) {
          this.REDUCE_CART({shopId:this.shopId, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock})
        }
      },
      showSpeciList(specfoods) {
        event.preventDefault()
        this.$emit('showSpeciList', specfoods)
      },
      removeSpec() {
        event.preventDefault()
        this.$emit('showRemoveInfo')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .single-section{
    display: -webkit-inline-flex;
    display: inline-flex;
    align-items: center;
    position: absolute;
    bottom: px2rem(-1);
    right: px2rem(-1);
    .cart-num{
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      width: px2rem(20);
      @include sc(px2rem(12), #666);
    }
    .add_icon{
      fill: $blue;
      @include wh(px2rem(25), px2rem(25));
    }
    .reduce_icon{
      @include wh(px2rem(25), px2rem(25));
      fill: $blue;
    }
  }
  .specification{
    display: flex;
    align-items: center;
    position: absolute;
    bottom: px2rem(0);
    right: px2rem(0);
    .show-speciList{
      background-color: $blue;
      @include sc(px2rem(12),#fff);
      border-radius: px2rem(5);
      display: inline-block;
      padding:.08rem;
    }
    .specNum{
      margin-right: px2rem(5.5);
      @include sc(px2rem(12), #666);
    }
    .reduce_icon{
      @include wh(px2rem(25), px2rem(25));
      fill: #999;
      margin-right: .09rem;
    }
  }

  .fade-enter-active, .fade-leave-active{
    transition: all .4s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
  .fade-reduce-enter-active, .fade-reduce-leave-active{
    transition: all .3s;
  }
  .fade-reduce-enter, .fade-reduce-leave-to{
    transform: translateX(px2rem(50));
    opacity: 0;
  }
</style>
