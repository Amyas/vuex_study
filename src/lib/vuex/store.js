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
  const namespace = store._module.getNamespace(path)

  if (!isRoot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    Vue.set(parentState, moduleName, module.state)
  }

  const local = makeLocalContext(store, namespace, path)
  console.log(local)

  forEachValue(module._children, (module, key) => {
    installModule(store, rootState, path.concat(key), module)
  })
}

function makeLocalContext (store, namespace, path) {
  const local = {}
  Object.defineProperties(local, {
    state: {
      get: () => getNestedState(store.state, path)
    }
  })
  return local
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
