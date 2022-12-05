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
    #manageMode = false

    constructor(root) {
        root.innerHTML = template
        const styl = document.createElement('style')
        styl.textContent = style
        document.getElementsByTagName('head')[0].appendChild(styl)

        this.#el = {
            root: root,
            container: root.querySelector(".player__container"),
            list: root.querySelector(".player__list"),
            new: root.querySelector(".player__input_name")
        }

        root.querySelector(".player__button_back")
            .addEventListener("click", () => {
                if (this.#manageMode) {
                    this.#manageMode = false
                    this.#el.container.classList.remove('manageMode')
                } else {
                    models.navigator.navigateBack()
                }
            })
        this.#el.new.addEventListener('keyup', e => {
            if (e.key === 'Enter') this.#newPlayer()
        })
        root.querySelector(".player__button_add")
            .addEventListener('click', e => {
                this.#newPlayer()
            })
        root.querySelector(".player__button_manage")
            .addEventListener('click', e => {
                this.#manageMode = true
                this.#el.container.classList.add('manageMode')
            })
        root.querySelector(".player__button_teams")
            .addEventListener('click', e => {
                this.#el.container.classList.remove('buildMode')
                models.navigator.navigateBack()
            })

        models.players.on('deleted', id => {
            const el = Array.from(this.#el.list.children).find(el => el.getAttribute('pid') == id)
            if (!el) return
            el.remove()
        })
        models.players.on('added', player => {
            this.#addPlayer(player)
        })
        models.round.on('part', e => {
            this.#updateNextMode(e)
        })

        // load initial players
        this.#el.list.textContent = ''
        models.players.getPlayers().forEach(player => this.#addPlayer(player))

        // load initial round info
        this.#updateNextMode(models.round.getInfo())
    }

    setBuildMode() {
        this.#el.container.classList.add('buildMode')
    }

    #updateNextMode (e) {
        if (e.game > 1 || e.part > 1) {
            this.#el.container.classList.add('nextMode')
        } else {
            this.#el.container.classList.remove('nextMode')
        }
    }

    #addPlayer(player) {
        const label = document.createElement('label')
        label.setAttribute('pid', player.id)
        const icon = document.createElement('span')
        icon.classList.add('material-icons')
        icon.append('cancel')
        const input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        if (player.present) input.checked = true
        input.addEventListener('change', e => {
            if (this.#manageMode) {
                models.players.removePlayer(player.id)
            } else {
                models.players.setPlayerPresence(player.id, input.checked)
            }
        })
        label.appendChild(input)
        label.append(player.name)
        label.appendChild(icon)
        this.#el.list.appendChild(label)
    }

    #newPlayer () {
        const name = this.#el.new.value
        if (name != null) {
            models.players.addPlayer(name)
            this.#el.new.value = ''
        }
    }

}
