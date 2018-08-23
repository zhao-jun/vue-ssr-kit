<template>
  <div>
    <ul>
      <li><router-link to='/test'>{{text}}</router-link></li>
      <li @click="updateText('change')">change text</li>
    </ul>
    <ul v-if="list.length">
      <li v-for="item in list" :key="item.id">
        {{item.text}}
      </li>
    </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations, mapActions } = createNamespacedHelpers('home')

export default {
  asyncData ({store, router}) {
    return store.dispatch('home/getHomeList')
  },
  computed: {
    ...mapState(['text', 'list'])
  },
  mounted () {
    // this.getHomeList()
  },
  methods: {
    ...mapMutations([
      'updateText'
    ]),
    ...mapActions([
      'getHomeList'
    ])
  }

}
</script>
