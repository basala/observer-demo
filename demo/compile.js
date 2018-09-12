function Compile(el, vm) {
  this.vm = vm;
  this.el = this.isElementNode(el) ? el : document.querySelector(el);
  if (this.el) {
    this.fragment = this.node2Fragment(this.el);
    this.init();
    this.el.appendChild(this.fragment);
  }

}

Compile.prototype = {
  isElementNode: function (node) {
    return node.nodeType == 1;
  },
  node2Fragment: function (node) {
    var fragment = document.createDocumentFragment(),
      child;
    while (child = node.firstChild) {
      fragment.appendChild(child);
    }
    return fragment;
  },
  init: function () {
    this.compileElement(this.fragment);
  },
  compileElement: function (el) {
    var childNodes = el.childNodes;
    var self = this;
    Array.prototype.slice.call(childNodes).forEach(function (node) {
      var text = node.textContent;
      var reg = /{{(.*)}}/;
      if (self.isElementNode(node)) {
        self.compile(node);
      } else if (self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, RegExp.$1.trim());
      }
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node);
      }
    });
  },
  isTextNode: function (node) {
    return node.nodeType == 3;
  },
  compileText: function (node, exp) {
    var self = this;
    var initText = this.vm[exp];
    this.updateText(node, initText);
    new Watcher(this.vm, exp, function (val) {
      self.updateText(node, val);
    });
  },
  updateText: function (node, val) {
    node.textContent = val == "undefined" ? "" : val;
  },
  compile: function (node) {
    var attrs = node.attributes;
    var self = this;
    Array.prototype.slice.call(attrs).forEach(function (attr) {
      var command = attr.name;
      if (self.isDirective(command)) {
        var exp = attr.value;
        var dir = command.substring(2);
        if (self.isEventDirective(dir)) {
          self.compileEvent(node, self.vm, exp, dir);
        } else {
          self.compileModel(node, self.vm, exp, dir);
        }
        node.removeAttribute(command);
      }
    });
  },
  isDirective: function (command) {
    return command.indexOf("v-") == 0;
  },
  isEventDirective: function (command) {
    return command.indexOf("on:") == 0;
  },
  compileEvent: function (node, vm, exp, dir) {
    var eventType = dir.split(":")[1];
    var cb = vm.options.methods && vm.options.methods[exp];
    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false);
    }
  },
  compileModel: function (node, vm, exp, dir) {
    var self = this;
    var val = this.vm[exp];
    new Watcher(this.vm, exp, function (val) {
      self.updateModel(node, val);
    });
    node.addEventListener("input", function (e) {
      var newVal = e.target.value;
      if (val === newVal) {
        return;
      }
      self.vm[exp] = newVal;
      val = newVal;
    });
  },
  updateModel: function (node, val) {
    node.value = val == "undefined" ? "" : val
  }
};