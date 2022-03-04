export default class Sound {
    #test = new Audio("./modules/Sound/test.mp3") //250ms silence
    #enabled = false //set true after first user interaction
    #sounds = []
    #listener = {
        test: [],
        start: [],
        stop: [],
        pause: [],
        end: []
    }

    constructor(sounds) {
        if (Array.isArray(sounds)) this.#sounds = sounds
        else if (typeof sounds === 'object') this.#sounds.push(sounds)

        this.#sounds.forEach(sound => {
            sound.obj = new Audio(sound.url)
            sound.obj.onended = function () {
                this.#emit("end", sound.id)
            }.bind(this)
        })
        // before first interaction the brwoser will prevent audio 
        // playback and raise an exception, so let's check
        // at the first click..
        document.addEventListener("click", () => {
            //console.log('sound audio test')
            this.#test.play().then(r => {
                this.#emit("test", true)
                this.#enabled = true
            }).catch(e => {
                this.#emit("test", false)
            })
        }, {once: true})
    }

    play(sound) {
        if (!this.#enabled) return
        this.#play(this.#sounds.filter(s => s.id === sound))
    }
    pause(sound=null) {
        if (!sound) this.#pause(this.#sounds)
        else this.#pause(this.#sounds.filter(s => s.id === sound))
    }
    stop(sound=null) {
        if (!sound) this.#stop(this.#sounds)
        else this.#stop(this.#sounds.filter(s => s.id === sound))
    }

    #play(sounds) {
        sounds.forEach(s => {
            s.obj.play().then(() => {
                this.#emit("start", s.id)
            })
        })
    }
    #pause(sounds) {
        sounds.forEach(s => {
            s.obj.pause()
            this.#emit("pause", s.id)
        })
    }
    #stop(sounds) {
        sounds.forEach(s => {
            s.obj.pause()
            s.obj.currentTime = 0
            this.#emit("stop", s.id)
        })
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