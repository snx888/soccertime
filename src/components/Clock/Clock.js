import models from '../../models/index..js'
import Slider from '../Slider/Slider.js'

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
    #prev = 0

    constructor(root) {
        root.innerHTML = template
        const styl = document.createElement('style')
        styl.textContent = style
        document.getElementsByTagName('head')[0].appendChild(styl)

        this.#el = {
            root: root,
            hours: root.querySelector('.clock__hours'),
            minutes: root.querySelector('.clock__minutes'),
            seconds: root.querySelector('.clock__seconds'),
        }

        models.timer.on('start', counter => {
            this.#updateTime()
        })
        models.timer.on('tick', counter => {
            this.#updateTime()
        })

        const slider_sec = new Slider(root.querySelector('.clock__slider_sec'))
        const slider_min = new Slider(root.querySelector('.clock__slider_min'))
        slider_sec.on('start', this.#adjustStart) 
        slider_sec.on('move', this.#adjustSec) 
        slider_sec.on('stop', this.#adjustEnd) 
        slider_min.on('start', this.#adjustStart) 
        slider_min.on('move', this.#adjustMin) 
        slider_min.on('stop', this.#adjustEnd) 
    }

    #updateTime () {
        const time = models.clock.getReadableTime()
        this.#el.hours.textContent = time.hours
        this.#el.minutes.textContent = time.minutes
        this.#el.seconds.textContent = time.seconds
    }

    #adjustStart = () => {
        models.timer.stop()
        models.clock.adjustStart()
    }

    #adjustMin = ({y}) => {
        let diff = parseInt((y) / 50)
        //console.log(y, diff, this.#prev)
        if (diff !== this.#prev) models.clock.adjust(diff, 0)
        this.#prev = diff
    }

    #adjustSec = ({y}) => {
        let diff = parseInt((y) / 50)
        //console.log(y, diff, this.#prev)
        if (diff !== this.#prev) models.clock.adjust(0, diff)
        this.#prev = diff
    }

    #adjustEnd () {
        models.clock.adjustStop()
        //console.log('timer restart', models.clock.getTime())
        models.timer.start(models.clock.getTime())
    }

}
