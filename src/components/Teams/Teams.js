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
    #icons = [ 'looks_one', 'looks_two', 'looks_3', 'looks_4' ]
    #teams = [ 'Old', 'Young', 'Others', 'Others' ]

    constructor(root) {
        root.innerHTML = template
        const styl = document.createElement('style')
        styl.textContent = style
        document.getElementsByTagName('head')[0].appendChild(styl)

        this.#el = {
            root: root,
            teams: root.querySelector('.teams__container'),
        }

        models.round.on('team', teams => {
            this.#updateTeams(teams)
        })

        // add info on player count change next round..
        models.players.on('deleted', id => {
            this.#updateTeams(models.round.getInfo().teams)
        })
        models.players.on('added', player => {
            this.#updateTeams(models.round.getInfo().teams)
        })
        models.players.on('changed', player => {
            this.#updateTeams(models.round.getInfo().teams)
        })
        
        // load initial round data ..
        const e = models.round.getInfo()
        this.#updateTeams(e.teams)
    }

    #updateTeams (teams) {
        //console.log('updateTeams', teams)
        this.#el.teams.textContent = ''
        teams.forEach((team, idx) => {
            const elTeam = document.createElement('div')
            const elIcon = document.createElement('span')
            elIcon.className = 'material-icons'
            elIcon.textContent = this.#icons[idx]
            if (models.round.getInfo().round === 1) {
                // old vs young..
                elTeam.innerHTML = `${this.#teams[idx]}<br>( ${team.length} )`
            } else {
                elTeam.innerHTML = team
                    .map(player => `<span>${player.name}</span>`)
                    .join('')
            }
            elTeam.prepend(elIcon)
            this.#el.teams.append(elTeam)
        })
        const elNext = document.createElement('p')
        const players = teams.reduce((acc, team) => acc += team.length, 0)
        const nextPlayers = models.players.getPlayersPresent().length
        let diff = nextPlayers - players
        elNext.textContent = ''
        if (diff !== 0) {
            if (diff > 0) diff = '+' + diff
            else diff =  '' + diff
            diff = diff.substring(0,1) + ' ' + diff.substring(1)
            elNext.textContent = diff + ' next round'
        }
        this.#el.teams.append(elNext)
    }

}
