import Vue from 'vue'
import Vuex from './lib/vuex'

Vue.use(Vuex)

const a = {
  namespaced: true,
  state: {
    count: 0
  },
  getters: {
    getterCount: state => state.count + 1
  },
  mutations: {
    increment (state) {
      state.count++
    },
    changeValue (state, val) {
      state.count = val
    }
  },
  actions: {
    changeValue ({ commit }, val) {
      commit('changeValue', val)
      return val
    }
  }
}

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    getterCount: state => state.count + 1
  },
  mutations: {
    increment (state) {
      state.count++
    },
    changeValue (state, val) {
      state.count = val
    }
  },
  actions: {
    async changeValue ({ commit }, val) {
      await delay(1000)
      commit('changeValue', val)
      return val
    }
  },
  modules: {
    a
  }
})

function delay (time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
