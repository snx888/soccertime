export default class Navigation {
    #nav
    #current

    constructor(nav) {
        this.#nav = nav

        /*window.onhashchange = function(e) {
            const hashIndex = e.newURL.indexOf("#")
            const hash = hashIndex < 0 ? "" : e.newURL.substring(hashIndex+1)
            //console.log(hashIndex, hash)
            this.#onNavigate(hash)
        }*/
        window.onhashchange = this.#onHashChange.bind(this)
        
        /*if (window.location.hash) {
            console.log("nav @load:", window.location.hash)*/
            this.#onNavigate(window.location.hash.substring(1))
        /*}*/
  
    }

    navigateBack() {
        window.history.back()
    }
    navigate(target) {
        //console.log("navigate:", target)
        window.location = '#'+target
    }
    getCurrent() {
        return this.#current
    }

    #onHashChange(e) {
        const hashIndex = e.newURL.indexOf("#")
        const hash = hashIndex < 0 ? "" : e.newURL.substring(hashIndex+1)
        //console.log("onHashChange", e, hashIndex, hash)
        this.#onNavigate(hash)
    }
    #onNavigate(target) {
        //console.log("onNavigate:", target)
        let destination = this.#nav.filter(item => item.target === target)
        if (destination.length === 0) {
            destination = this.#nav.filter(item => item.target === "") 
        } 
        if (destination.length === 0) return
        this.#current = target
        destination[0].on()
    }

}