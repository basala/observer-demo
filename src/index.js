import Mio from './mio'

var mio = new Mio({
    el: "#app",
    data: {
        time: new Date(),
        text: "before"
    },
    methods: {
        test() {
            this.time = new Date()
        }
    },
    render() {
        return this.__h__('div', {}, [
            this.__h__('span', {}, [this.__toString__(this.text)])
        ])
    }
})

setInterval(function () {
    mio.text = "after"
}, 5000)