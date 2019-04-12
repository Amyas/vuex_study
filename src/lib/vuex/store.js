import ModuleCollection from './module/module-collection'

let Vue

export class Store {
  constructor (options = {}) {
    this._module = new ModuleCollection(options)

    const state = this._module.root.state

    resetStoreVM(this, state)
  }

  get state () {
    return this._vm._data.$$state
  }
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
