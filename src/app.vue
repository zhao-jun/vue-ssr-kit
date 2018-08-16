<template>
  <div :class="$style.textA">
    {{text}}
    <Home home='ssr home' />
  </div>
</template>

<script>
import Home from './views/home.vue'

export default {
  components: {
    Home
  },
  data () {
    return {
      text: 'vue-ssr'
    }
  },
  mounted () {
    console.log(process.env)
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
