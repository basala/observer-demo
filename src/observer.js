import Dep from './dep'

export default class Observer {
    constructor(value) {
        this.value = value
        // 还需考虑数组的情况，这里做了简化处理，只考虑object
        this.walk(value)
    }
    walk(value) {
        Object.keys(value).forEach(key => this.convert(key, value[key]))
    }
    convert(key, val) {
        defineReactive(this.value, key, val)
    }
}

export function defineReactive(obj, key, val) {
    var dep = new Dep()
    var childObj = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            if (Dep.target) {
                // watcher调用get时收集依赖
                dep.addSub(Dep.target)
            }
            return val
        },
        set: newVal => {
            var value = val
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            val = newVal
            childObj = observe(newVal)
            dep.notify()
        }
    })
}

export function observe(value) {
    if (!value || typeof value !== "object") {
        return
    }
    return new Observer(value)
}