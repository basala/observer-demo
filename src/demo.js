var el = document.querySelector("#name");
var mio = new Mio({
    time: new Date()
}, el, "time");
var timer = setInterval(function() {
    mio.data.time = new Date();
}, 1000);