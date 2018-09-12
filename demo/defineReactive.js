function defineReactive(data, key, val) {
  var dep = new Dep();
  observe(val);
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    get: function () {
      Dep.target && dep.addSub(Dep.target);
      return val;
    },
    set: function (newVal) {
      val = newVal;
      dep.notify();
    }
  });
}