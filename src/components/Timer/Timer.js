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

    constructor(root) {
        root.innerHTML = template
        const styl = document.createElement('style')
        styl.textContent = style
        document.getElementsByTagName('head')[0].appendChild(styl)

        this.#el = {
            root: root,
            time: root.querySelector('.timer__time'),
        }

        models.timer.on('start', counter => {
            this.#updateTime()
        })
        models.timer.on('tick', counter => {
            this.#updateTime()
        })
    }

    #updateTime () {
        const time = models.timer.getReadableTime()
        this.#el.time.textContent = time.minutes + ':' + time.seconds
    }

}
