export default class ScreenWake {
    #supported = false
    #lock = null
    #setLock = false
    #listener

    constructor() {
        if ('wakeLock' in navigator) {
            // Screen Wake Lock API supported
            //console.log('wake lock supported')
            this.#supported = true
        }
        //reset lock cause it may be released due to e.g. screenoff or focus change (blur this)
        window.addEventListener("focus", async () => {
            if (this.#setLock) this.#requestLock()
        })
        //window.addEventListener('visibilitychange'
    }

    async lock() {
        if (!this.#supported) return
        this.#setLock = true
        this.#requestLock()
    }

    unlock() {
        this.#setLock = false
        if (!this.#lock) return
        this.#lock.release()
        this.#lock = null
    }

    on(listener) {
        this.#listener = listener
    }
    
    isSupported() {
        return this.#supported
    }

    async #requestLock() {
        try {
            this.#lock = await navigator.wakeLock.request('screen')
            this.#lock.addEventListener('release', this.#onRelease.bind(this))
            //console.log("wake lock enabled - release status:", this.#lock.released)
            if (this.#listener) this.#listener(true)
        } catch (err) {
            //console.error("wake lock ERROR", `${err.name}, ${err.message}`)
        }
    }

    #onRelease() {
        //console.log('wake lock released')
        this.#lock = null
        if (this.#listener) this.#listener(false)
    }

}
