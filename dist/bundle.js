! function (t) {
  var e = {};

  function i(n) {
    if (e[n]) return e[n].exports;
    var r = e[n] = {
      i: n,
      l: !1,
      exports: {}
    };
    return t[n].call(r.exports, r, r.exports, i), r.l = !0, r.exports
  }
  i.m = t, i.c = e, i.d = function (t, e, n) {
    i.o(t, e) || Object.defineProperty(t, e, {
      enumerable: !0,
      get: n
    })
  }, i.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    })
  }, i.t = function (t, e) {
    if (1 & e && (t = i(t)), 8 & e) return t;
    if (4 & e && "object" == typeof t && t && t.__esModule) return t;
    var n = Object.create(null);
    if (i.r(n), Object.defineProperty(n, "default", {
        enumerable: !0,
        value: t
      }), 2 & e && "string" != typeof t)
      for (var r in t) i.d(n, r, function (e) {
        return t[e]
      }.bind(null, r));
    return n
  }, i.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default
    } : function () {
      return t
    };
    return i.d(e, "a", e), e
  }, i.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  }, i.p = "", i(i.s = 0)
}([function (t, e, i) {
  "use strict";
  i.r(e);
  class n {
    constructor() {
      this.subs = []
    }
    addSub(t) {
      this.subs.push(t)
    }
    notify() {
      this.subs.forEach(t => t.update())
    }
  }
  n.target = null;
  class r {
    constructor(t) {
      this.value = t, this.walk(t)
    }
    walk(t) {
      Object.keys(t).forEach(e => this.convert(e, t[e]))
    }
    convert(t, e) {
      ! function (t, e, i) {
        var r = new n;
        o(i);
        Object.defineProperty(t, e, {
          enumerable: !0,
          configurable: !0,
          get: () => (n.target && r.addSub(n.target), i),
          set: t => {
            var e = i;
            t === e || t != t && e != e || (i = t, o(t), r.notify())
          }
        })
      }(this.value, t, e)
    }
  }

  function o(t) {
    if (t && "object" == typeof t) return new r(t)
  }

  function s(t, e, i, n) {
    return {
      tag: t,
      data: e,
      children: i,
      text: n
    }
  }
  class a {
    constructor(t, e, i) {
      this.cb = i, this.vm = t, this.expOrFn = e, this.value = this.get()
    }
    update() {
      this.run()
    }
    run() {
      const t = "function" == typeof this.expOrFn ? this.expOrFn.call(this.vm) : this.vm[this.expOrFn];
      this.value === t || this.value != this.value && t != t || (this.value = t, this.cb.call(this.vm, t))
    }
    get() {
      n.target = this;
      const t = "function" == typeof this.expOrFn ? this.expOrFn.call(this.vm) : this.vm[this.expOrFn];
      return n.target = null, t
    }
  }
  class u {
    constructor(t, e) {
      this.vm = e, this.el = this.isElementNode(t) ? t : document.querySelector(t), this.el && (this.fragment = this.node2Fragment(this.el), this.init(), this.el.appendChild(this.fragment))
    }
    isElementNode(t) {
      return 1 === t.nodeType
    }
    node2Fragment(t) {
      for (var e, i = document.createDocumentFragment(); e = t.firstChild;) i.appendChild(e);
      return i
    }
    init() {
      this.compileElement(this.fragment)
    }
    compileElement(t) {
      var e = t.childNodes,
        i = this;
      Array.prototype.slice.call(e).forEach(function (t) {
        var e = t.textContent;
        i.isElementNode(t) ? i.compile(t) : i.isTextNode(t) && /{{(.*)}}/.test(e) && i.compileText(t, RegExp.$1.trim()), t.childNodes && t.childNodes.length && i.compileElement(t)
      })
    }
    isTextNode(t) {
      return 3 === t.nodeType
    }
    compileText(t, e) {
      var i = this,
        n = this.vm[e];
      this.updateText(t, n), new a(this.vm, e, function (e) {
        i.updateText(t, e)
      })
    }
    updateText(t, e) {
      t.textContent = void 0 === e ? "" : e
    }
    compile(t) {
      var e = t.attributes,
        i = this;
      Array.prototype.slice.call(e).forEach(function (e) {
        var n = e.name;
        if (i.isDirective(n)) {
          var r = e.value,
            o = n.substring(2);
          i.isEventDirective(o) ? i.compileEvent(t, i.vm, r, o) : i.compileModel(t, i.vm, r, o), t.removeAttribute(n)
        }
      })
    }
    isDirective(t) {
      return 0 === t.indexOf("v-")
    }
    isEventDirective(t) {
      return 0 === t.indexOf("on:")
    }
    compileEvent(t, e, i, n) {
      var r = n.split(":")[1],
        o = e.$options.methods && e.$options.methods[i];
      r && o && t.addEventListener(r, o.bind(e), !1)
    }
    compileModel(t, e, i, n) {
      var r = this,
        o = this.vm[i];
      r.updateModel(t, o), new a(this.vm, i, function (e) {
        r.updateModel(t, e)
      }), t.addEventListener("input", function (t) {
        var e = t.target.value;
        o !== e && (r.vm[i] = e, o = e)
      })
    }
    updateModel(t, e) {
      t.value = void 0 === e ? "" : e
    }
  }
  String.prototype.trim = function () {
    return this.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
  };
  var l = new class {
    constructor(t = {}) {
      this.$options = t, this._data = this.$options.data, Object.keys(this._data).forEach(t => this._proxy(t)), o(t.data), this.vdom = new a(this, this._render, this._update), console.log(this.vdom), this.compile = new u(t.el || document.body, this)
    }
    _proxy(t) {
      const e = this;
      Object.defineProperty(e, t, {
        configurable: !0,
        enumerable: !0,
        get: function () {
          return e._data[t]
        },
        set: function (i) {
          e._data[t] = i
        }
      })
    }
    _update() {
      this.vdom = this._render.call(this), console.log("vdom update:", this.vdom)
    }
    _render() {
      return this.$options.render.call(this)
    }
    __h__(t, e, i) {
      return s(t, e, i.map(t => "string" == typeof t ? s(void 0, void 0, void 0, t) : t))
    }
    __toString__(t) {
      return null === t ? "" : "object" == typeof t ? JSON.stringify(t) : String(t)
    }
  }({
    el: "#app",
    data: {
      time: new Date,
      text: "before"
    },
    methods: {
      test() {
        this.time = new Date
      }
    },
    render() {
      return this.__h__("div", {}, [this.__h__("span", {}, [this.__toString__(this.text)])])
    }
  });
  setInterval(function () {
    l.text = "after"
  }, 5e3), setInterval(function () {
    l.time = new Date
  }, 1e3)
}]);