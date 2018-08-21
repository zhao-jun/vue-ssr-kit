<template>
  <div>
    <ul>
      <li><router-link to='/test'>{{text}}</router-link></li>
      <li @click="updateText('change')">change text</li>
    </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('home')

export default {
  computed: {
    ...mapState(['text'])
  },
  methods: {
    ...mapMutations([
      'updateText'
    ])
  }

}
</script>
