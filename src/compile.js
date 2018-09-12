import Watcher from './watcher'

export default class Compile {
  constructor(el, vm) {
    this.vm = vm
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.el) {
      this.fragment = this.node2Fragment(this.el)
      this.init()
      this.el.appendChild(this.fragment)
    }

  }
  // 判断是否为元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
  // 根据真实dom节点构建虚拟dom节点
  node2Fragment(node) {
    var fragment = document.createDocumentFragment()
    var child
    while (child = node.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }
  init() {
    this.compileElement(this.fragment)
  }
  compileElement(el) {
    var childNodes = el.childNodes
    var self = this
    Array.prototype.slice.call(childNodes).forEach(function (node) {
      var text = node.textContent
      var reg = /{{(.*)}}/
      if (self.isElementNode(node)) {
        // 解析v-指令
        self.compile(node)
      } else if (self.isTextNode(node) && reg.test(text)) {
        // 替换{{ val }}
        self.compileText(node, RegExp.$1.trim())
      }
      // 子结点如果也有子结点则对子结点也进行解析
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node)
      }
    })
  }
  // 判断是否为文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  compileText(node, exp) {
    var self = this
    var initText = this.vm[exp]
    this.updateText(node, initText)
    new Watcher(this.vm, exp, function (val) {
      self.updateText(node, val)
    })
  }
  updateText(node, val) {
    node.textContent = typeof val === "undefined" ? "" : val
  }
  compile(node) {
    // 获取节点class style v-指令等属性
    var attrs = node.attributes
    var self = this
    Array.prototype.slice.call(attrs).forEach(function (attr) {
      var command = attr.name
      // 识别v-指令
      if (self.isDirective(command)) {
        var exp = attr.value
        var dir = command.substring(2)
        if (self.isEventDirective(dir)) {
          // 处理v-on:指令
          self.compileEvent(node, self.vm, exp, dir)
        } else {
          // 处理v-model指令
          self.compileModel(node, self.vm, exp, dir)
        }
        node.removeAttribute(command)
      }
    })
  }
  isDirective(command) {
    return command.indexOf("v-") === 0
  }
  isEventDirective(command) {
    return command.indexOf("on:") === 0
  }
  compileEvent(node, vm, exp, dir) {
    var eventType = dir.split(":")[1]
    var cb = vm.$options.methods && vm.$options.methods[exp]
    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false)
    }
  }
  compileModel(node, vm, exp, dir) {
    var self = this
    var val = this.vm[exp]
    self.updateModel(node, val)
    new Watcher(this.vm, exp, function (val) {
      self.updateModel(node, val)
    })
    node.addEventListener("input", function (e) {
      var newVal = e.target.value
      if (val === newVal) {
        return
      }
      self.vm[exp] = newVal
      val = newVal
    })
  }
  updateModel(node, val) {
    node.value = typeof val === "undefined" ? "" : val
  }
}

// 去掉{{ val }}中间的空格 => {{val}}
String.prototype.trim = function () {
  return this.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
}