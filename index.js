import Idle from "./views/Idle/Idle.js"
import Player from "./views/Player/Player.js"
import Play from "./views/Play/Play.js"
import Overlay from "./views/Overlay/Overlay.js"

import { PLAYERS } from "./settings.js"

import ModelClock from './models/Clock.js'
import ModelPlayers from './models/Players.js'
import ModelScreenWake from './models/ScreenWake.js'
import ModelSound from './models/Sound.js'
import ModelTimer from './models/Timer.js'
import ModelNavigator from './models/Navigator.js'
import ModelRound from './models/Round.js'

import models from './models/index..js'


localStorage.clear()

// dedfine models ..
models.navigator = new ModelNavigator([
	'idle', 'players', 'play'
])
models.clock = new ModelClock()
models.players = new ModelPlayers(PLAYERS)
/*TODO 300 sekunden via settings*/
models.timer = new ModelTimer()
models.round = new ModelRound()
models.screenwake = new ModelScreenWake()
/*TODO via settings*/
models.sound = new ModelSound([
    { id: 'end', url: './res/end.mp3' },
    { id: 'tick', url: './res/tick.mp3' }
])


/*TODO use silent audio to force screen on*/


// define views ..
const views = {
	idle: document.querySelector('.view_idle'),
	play: document.querySelector('.view_play'),
	players: document.querySelector('.view_players')
}


// render views and overlay ..
new Idle(views.idle)
const player = new Player(views.players)
new Play(views.play)
new Overlay(document.querySelector(".overlay"))


// display views based on navigation ..
// start timer if its not running ..
models.navigator.on('changed', e => {
	//if (e === 'timer') models.timer.startIfNotRunning(models.clock.getTime())
	Object.keys(views).forEach(view => {
		if (view === e) views[view].classList.remove('hidden')
		else views[view].classList.add('hidden')
	})
})


// update round according to players loaded initially ..
models.round.update()


models.round.on('state', playing => {
	//console.log("round playing: ", playing)
	if (playing) {
		// set screelock if playing starts ..
		models.screenwake.lock()
	} else {
		// disable sound and screelock if playing is stops ..
		models.sound.stop('end')
		models.screenwake.unlock()
	}
})

// at the end of a round jump to player selection ..
models.round.on('finish', () => {
	player.setBuildMode()
	models.navigator.navigate('players')
})


// update again on players change ..
models.players.on('added', () => {
	models.round.update()
})
models.players.on('deleted', () => {
	models.round.update()
})
models.players.on('changed', () => {
	models.round.update()
})


// start round if timer starts ..
models.timer.on("start", counter => {
	//console.log("timer start")
	models.round.start()
})
// play sound for timer countdown ..
// update round on zero timer ..
models.timer.on("tick", counter => {
	//console.log("timer tick: ", counter, models.round.playing)
	if (!models.round.playing) return
	if (counter === 3) {
		models.sound.play('end')
	}
	if (counter === 0) {
		models.round.next()
	}
})
// disable sound and screelock if timer is stops ..
models.timer.on("stop", () => {
	//console.log("timer stop")
})


// if the clock has changed by adjusting, set timer an force a tick ..
models.clock.on('changed', time => {
	models.timer.sync(time)
})


/*try {
screen.orientation.lock("portrait").then().catch()
}
catch {}*/

// if there is no round active, go to player selection immediately ..
if (models.round.getInfo().round >= 1) {} else {
	models.navigator.navigate('players')
}

// start timer
models.timer.startIfNotRunning(models.clock.getTime())


window.addEventListener("load", () => {
    if ("serviceWorker" in window.navigator) {
		window.navigator.serviceWorker.register("service-worker.js")
    }
})
