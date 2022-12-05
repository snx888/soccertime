import { DEV } from '../../settings.js'
import models from '../../models/index..js'
import Timer from '../../components/Timer/Timer.js'
import Games from '../../components/Games/Games.js'
import Teams from '../../components/Teams/Teams.js'
import Clock from '../../components/Clock/Clock.js'

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
            buttonStopRound: root.querySelector('.sync__button_stop_round'),
            buttonDeleteOffset: root.querySelector('.sync__button_delete_offset')
        }
            
        if (!DEV) {
            this.#el.buttonStopRound.style.display = 'none'
            this.#el.buttonDeleteOffset.style.display = 'none'
        }

        root.querySelector('.sync__button_start')
            .addEventListener('click', () => {
                models.round.playing = true
                models.navigator.navigate('play')
            })
        root.querySelector('.sync__button_players')
            .addEventListener('click', () => {
                models.navigator.navigate('players')
            })
        this.#el.buttonStopRound
            .addEventListener('click', () => {
                models.round.stop()
            })
        this.#el.buttonDeleteOffset
            .addEventListener('click', () => {
                models.clock.clearOffset()
            })

        new Timer(root.querySelector('.sync__timer'))
        new Games(root.querySelector('.sync__games'))
        new Teams(root.querySelector('.sync__teams'))
        new Clock(root.querySelector('.sync__clock'))
    }

}
