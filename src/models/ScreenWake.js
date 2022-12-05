export default class ScreenWake {

    #enabled = false
    #lock = null
    #listener = {
        test: [],
        state: []
    }
    #noSleep = new NoSleep()

    constructor () {
        // before first interaction the browser will prevent audio 
        // playback and raise an exception, so let's check
        // at the first click..
        document.addEventListener('click', () => {
            //console.log('sound audio test')
            this.#noSleep.enable().then(r => {
                this.#emit('test', true)
                this.#enabled = true
            }).catch(e => {
                this.#emit('test', false)
            })
        }, {once: true})
    }

    lock () {
        if (!this.#enabled) return
        this.#noSleep.enable()
        this.#lock = true
        this.#emit('state', true)
    }

    unlock () {
        if (!this.#lock) return
        this.#noSleep.disable()
        this.#lock = null
        this.#emit('state', false)
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
