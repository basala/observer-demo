import {
    observe
} from './observer'
import VNode from './vnode'
import Dep from './dep'
import Watcher from './watcher'
import Compile from './compile'

export default class Mio {
    constructor(options = {}) {
        this.$options = options
        this._data = this.$options.data
        Object.keys(this._data).forEach(key => this._proxy(key))
        observe(options.data)
        this.vdom = new Watcher(this, this._render, this._update)
        console.log(this.vdom)
        this.compile = new Compile(options.el || document.body, this)
    }
    _proxy(key) {
        const self = this
        Object.defineProperty(self, key, {
            configurable: true,
            enumerable: true,
            get: function proxyGetter() {
                return self._data[key]
            },
            set: function proxySetter(val) {
                self._data[key] = val
            }
        })
    }
    _update() {
        this.vdom = this._render.call(this)
        console.log("vdom update:", this.vdom)
    }
    _render() {
        return this.$options.render.call(this)
    }
    __h__(tag, attr, children) {
        return VNode(tag, attr, children.map(child => {
            if (typeof child === "string") {
                return VNode(undefined, undefined, undefined, child)
            }
            return child
        }))
    }
    __toString__(val) {
        return val === null ? "" : typeof val === "object" ? JSON.stringify(val) : String(val)
    }
}