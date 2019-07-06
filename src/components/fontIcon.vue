<template lang="html">
  <i v-if="id" class="iconfont" :class="id"></i>
</template>

<script>
export default {
  name: 'fontIcon',
  props: {
    id: {
      type: String,
      default: ''
    }
  }
}
</script>
