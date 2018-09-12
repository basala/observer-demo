function Mio(options) {
  var self = this;
  this.options = options;
  this.data = this.options.data;
  Object.keys(this.data).forEach(function (key) {
    self.proxy(key);
  });
  observe(this.data);
  this.compile = new Compile(options.el || document.body, this);
  return this;
}

Mio.prototype = {
  proxy: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function proxyGetter() {
        return self.data[key];
      },
      set: function proxySetter(newVal) {
        self.data[key] = newVal;
      }
    });
  }
}