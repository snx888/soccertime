export default class Timer {
    #interval = null
    #options = {
        duration: 5 * 60,
        infinite: true
    }
    #counter = 0
    #listener = {
        start: [],
        stop: [],
        tick: []
    }

    constructor(options){
        this.setOptions(options)
        this.#counter = this.#options.duration
    }

    #syncClock(time) {
        //console.log(time)
        const remainingSeconds = 60 - time.seconds
        const remainingMinutes = 4 - time.minutes % 5
        //console.log(time.minutes+":"+time.seconds, remainingMinutes+":"+remainingSeconds, (time.minutes+remainingMinutes)+":"+(time.seconds+remainingSeconds))
        this.#counter = remainingSeconds + remainingMinutes * 60
    }

    start(time=null) {
        this.#syncClock(time)
        this.stop()
        this.#interval = setInterval(() => {
            this.#counter--
            this.#emit("tick", this.#counter)
            if (this.#counter === 0) {
                if (this.#options.infinite) {
                    this.#counter = this.#options.duration
                } else this.stop()
            }
        }, 1000)
        this.#emit("start", this.#counter)
    }

    stop() {
        clearInterval(this.#interval)
        this.#interval = null
        this.#emit("stop")
    }

    setOptions(options) {
        if (!options) return
        this.#options = { ...this.#options, ...options }
    }
    getOptions() {
        return this.#options
    }

    getCounterText(formatted=false) {
        let minutes = Math.floor(this.#counter / 60)
        let seconds = this.#counter % 60
        if (formatted) {
            minutes = minutes.toString().padStart(1, "0"),
            seconds = seconds.toString().padStart(2, "0")
        }
        return {
            minutes: minutes,
            seconds: seconds
        }
    }

    on(event, func) {
        if (!this.#listener[event]) return
        this.#listener[event].push(func)
    }

    #emit(event, ...params) {
        if (!this.#listener[event]) return
        this.#listener[event].forEach(func => {
            func(...params)
        })
    }
}