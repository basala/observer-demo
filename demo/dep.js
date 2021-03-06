function Dep() {
  this.subs = [];
}

Dep.prototype = {
  addSub: function (sub) {
    if (sub && !this.subs.includes(sub))
      this.subs.push(sub);
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  }
};