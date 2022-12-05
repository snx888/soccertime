import { DEV } from '../../settings.js'
import models from '../../models/index..js'
import Timer from '../../components/Timer/Timer.js'
import Games from '../../components/Games/Games.js'
import Teams from '../../components/Teams/Teams.js'

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
            bar: root.querySelector('.round__bar'),
            buttonTimer: root.querySelector('.round__button_timer')
        }
        
        if (!DEV) this.#el.buttonTimer.style.display = 'none'

        new Timer(root.querySelector('.round__timer'))
        new Games(root.querySelector('.round__games'))
        new Teams(root.querySelector('.round__teams'))

        root.querySelector('.round__button_stop')
            .addEventListener('click', () => {
                models.round.playing = false
                models.navigator.navigateBack()
            })
        root.querySelector('.round__button_players')
            .addEventListener('click', () => {
                models.navigator.navigate('players')
            })
        this.#el.buttonTimer
            .addEventListener('click', () => {
                models.timer.setTo5()
            })

        models.timer.on('start', counter => {
            this.#updateProgress(counter)
        })
        models.timer.on('tick', counter => {
            this.#updateProgress(counter)
        })
    }

    #updateProgress (counter) {
        let progress = 100 - parseInt(counter / 300 * 100)
        //console.log(progress, counter)
        if (progress > 100) progress = 100
        if (progress < 0) progress = 0
        this.#el.bar.style.width = progress + '%'
        if (progress > 89) {
            this.#el.bar.style.background = 'var(--sec30)'
        } else if (progress > 79) {
            this.#el.bar.style.background = 'var(--min1)'
        } else {
            this.#el.bar.style.background = 'var(--min5)'
        }
    }

}
