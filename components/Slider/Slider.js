import models from '../../models/index..js'

const template = await fetch(
    new URL('./template.html', import.meta.url).href)
    .then(response => response.text()
)
const style = await fetch(
    new URL('./style.css', import.meta.url).href)
    .then(response => response.text()
)


export default class {

    #el
    #listener = {
        start: [],
        move: [],
        stop: []
    }
    #eStart = null

    constructor(root) {
        root.innerHTML = template
        const styl = document.createElement('style')
        styl.textContent = style
        document.getElementsByTagName('head')[0].appendChild(styl)

        this.#el = {
            root: root,
            container: root.querySelector(".slider__container")
        }

        this.#el.container.addEventListener('touchstart', this.#handleTouchStart, false)
        this.#el.container.addEventListener('touchmove', this.#handleTouchMove, false)
        this.#el.container.addEventListener('touchend', this.#handleTouchEnd, false)
    }

    #handleTouchStart = evt => {
        this.#eStart = evt.touches[0]
        this.#emit("start")
    }

    #handleTouchEnd = evt => {
        this.#eStart = null
        this.#emit("stop")
    }

    #handleTouchMove = evt => {
        if (!this.#eStart) return
    
        const diff = {
            x: this.#eStart.clientX - evt.touches[0].clientX,
            y: this.#eStart.clientY - evt.touches[0].clientY
        }
        //console.log(diff)
        this.#emit("move", diff)
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