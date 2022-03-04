import Clock from "./src/res/modules/Clock/Clock.js"
import Timer from "./src/res/modules/Timer/Timer.js.js"
import ThemeSwitcher from "./src/res/modules/ThemeSwitcher/ThemeSwitcher.js.js"
import Circlebar from "./src/res/modules/Circlebar/Circlebar.js.js"
import Slidebutton from "./src/res/modules/Slidebutton/Slidebutton.js"
import Navigation from "./src/res/modules/Navigation/Navigation.js.js"
import ScreenWake from "./src/res/modules/ScreenWake/ScreenWake.js.js"
import Sound from "./src/res/modules/Sound/Sound.js"



let view = {
  error: document.querySelector('.view_error'),
  clock: document.querySelector('.view_sync'),
  timer: document.querySelector('.view_timer')
}
let el = {
  timer_text: document.querySelector(".timer_text"),
  log: document.querySelector(".log"),
  themeswitcher: document.querySelector(".themeswitcher"),
  screenwake: document.querySelector(".state_screenwake span"),
  sound: document.querySelector(".state_sound span")
}
let obj = {
  themeswitcher: new ThemeSwitcher(document.querySelector(".themeswitcher")),
  clock: new Clock(document.querySelector(".sync_clock")),
  slidebutton: new Slidebutton(document.querySelector(".sync_slide")),
  timer: new Timer(),
  screenwake: new ScreenWake(),
  sound: new Sound([
    { id: 'end', url: './res/end.mp3' },
    { id: 'tick', url: './res/tick.mp3' }
  ]),
  cirlcebar: new Circlebar(document.querySelector(".timer_circle"))
}

obj.themeswitcher.setRandomTheme()

// hide things in production..
if (window.location.pathname.indexOf("/dev") < 0) {
  el.themeswitcher.style.display = "none"
}

// react to screenwake changes
el.screenwake.textContent = obj.screenwake.isSupported()
  ? 'web_asset' //'lock'
  : 'web_asset_off' //'lock_open'
obj.screenwake.on(locked => {
  el.screenwake.style.opacity = locked
    ? '.4'
    : '.1'
})

// set audio test
obj.sound.on("test", successfull => {
  el.sound.textContent = successfull ? 'volume_up' :'volume_off'
})
obj.sound.on("start", id => {
  //console.log("play sound", id)
  el.sound.style.opacity = '.4'
})
obj.sound.on("end", id => {
  //console.log("end sound", id)
  el.sound.style.opacity = '.1'
})
obj.sound.on("stop", id => {
  //console.log("stop sound", id)
  el.sound.style.opacity = '.1'
})


obj.timer.on("start", counter => {
  //console.log("timer start")
  obj.cirlcebar.setProgress(counter / 300 * 100)
  const text = obj.timer.getCounterText(true)
  el.timer_text.innerHTML = text.minutes + "<span>:</span>" + text.seconds
  obj.screenwake.lock()
})
obj.timer.on("tick", counter => {
  //console.log("tick: ", counter)
  //if ((counter-3)%10 === 0) {
  if (counter === 3) {
    obj.sound.play('end')
  }
  obj.cirlcebar.setProgress(counter / 300 * 100)
  const text = obj.timer.getCounterText(true)
  el.timer_text.innerHTML = text.minutes + "<span>:</span>" + text.seconds
})
obj.timer.on("stop", () => {
  //console.log("timer stop")
  obj.sound.stop('end')
  obj.screenwake.unlock()
})


obj.clock.on("tick", pause => {
  //if (navigator.getCurrent() !== 'clock' && navigator.getCurrent() !== '') return
  if (pause)
  obj.sound.play('tick')
})

obj.slidebutton.on("start", () => {
  obj.clock.pause()
})
obj.slidebutton.on("move", x => {
  //console.log(x)
  // x * 50 <-- sensitivity
  if (x !== 0) obj.clock.addMilliSeconds(x * 50)
})
obj.slidebutton.on("stop", () => {
  obj.clock.continue()
})

const navigator = new Navigation([
  {
    target: "",
    on: () => {
      //console.log("navigate: ..")
      obj.timer.stop()
      view.error.classList.add("hidden")
      view.clock.classList.remove("hidden")  
      view.timer.classList.add("hidden")  
    }
  },
  {
    target: "clock",
    on: () => { 
      obj.timer.stop()
      //console.log("navigate: clock")
      view.error.classList.add("hidden")
      view.clock.classList.remove("hidden")  
      view.timer.classList.add("hidden")  
    }
  },
  {
    target: "timer", 
    on: () => {
      //console.log("navigate: timer")
      obj.timer.start(obj.clock.getTime())
      view.error.classList.add("hidden")
      view.clock.classList.add("hidden")
      view.timer.classList.remove("hidden")  
    }
  }
])


document.querySelector('.button_start')
  .addEventListener("click", () => {
    navigator.navigate("timer")
  })

document.querySelector('.button_stop')
  .addEventListener("click", () => {
    //navigator.navigate("")
    navigator.navigateBack()
  })




screen.orientation.lock("portrait")

window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }
});
