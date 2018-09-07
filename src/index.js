import Mio from './mio'

var mio = new Mio({
    data: {
        a: 1,
        b: {
            c: 2
        }
    }
})

mio.$watch("a", () => console.log(`a change to ${mio.a}`))
setTimeout(function () {
    mio.a = 10;
}, 1000)
console.log(mio)