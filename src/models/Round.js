import models from './index..js'

export default class Round {

    #localStorageName = 'soccertime_round'
    #round
    #game
    #part
    #teams = []
    #games
    #parts
    #listener = {
        'part': [],
        'team': [],
        'finish': [],
        'state': []
    }
    #playing = false


    constructor () {
        this.#loadRound()
    }

    get playing () {
        return this.#playing
    }
    set playing (v) {
        this.#playing = v
        this.#emit('state', this.#playing)
    }

    update () {
        // if started and we're in the first game..
        if (this.#round > 0
            && this.#part === 1
            && this.#game === 1) {
            // create new round..
            //console.log('update', this.#teams, this.#part, this.#game)
            /*TODO keeping the current teams and just extending them
            but this is an issue cause in case of 4 player teams
            we don't know who is on the field - so we can't push the 4th
            guy to a potential new team*/
            this.#newRound()
            this.#saveRound()
            this.#emitPart()
            this.#emitTeam()
        }
    }

    start () {
        // if not started (otherwise return)..
        if (this.#round > 0) return
        //console.log('start', this.#teams, this.#part, this.#game)
        this.#newRound()
        this.#saveRound()
        this.#emitPart()
        this.#emitTeam()
    }

    stop () {
        this.#round = undefined
        this.#game = undefined
        this.#part = undefined
        this.#teams = []
        this.#games = undefined
        this.#parts = undefined
        this.#saveRound()
        this.#emitPart()
        this.#emitTeam()
    }

    next () {
        //console.log('next', this.#round, this.#game, this.#part)
        this.#part++
        if (this.#part > this.#parts) {
            this.#game++
            this.#part = 1
            if (this.#game > this.#games) {
                this.#round++
                this.#game = 1
                this.#emit('finish')
                this.#newRound()
            }
            this.#emitTeam()
        }
        this.#saveRound()
        this.#emitPart()
        //console.log('after',this.#round, this.#game, this.#part)
    }

    getInfo () {
        return {
            games: this.#games,
            parts: this.#parts,
            game: this.#game,
            part: this.#part,
            round: this.#round,
            teams: [...this.#teams]
        }
    }

    #newRound () {
        const players = models.players.getPlayersPresent()
        // calculate numbers..
        const playersCnt = players.length
        let teamsCnt = parseInt(playersCnt / 3)
        if (teamsCnt < 2) teamsCnt = 2
        const gamesCnt = teamsCnt * ( teamsCnt - 1) / 2
        let partsCnt = 2
        if (playersCnt === 6) partsCnt = 3
        if ([7,8].includes(playersCnt)) partsCnt = 4
        // build teams..
        const teams = Array(teamsCnt).fill().map(i => [])
        //if (this.#round > 1) {
            let team = 0
            players.sort((a,b) => 0.5 - Math.random())
            players.forEach(player => {
                teams[team].push(player)
                if (++team === teamsCnt) team = 0
            })
        /*} else {
            const playersPerTeam = parseInt(playersCnt / teamsCnt)
            const remainingPlayers = playersCnt % teamsCnt
            let team = 0
            let inTeam = 0
            let remaining = remainingPlayers
            console.log('here', playersPerTeam, remainingPlayers)
            players.forEach(player => {
                console.log('player', team, inTeam, remaining)
                teams[team].push(player)
                if (++inTeam === playersPerTeam) {
                    if (team === 0 && remaining > 0) { remaining-- }
                    else if (team === 1 && remaining > 1) { remaining-- }
                    else {
                        team++
                        inTeam = 0
                        remaining = remainingPlayers
                    }
                }
            })
        }*/
        //console.log(teams)
        this.#teams = teams
        this.#games = gamesCnt
        this.#parts = partsCnt
        this.#part = 1
        this.#game = 1
        if (!this.#round) this.#round = 1
    }

    #loadRound () {
        const ls = JSON.parse(localStorage.getItem(this.#localStorageName)) || {}
        if (ls.day && ls.day === this.#day) {
            this.#round = ls.round
            this.#game = ls.game
            this.#part = ls.part
            this.#teams = ls.teams
            this.#games = ls.games
            this.#parts = ls.parts
        } else {
        }
    }

    #saveRound () {
        localStorage.setItem(this.#localStorageName, JSON.stringify({
            round: this.#round,
            game: this.#game,
            part: this.#part,
            teams: this.#teams,
            games: this.#games,
            parts: this.#parts,
            day: this.#day
        }))
    }

    get #day () {
        const date = new Date()
        return date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate()
    }

    #emitTeam () {
        /* TODO return the active teams... */
        this.#emit('team', [...this.#teams])
    }

    #emitPart () {
        this.#emit('part', {
            games: this.#games,
            parts: this.#parts,
            game: this.#game,
            part: this.#part,
            round: this.#round
        })
    }

    on (event, func) {
        if (!this.#listener[event]) return
        this.#listener[event].push(func)
    }

    #emit (event, ...params) {
        if (!this.#listener[event]) return
        this.#listener[event].forEach(func => {
            func(...params)
        })
    }
    
}
