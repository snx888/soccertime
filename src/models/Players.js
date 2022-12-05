export default class Players {

    #localStorageName = "soccertime_players"
    #players = []
    #nextId = 0
    #listener = {
        deleted: [],
        added: [],
        changed: []
    }

    constructor(names) {
        this.#loadPlayers(names)
        //console.log(this.#players)
    }

    getPlayers () {
        return [...this.#players]
    }
    getPlayersPresent () {
        return [...this.#players].filter(player => player.present)
    }

    setPlayerPresence (id, present) {
        const player = this.#players.find(player => player.id === id)
        if (!player) return
        player.present = present
        this.#savePlayers()
        this.#emit('changed', {...player})
    }

    removePlayer (id) {
        const idx = this.#players.findIndex(player => player.id === id)
        if (idx < 0) return
        this.#players.splice(idx, 1)
        this.#savePlayers()
        this.#emit('deleted', id)
    }

    addPlayer (name) {
        if (!name) return
        const player = {
            id: this.#nextId++,
            name,
            present: false
        }
        this.#players.push(player)
        this.#savePlayers()
        this.#emit('added', {...player})
    }

    #loadPlayers (names) {
        const ls = JSON.parse(localStorage.getItem(this.#localStorageName)) || {}
        if (ls.day) {
            this.#players = ls.players
            this.#nextId = ls.nextId
            if (this.#day !== ls.day) {
                // reset presence
                this.#players.forEach(player => player.present = false)
            }
        } else {
            this.#nextId = 0
            this.#players = names.map(name => { return {
                id: this.#nextId++,
                name,
                present: false
            }})
        }
    }

    #savePlayers () {
        localStorage.setItem(this.#localStorageName, JSON.stringify({
            players: this.#players,
            nextId: this.#nextId,
            day: this.#day
        }))
    }

    get #day () {
        const date = new Date()
        return date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate()
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