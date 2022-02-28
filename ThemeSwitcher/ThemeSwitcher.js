const template = await fetch(
    new URL('./ThemeSwitcher.html', import.meta.url).href)
    .then(response => response.text()
)
const templateItem = await fetch(
    new URL('./ThemeSwitcherItem.html', import.meta.url).href)
    .then(response => response.text()
)

export default class ThemeSwitcher{
    #el = {}
    #themes = []
    #currentTheme = ""
    #attributeName = "data-theme"
    #localStorageName = "theme"
    #defaultThemeName = ":root"
    #defaultTheme = {}
    #attrBg = "--background"
    #attrPri = "--primary"
    #attrSec = "--secondary"
    #attrTer = "--tertiary"
    #attrBgOn = "--onBackground"

    constructor(root) {
        root.innerHTML = template
        this.#el = {
            root: root,
            themes: root.querySelector(".themeswitcher__themes"),
            title: root.querySelector(".themeswitcher__title"),
            items: []
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.#searchThemes()
                this.#buildUI()
            })
            //window.onload = () => { this.#searchThemes() }
        } else {
            this.#searchThemes()
            this.#buildUI()
        }
        this.setTheme(localStorage.getItem(this.#localStorageName) || "")
    }

    #buildUI() {
        this.#el.item = []
        this.#el.themes.innerHTML = ""
        let n = document.createElement("article")
        n.innerHTML = templateItem
        let i = n.querySelector(".themeswitcher__item")
        this.#themes.forEach(theme => {
            //console.log(theme)
            let c = i.cloneNode(true)
            const name = c.querySelector(".themeswitcher__name")
            name.textContent = theme.name
            //c.textContent = theme.name
            //console.log(this.#attrBg, theme.attrs[this.#attrBg])
            const cb = this.#getAttr(theme, this.#attrBg, this.#getAttr(this.#defaultTheme, this.#attrBg, "white"))
            const cp = this.#getAttr(theme, this.#attrPri, this.#getAttr(this.#defaultTheme, this.#attrPri, "blue"))
            const cs = this.#getAttr(theme, this.#attrSec, this.#getAttr(this.#defaultTheme, this.#attrSec, "violet"))
            const ct = this.#getAttr(theme, this.#attrTer, this.#getAttr(this.#defaultTheme, this.#attrTer, undefined))
            const co = this.#getAttr(theme, this.#attrBgOn, this.#getAttr(this.#defaultTheme, this.#attrBgOn, "black"))
            c.style.backgroundColor = cp
            c.style.borderColor = cb
            const b = c.querySelector(".themeswitcher__item__before")
            b.style.backgroundColor = cs
            const a = c.querySelector(".themeswitcher__item__after")
            a.style.backgroundColor = ct || co
            //c.title = theme.name
            c.tag = theme.name
            this.#el.themes.appendChild(c)
            this.#el.item.push(c)
            c.addEventListener("click", () => {
                //console.log(getComputedStyle(this.#el.title).opacity)
                if (getComputedStyle(this.#el.title).opacity > 0)
                this.setTheme(c.tag)
            })
        })
    }
    #updateUI() {
    }

    setTheme(name) {
        //console.log("set theme: ", name)
        if (name === this.#currentTheme) return
        document.documentElement.setAttribute(this.#attributeName, name)
        localStorage.setItem(this.#localStorageName, name)
        this.#currentTheme = name
    }
    setRandomTheme() {
        this.setTheme(this.#themes[Math.floor(Math.random()*this.#themes.length)].name)
    }

    #getAttr(theme, name, def="white") {
        if (!theme.attrs) return undefined
        const attr = theme.attrs.filter(i => i.name === name)
        if (!attr || !attr[0] || !attr[0].value) return def
        return attr[0].value
    }

    #searchThemes() {
        this.#themes = []
        for (let sheet of document.styleSheets) {
            //console.log("sheet:", sheet)
            this.#searchSheet(sheet)
        }
        this.#defaultTheme = this.#themes.filter(theme => theme.name === this.#defaultThemeName)[0] || {}
    }
    #searchSheet(sheet) {
        let rules = null
        try { rules = sheet.cssRules || sheet.rules }
        catch (e) {}
        if (rules) this.#searchRules(rules)
    }
    #searchRules(rules) {
        //console.log("rules:", rules)
        for (let rule of rules) {
            this.#searchRule(rule)
        }
    }
    #searchRule(rule) {
        //console.log("rule:", rule)
        if (rule.styleSheet) {
            this.#searchSheet(rule.styleSheet)
        }
        if (rule.selectorText) {
            if (rule.selectorText === ':root') {
                this.#themes.push({
                    name: rule.selectorText,
                    attrs: this.#extractAttrs(rule.style)
                })
            } else if (rule.selectorText.startsWith("["+this.#attributeName+"=")) {
                this.#themes.push({
                    name: rule.selectorText.match(/="(.*)"/i)[1],
                    attrs: this.#extractAttrs(rule.style)
                })
            }
        }
    }
    #extractAttrs(style) {
        let attrs = []
        //console.log(style)
        //console.log("style.length:", rule.style.length)
        //console.log("prim:", rule.style.getPropertyValue('--primary-color'))
        for (let i = 0; i < style.length; i++) {
            let name = style[i]
            attrs.push({
                name: name,
                value: style.getPropertyValue(name)
            })
        }
        return attrs
    }

}