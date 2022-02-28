import '../hammer.min.js'

const template = await fetch(
    new URL('./Slidebutton.html', import.meta.url).href)
    .then(response => response.text()
)

export default class Slidebutton {
    #el
    #hammer
    #listener = {
        start: [],
        move: [],
        stop: []
    }
    #ePrev = null

    constructor(root) {
        let childs = []
        if (root.children) {
            for (let child of root.children) {
                childs.push(child)  
            }
            //console.log(root, childs)
        } else console.log("nix")
        root.innerHTML = template
        this.el = {
            root: root,
            container: root.querySelector(".slidebutton__container")
        }
        if (childs) {
            //console.log(root, childs, this.el.container)
            for (let child of childs) {
                //console.log(child)
                this.el.container.appendChild(child)  
            }
        }
        this.#hammer = new Hammer(this.el.container)
        this.#hammer.on("hammer.input", function(e) {
            //console.log(e)
            if (e.isFirst) {
                this.#emit("start", e)
                this.#ePrev = e
                return
            }
            if (e.isFinal) {
                this.#emit("stop", e)
                this.#ePrev = null
                return
            }
            if (this.#ePrev !== null){
                var x = e.deltaX - this.#ePrev.deltaX
                //var y = e.deltaY - this.#ePrev.deltaY
                //console.log(x, y)
                if (x !== 0) this.#emit("move", x, e)
            }
            this.#ePrev = e
        }.bind(this))
        //this.updateUI()
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