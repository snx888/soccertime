export default class ScreenWake {
    #supported = false
    #lock = null
    #listener

    constructor() {
        if ('wakeLock' in navigator) {
            // Screen Wake Lock API supported
            //console.log('wake lock supported')
            this.#supported = true
        }
    }

    async lock() {
        if (!this.#supported) return
        try {
            this.#lock = await navigator.wakeLock.request()
            this.#lock.addEventListener('release', () => {
                //console.log('wake lock released')
                if (this.#listener) this.#listener(false)
            })
            //console.log("wake lock enabled - release status:", this.#lock.released)
            if (this.#listener) this.#listener(true)
        } catch (err) {
            //console.error("wake lock ERROR", `${err.name}, ${err.message}`)
        }
    }

    unlock() {
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
}
