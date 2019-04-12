import Vue from 'vue'
import Vuex from './lib/vuex'

Vue.use(Vuex)

const a = {
  namespaced: true,
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
}

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  modules: {
    a
  }
})
