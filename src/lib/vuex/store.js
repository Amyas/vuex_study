import ModuleCollection from './module/module-collection'
import { forEachValue } from './util'

let Vue

export class Store {
  constructor (options = {}) {
    this._module = new ModuleCollection(options)

    const state = this._module.root.state

    installModule(this, state, [], this._module.root)

    resetStoreVM(this, state)
  }

  get state () {
    return this._vm._data.$$state
  }
}

function installModule (store, rootState, path, module) {
  const isRoot = !path.length

  if (!isRoot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    Vue.set(parentState, moduleName, module.state)
  }

  forEachValue(module._children, (module, key) => {
    installModule(store, rootState, path.concat(key), module)
  })
}

function getNestedState (state, path) {
  return path.reduce((state, key) => state[key], state)
}

function resetStoreVM (store, state) {
  store._vm = new Vue({
    data: {
      $$state: state
    }
  })
}

export function install (_Vue) {
  if (Vue && Vue === _Vue) return
  Vue = _Vue
  Vue.mixin({
    beforeCreate: function () {
      const options = this.$options
      if (options.store) {
        this.$store = options.store
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store
      }
    }
  })
}
