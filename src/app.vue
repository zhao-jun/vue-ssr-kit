<template>
  <div class="text">
    {{text}}
  </div>
</template>

<script>
export default {
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

<style lang="less" scoped>
body {
  color: blue;
  .text {
    transform:translateX(50px);
  }
}
</style>
