export default class Module {
  constructor (rawModule) {
    this._rawModule = rawModule
    this._children = Object.create(null)
    this.state = rawModule.state
  }

  get namespaced () {
    return !!this._rawModule.namespaced
  }

  getChild (key) {
    return this._children[key]
  }

  addChild (key, module) {
    this._children[key] = module
  }
}