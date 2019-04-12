import Module from './module'
import { forEachValue } from '../util'

export default class ModuleCollection {
  constructor (rawRootModule) {
    this.register([], rawRootModule)
  }

  get (path) {
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }

  register (path, rawModule) {
    const newModule = new Module(rawModule)

    if (path.length === 0) {
      this.root = newModule
    } else {
      const parent = this.get(path.slice(0, -1))
      const currentPath = path[path.length - 1]
      parent.addChild(currentPath, newModule)
    }

    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawModule, key) => {
        this.register(path.concat(key), rawModule)
      })
    }
  }
}
