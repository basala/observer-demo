function Dep() {
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs = [sub];
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};