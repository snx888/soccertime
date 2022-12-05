import { VERSION, DEV } from '../../settings.js'
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
            version: root.querySelector('.overlay__version'),
            screenwake: root.querySelector('.overlay__state .state_screenwake span'),
            sound: root.querySelector('.overlay__state .state_sound span'),
            playing: root.querySelector('.overlay__state .state_playing span'),
            roundInfo: root.querySelector('.overlay__state .state_roundinfo'),
            round: root.querySelector('.overlay__state .state_round'),
            game: root.querySelector('.overlay__state .state_game'),
            part: root.querySelector('.overlay__state .state_part')
        }

        if (!DEV) root.querySelector('.overlay__state').style.display = 'none'

        this.#el.version.textContent = VERSION + (DEV ? ' (dev)' : '')
        this.#el.screenwake.textContent = models.screenwake.isSupported()
            ? 'web_asset' //'lock'
            : 'web_asset_off' //'lock_open'

        // react to screenwake changes
        models.screenwake.on(locked => {
            this.#el.screenwake.style.opacity = locked
                ? '.4'
                : '.1'
        })

        models.round.on('state', playing => {
            this.#el.playing.style.opacity = playing
                ? '.4'
                : '.1'
        })

        models.sound.on('test', successfull => {
            this.#el.sound.textContent = successfull ? 'volume_up' :'volume_off'
        })

        models.sound.on('start', id => {
            //console.log('play sound', id)
            this.#el.sound.style.opacity = '.4'
        })

        models.sound.on('end', id => {
            //console.log('end sound', id)
            this.#el.sound.style.opacity = '.1'
        })

        models.sound.on('stop', id => {
            //console.log('stop sound', id)
            this.#el.sound.style.opacity = '.1'
        })

        models.round.on('part', e => {
            this.#updateRound(e)
        })

        this.#updateRound(models.round.getInfo())
    }

    #updateRound (e) {
        if (!DEV) return
        //console.log('update overlay round', e)
        if (e.round) e.opacity = '.4'
        else e.opacity = '.1'
        this.#el.roundInfo.style.opacity = e.opacity
        this.#el.round.textContent = e.round
        this.#el.game.textContent = e.game
        this.#el.part.textContent = e.part
    }

}
