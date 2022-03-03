import '../hammer.min.js'

const template = await fetch(
    new URL('./Clock.html', import.meta.url).href)
    .then(response => response.text()
)

export default class Clock {
    #el = {}
    #localStorageName = "clockOffset"
    #date = new Date()
    #secsSinceDate = 0
    #time = {}
    #timeUI = {
        hours: -1,
        minutes: -1,
        seconds: -1
    }
    #pause = false
    #listener = {
        tick: []
    }

    constructor(root) {
        root.innerHTML = template
        this.#el = {
            root: root,
            hours: root.querySelector(".clock__hours"),
            minutes: root.querySelector(".clock__minutes"),
            seconds: root.querySelector(".clock__seconds")
        }
        //console.log("act date:",new Date())
        const offset = parseInt(localStorage.getItem(this.#localStorageName) || 0)
        console.log("load offset:",offset)
        if (offset !== 0) this.#date = new Date(this.#date.getTime() + offset)
        //console.log("offset date:",this.#date)
        this.#date2Time()
        this.#tick()
        setInterval(() => { this.#tick() }, 1000)
    }

    getDate() {
        return new Date(
            this.#date.getTime() + (1000 * this.#secsSinceDate)
        )
    }
    setDate(date) {
        this.#date = date
        this.#secsSinceDate = 0
        localStorage.setItem(this.#localStorageName, 0)
        this.#date2Time()
        this.#updateUI()
    }
    getTime() {
        return this.#time
    }

    addMilliSeconds(x) {
        this.#date = new Date(
            this.#date.getTime() + (1000 * this.#secsSinceDate + x)
        )
        this.#secsSinceDate = 0
        this.#date2Time()
        this.#updateUI()
    }

    pause() {
        this.#pause = true
    }

    continue() {
        const offset = new Date().getTime() - this.#date.getTime()
        //console.log("time offset:", offset, this.#date)
        localStorage.setItem(this.#localStorageName, offset)
        this.#pause = false
    }

    #date2Time() {
        this.#time = {
            hours: this.#date.getHours(),
            minutes: this.#date.getMinutes(),
            seconds: this.#date.getSeconds()
        }
    }

    #tick() {
        if (this.#pause) return
        this.#secsSinceDate++
        if (++this.#time.seconds === 60) {
           this.#time.seconds = 0
            if (++this.#time.minutes === 60) {
               this.#time.minutes = 0
                if (++this.#time.hours === 24) {
                   this.#time.hours = 0
                }
            }
        }
        this.#updateUI()
    }

    #timeToHands() {
        return  [
            {
                el: this.#el.hours,
                angle: (this.#time.hours * 30) + (this.#time.minutes / 2),
                update: this.#time.hours !== this.#timeUI.hours
            },
            {
                el: this.#el.minutes,
                angle: (this.#time.minutes * 6),
                update: this.#time.minutes !== this.#timeUI.minutes
            },
            {
                el: this.#el.seconds,
                angle: (this.#time.seconds * 6),
                update: this.#time.seconds !== this.#timeUI.seconds
            }
        ]
    }

    #updateUI() {
        /*let format = { minimumIntegerDigits: 2 }
        let h =this.#time.hours.toLocaleString('en-US', format)
        let m =this.#time.minutes.toLocaleString('en-US', format)
        let s =this.#time.seconds.toLocaleString('en-US', format)
        this.#el.text_hours.textContent = h
        this.#el.text_minutes.textContent = m
        this.#el.text_seconds.textContent = s*/
        let updated = false
        this.#timeToHands(this.#time).filter(hand => hand.update).forEach(hand => {
            //if the target is 0 than:
            // 1. set the target to 360
            // normal set...
            // 2. remove transition effect
            // 3. set target to 0
            // normal set again
            // 4. add transition effect again
            if (hand.angle === 0) {
                hand.angle = 360
            }
            hand.el.style.webkitTransform = 'rotateZ('+ hand.angle +'deg)'
            hand.el.style.transform = 'rotateZ('+ hand.angle +'deg)'
            if (hand.angle === 360 && !this.#pause) {
                setTimeout(() => {
                    hand.el.classList.remove('clock__transition')
                    hand.el.style.webkitTransform = 'rotateZ(0deg)'
                    hand.el.style.transform = 'rotateZ(0deg)'
                    setTimeout(() => {
                        hand.el.classList.add('clock__transition')
                    }, 300)
                }, 300)
            }
            updated = true
        })
        if (updated) {
            this.#timeUI = { ...this.#time }
            this.#emit("tick", this.#pause)
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