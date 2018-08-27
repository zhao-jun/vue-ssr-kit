<template>
  <div>
    <ul>
      <li><router-link to='/'>home</router-link></li>
      <li><router-link to='/test/1'>1</router-link></li>
      <li><router-link to='/test/2'>2</router-link></li>
      <li><router-link to='/test/3'>3</router-link></li>
      <li>当前路由id:{{id || 0}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['id'],
  asyncData () {
    return new Promise((resolve) => {
      resolve()
    })
  }
}
</script>

