<template>
  <section v-if="!foods.specifications.length">
    <span>{{foodNum}}</span>
    <svg class="add_icon" @click="addCart(
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
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
    </svg>
  </section>
  <section v-else>
    多规格
  </section>
</template>
<script>
  import {mapState,mapMutations} from 'vuex'
  export default {
    data () {
      return {

      }
    },
    props:['foods','shopId'],
    computed: {
      ...mapState([
        'cartList'
      ]),
      shopCart:function(){
        return this.cartList[this.shopId];
      },
      foodNum:function (){
        let num = 0;
        
      }
    },
    methods: {
      ...mapMutations([
        'ADD_CART'
      ]),
      addCart(category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock){
        this.ADD_CART({shopId:this.shopId, category_id, item_id, food_id, name, packing_fee, price, sku_id, specs, stock})
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/style/mixin';
  .add_icon{
    @include wh(.4rem, .4rem);
    fill: $blue;
  }
</style>