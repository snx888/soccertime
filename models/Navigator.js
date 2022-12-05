export default class Navigator {
    #nav
    #current
    #listener = {
        changed: []
    }

    constructor (nav) {
        this.#nav = nav
        window.onhashchange = this.#onHashChange.bind(this)
        this.#onNavigate(window.location.hash.substring(1))
    }

    navigateBack () {
        window.history.back()
    }
    navigate (target) {
        //console.log('navigate:', target)
        window.location = '#'+target
    }
    getCurrent () {
        return this.#current
    }

    #onHashChange (e) {
        const hashIndex = e.newURL.indexOf('#')
        const hash = hashIndex < 0 ? '' : e.newURL.substring(hashIndex+1)
        //console.log('onHashChange', e, hashIndex, hash)
        this.#onNavigate(hash)
    }
    #onNavigate (target) {
        //console.log('onNavigate:', target)
        let destination = this.#nav.filter(item => item === target)
        if (destination.length === 0) {
            destination = [this.#nav[0]] //take the first one as default.. 
        } 
        if (destination.length === 0) return
        this.#current = destination[0]
        //console.log('onNavigate', destination[0], target)
        this.#emit('changed', destination[0])
    }

    on (event, func) {
        if (!this.#listener[event]) return
        this.#listener[event].push(func)
        // fire event immediately to react to initial navigation (before on)
        //console.log(this.#current)
        if (this.#current) this.#emit('changed', this.#current)
    }

    #emit (event, ...params) {
        if (!this.#listener[event]) return
        this.#listener[event].forEach(func => {
            func(...params)
        })
    }

}
