<template>
  <div :class="$style.textA">
    <Header :header="header" />
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
      header: 'ssr header'
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
