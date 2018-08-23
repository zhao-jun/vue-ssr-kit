import {getHomeList} from '../../service/home'

export default {
  namespaced: true,
  state: {
    text: 'vue ssr',
    list: []
  },
  mutations: {
    updateText (state, text) {
      state.text = text
    },
    updateList (state, list) {
      state.list = list
    }
  },
  actions: {
    async getHomeList ({commit}) {
      let data = await getHomeList()
      commit('updateList', data)
    }
  }
}
