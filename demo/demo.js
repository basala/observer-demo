var mio = new Mio({
    el: "#app",
    data: {
        time: new Date()
    },
    methods: {
        test() {
            this.time = new Date();
        }
    }
});