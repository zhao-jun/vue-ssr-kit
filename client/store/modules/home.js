export default {
  namespaced: true,
  state: {
    text: 'vue ssr'
  },
  mutations: {
    updateText(state, text) {
      state.text = text
    }
  }
}
