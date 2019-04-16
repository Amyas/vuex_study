import ModuleCollection from './module/module-collection'
import { forEachValue, isPromise } from './util'

let Vue

export class Store {
  constructor (options = {}) {
    this._modules = new ModuleCollection(options)
    this._mutations = Object.create(null)
    this._actions = Object.create(null)
    this._wrappedGetters = Object.create(null)

    const store = this
    const state = this._modules.root.state
    const { commit, dispatch } = this
    this.commit = function (type, payload) {
      return commit.call(store, type, payload)
    }
    this.dispatch = function (type, payload) {
      return dispatch.call(store, type, payload)
    }

    installModule(this, state, [], this._modules.root)

    resetStoreVM(this, state)
  }

  get state () {
    return this._vm._data.$$state
  }

  commit (type, payload) {
    const entry = this._mutations[type]
    entry.forEach(handler => {
      handler(payload)
    })
  }

  dispatch (type, payload) {
    const entry = this._actions[type]
    return entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)
  }
}

function installModule (store, rootState, path, module) {
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)

  if (!isRoot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    Vue.set(parentState, moduleName, module.state)
  }

  const local = makeLocalContext(store, namespace, path)

  module.forEachMutation((mutation, key) => {
    const namespaceType = namespace + key
    registerMutation(store, namespaceType, mutation, local)
  })
  module.forEachAction((action, key) => {
    const namespaceType = namespace + key
    registerAction(store, namespaceType, action, local)
  })
  module.forEachGetter((getter, key) => {
    const namespaceType = namespace + key
    registerGetter(store, namespaceType, getter, local)
  })
  module.forEachChild((module, key) => {
    installModule(store, rootState, path.concat(key), module)
  })
}

function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function (payload) {
    handler.call(store, local.state, payload)
  })
}

function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function (payload) {
    let res = handler.call(store, {
      commit: local.commit,
      dispatch: local.dispatch,
      state: local.state,
      rootState: store.state
    }, payload)

    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }

    return res
  })
}

function registerGetter (store, type, rawGetter, local) {
  store._wrappedGetters[type] = function (store) {
    return rawGetter(
      local.state,
      store.state
    )
  }
}

function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''

  const local = {
    commit: noNamespace
      ? store.commit
      : (type, payload) => { store.commit(namespace + type, payload) },
    dispatch: noNamespace
      ? store.dispatch
      : (type, payload) => store.dispatch(namespace + type, payload)
  }

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
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true
    })
  })
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
}

export function install (_Vue) {
  if (Vue) return
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
