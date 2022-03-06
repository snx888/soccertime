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
    #interval = null
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
        this.#resetDate()
        //reset time cause it could be wrong(old) due to e.g. screenoff
        window.addEventListener("focus", () => {
            /*const s1 = parseInt((this.#date.getTime() 
            + (1000 * this.#secsSinceDate)) / 1000),
            p1 = this.#secsSinceDate*/
            this.#resetDate()
            /*const s2 = parseInt((this.#date.getTime() 
            + (1000 * this.#secsSinceDate)) / 1000),
            p2 = this.#secsSinceDate,
            d = s2 - s1
            console.log("focus", d, s1, p1, s2, p2)*/
        })
    }

    getDate() {
        return new Date(
            this.#date.getTime() + (1000 * this.#secsSinceDate)
        )
    }
    setDate(date) {
        // set time
        this.#date = date
        this.#secsSinceDate = 0
        // save offset between set and current time
        this.#saveOffset()
        // update ui immediately (do not wait 1 sec)
        this.#date2Time()
        this.#updateUI()
    }
    getTime() {
        return this.#time
    }

    addMilliSeconds(x) {
        // set time
        this.#date = new Date(
            this.#date.getTime() + (1000 * this.#secsSinceDate + x)
        )
        this.#secsSinceDate = 0
        // update ui immediately (do not wait 1 sec)
        this.#date2Time()
        this.#updateUI()
    }

    pause() {
        this.#pause = true
    }

    continue() {
        // save offset between set and current time
        this.#saveOffset()
        this.#pause = false
    }

    #resetDate() {
        //console.log("clock:resetDate()")
        clearInterval(this.#interval)
        // set current time
        this.#date = new Date()
        this.#secsSinceDate = 0
        // get offset from local storage andd add to current time
        this.#loadOffset()
        // update ui immediately (do not wait 1 sec)
        this.#date2Time()
        this.#tick()
        // update each second from now..
        this.#interval = setInterval(() => { this.#tick() }, 1000)
    }

    #saveOffset() {
        const offset = new Date().getTime() - this.#date.getTime()
        //console.log("save offset:", offset, this.#date)
        localStorage.setItem(this.#localStorageName, offset)
    }

    #loadOffset() {
        const offset = parseInt(localStorage.getItem(this.#localStorageName) || 0)
        //console.log("load offset:",offset)
        if (offset !== 0) this.#date = new Date(this.#date.getTime() + offset)
        //console.log("offset date:",this.#date)
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