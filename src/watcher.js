import Dep from './dep'

export default class Watcher {
  constructor(vm, expOrFn, cb) {
    this.cb = cb
    this.vm = vm
    this.expOrFn = expOrFn
    this.value = this.get()
  }
  update() {
    this.run()
  }
  run() {
    // 获取最新值
    const value = typeof this.expOrFn === "function" ? this.expOrFn.call(this.vm) : this.vm[this.expOrFn]
    // 如果虚拟dom没有变化就不进行重新渲染
    if (this.value === value || (this.value !== this.value && value !== value)) {
      return
    }
    this.value = value
    this.cb.call(this.vm, value)
  }
  get() {
    Dep.target = this
    const value = typeof this.expOrFn === "function" ? this.expOrFn.call(this.vm) : this.vm[this.expOrFn]
    Dep.target = null
    return value
  }
}