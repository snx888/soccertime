export default class Clock {

    #localStorageName = "soccertime_clockOffset"
    #offset = 0
    #date = new Date()
    #time = {}
    #dateAdjustBase = null
    #listener = {
        changed: []
    }

    constructor () {
        // get offset from local storage
        this.#loadOffset()
    }

    getTime() {
        //console.log('getTime', this.#offset, this.#_dateOffset)
        // do not get current time in adjust mode..
        if (this.#dateAdjustBase === null) this.#getDate()
        return this.#time
    }

    getReadableTime () {
        //console.log('getReadableTime', this.#offset, this.#_dateOffset)
        // do not get current time in adjust mode..
        if (this.#dateAdjustBase === null) this.#getDate()
        return {
            hours: this.#time.hours.toString().padStart(2, "0"),
            minutes: this.#time.minutes.toString().padStart(2, "0"),
            seconds: this.#time.seconds.toString().padStart(2, "0")
        }
    }

    adjustStart () {
        this.#dateAdjustBase = this.#date.getTime()
    }

    adjustStop () {
        this.#offset = this.#date.getTime() - new Date().getTime()
        this.#saveOffset()
        //console.log('offset:', this.#offset / 1000)
        this.#dateAdjustBase = null
    }

    adjust (m, s5) {
        //console.log(s)
        if (this.#dateAdjustBase !== null)
        if (s5 != 0) {
            // set adjuste base to next 5 seconds step..
            //console.log(this.#dateAdjustBase % 5000)
            this.#dateAdjustBase -= this.#dateAdjustBase % 5000
        }
        // set time
        this.#date = new Date(this.#dateAdjustBase + (m * 60000) + (s5 * 5000))
        // update ui immediately (do not wait 1 sec)
        this.#date2Time()
        //console.clear()
        //console.log('real:', new Date())
        //console.log('set:', this.#date)
        this.#emit("changed", this.#time)
    }

    clearOffset () {
        this.#offset = 0
        this.#saveOffset()
        this.#getDate()
        //console.log('offset:', this.#offset)
        this.#emit("changed", this.#time)
    }

    #getDate () {
        this.#date = new Date()
        //console.log('getDate now', this.#date)
        //console.log('getDate offset', this.#offset)
        if (this.#offset !== 0) this.#date = new Date(this.#date.getTime() + this.#offset)
        //console.log('getDate now+offset', this.#date)
        // update ui immediately (do not wait 1 sec)
        this.#date2Time()
        //console.log('getDate_end', this.#offset, this.#_dateOffset, this.#date)
    }

    #date2Time () {
        this.#time = {
            hours: this.#date.getHours(),
            minutes: this.#date.getMinutes(),
            seconds: this.#date.getSeconds()
        }
    }

    #saveOffset () {
        //console.log("save offset:", this.#offset, this.#date)
        localStorage.setItem(this.#localStorageName, this.#offset)
    }

    #loadOffset () {
        this.#offset = parseInt(localStorage.getItem(this.#localStorageName) || 0)
        //console.log("load offset:", this.#offset)
    }


    on (event, func) {
        if (!this.#listener[event]) return
        this.#listener[event].push(func)
    }

    #emit (event, ...params) {
        if (!this.#listener[event]) return
        this.#listener[event].forEach(func => {
            func(...params)
        })
    }

}