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
            parts: root.querySelector(".games__parts"),
        }

        models.round.on('part', e => {
            this.#updateGames(e)
        })

        // load initial round data ..
        const e = models.round.getInfo()
        this.#updateGames(e)
    }

    #updateGames ({games, game, parts, part}) {
        //console.log('updateGames', games, game, parts, part)
        this.#el.parts.textContent = ''
        for (var g = 1; g <= games; g++) {
            const elGame = document.createElement('div')
            elGame.classList.add ('game')
            if (g <= game) elGame.classList.add('active')
            for (var p = 1; p <= parts; p++) {
                const elPart = document.createElement('div')
                elPart.classList.add ('part')
                if (g < game) elPart.classList.add('active')
                if (g === game && p <= part) elPart.classList.add('active')
                elGame.append(elPart)
            }
            this.#el.parts.append(elGame)
        }
    }

}
