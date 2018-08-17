<template>
  <div :class="$style.textA">
    <Header header='ssr header' />
    <router-view />
  </div>
</template>

<script>
import Header from './layout/header.vue'

export default {
  components: {
    Header
  },
  data () {
    return {
      text: 'vue-ssr'
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped module>
body {
  color: blue;
  .text-a {
    transform:translateX(50px);
  }
}
</style>
