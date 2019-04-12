import Vue from 'vue'
import Vuex from './lib/vuex'

Vue.use(Vuex)

const a = {
  namespaced: true,
  state: {
    count: 0,
    countA: 0
  }
}

export default new Vuex.Store({
  state: {
    count: 0
  },
  modules: {
    a
  }
})
