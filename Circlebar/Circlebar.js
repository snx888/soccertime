const template = await fetch(
    new URL('./Circlebar.html', import.meta.url).href)
    .then(response => response.text()
)

export default class Circlebar {
    #el
    #progress

    constructor(root) {
        root.innerHTML = template
        this.#el = {
            root: root,
            container: root.querySelector(".circlebar__container"),
            bar: root.querySelector(".circlebar__bar")
        }
        this.#progress = parseInt(root.dataset.progress) || 88
        this.#el.bar.style.strokeLinecap = root.dataset.rounded ? "round" : ""
        this.#updateUI()
    }

    setProgress(progress) {
        this.#progress = parseInt(progress)
        //console.log(progress, this.#progress)
        if (this.#progress > 100) this.#progress = 100
        if (this.#progress < 0) this.#progress = 0
        this.#el.root.dataset.progress = this.#progress
        this.#updateUI()
    }

    getProgress() {
        return this.#progress
    }

    #updateUI() {
        var c = Math.PI*(90*2)
        var pct = ((100-this.#progress)/100)*c
        //console.log(c, pct, this.#progress)
        this.#el.bar.style.strokeDashoffset = pct
        this.#el.container.dataset.pct = this.#progress
    }
}
