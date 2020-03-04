const closeSidenav = new Event("closeSidenav")

class Overlay {
    constructor(options){
        if(!options) options = {}

        let $currentOverlay = document.getElementById("OVERLAY")
        if($currentOverlay) {
            $currentOverlay.remove()
            if(!options.overwrite) console.error("Overlay:", "Element 'OVERLAY' already exists. It will be overwritten.\nPlease assign an ID through options.id")
        }
        
        this.overlay = document.createElement("div")

        this.overlay.setAttribute("id", options.id || "OVERLAY")

        this.overlay.style.position = "fixed"
        this.overlay.style.top = "0"
        this.overlay.style.bottom = "0"
        this.overlay.style.left = "0"
        this.overlay.style.right = "0"
        this.overlay.style.opacity = "0"
        this.overlay.style.height = "120vh"
        this.overlay.style.zIndex = options.zIndex || "1000"
        this.overlay.style.display = "none"
        this.overlay.style.backgroundColor = options.backgroundColor || "rgba(0,0,0,0.5)"
        
        this.overlay.onclick = e => {
            e.preventDefault()
            this.hide()
            if(options.dispatch) options.dispatch.forEach(event => dispatchEvent(event))
        }

        document.body.appendChild(this.overlay)
    }

    show(){
        this.overlay.style.opacity = "1"
        this.overlay.style.display = "inline"
    }

    hide(){
        this.overlay.style.opacity = "0"
        this.overlay.style.display = "none"
    }

    removeOnClick() {
        this.overlay.onclick = null
    }
    addOnClick() {
        this.overlay.onclick = e => {
            e.preventDefault(); 
            this.hide()
        }
    }
}

class SideNav {
    constructor(element, trigger, options){
        this.options = options || {}

        if(!trigger) throw Error("You must provide a trigger.")

        if(!element) this.menu = document.createElement("ul")
        else {
            this.menu = element
            element.remove
        }

        this.setStyle()
        this.addCloseButton()

        if(this.options.setOverlay){
            if(!this.options.overlay) this.options.overlay = {}
            this.options.overlay.overwrite = true
            this.overlay = new Overlay(this.options.overlay)
        }

        trigger.addEventListener("click", e => {
            e.preventDefault()
            this.open()
        })

        document.body.appendChild(this.menu)
    }

    open(){
        this.menu.style.transform = "translateX(0%)"
        if(this.overlay) this.overlay.show()
    }
    close(){
        this.menu.style.transform = "translateX(-105%)"
        if(this.overlay) this.overlay.hide()
    }

    setStyle(){
        let s = this.menu.style
        s.zIndex = "2000"
        s.position = "fixed"
        s.width = "300px"
        s.left = "0"
        s.top = "0"
        s.margin = "0"
        s.height = "calc(100% + 80px)"
        s.paddingBottom = "80px"
        s.backgroundColor = "#fafafa"
        s.overflowY = "auto"
        s.willChange = "transform"
        s.transform = "translateX(-105%)"
        s.transition = "transform 0.25s"
        s.boxShadow = "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)"
    }

    addCloseButton() {
        let li = document.createElement("li")
        
        let a = document.createElement("a")
        a.setAttribute("href", "#")
        a.addEventListener("click", e => {
            e.preventDefault()
            this.close() 
        })

        let i = document.createElement("i")
        i.classList.add("material-icons")
        i.innerText = "close"

        li.appendChild(a)
        a.appendChild(i)
        this.menu.prepend(li)
    }

    addItem(li){
        this.menu.appendChild(li)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const $sidenav = document.getElementById("sidenav")
    const $sidenav_trigger = document.getElementById("sidenav-trigger")
    var sidenav = new SideNav($sidenav, $sidenav_trigger, {
        setOverlay: true,
        overlay: {
            dispatch: [closeSidenav]
        }
    })
    addEventListener("closeSidenav", e => sidenav.close())

    const $header = document.querySelector("header")
    const $page = document.getElementById("page")
    // $header.style.height = `${window.innerHeight}px`

    const $nav = document.querySelector("nav")
    let headerHeight = $header.clientHeight
    window.addEventListener("resize", () => headerHeight =  document.querySelector("header").clientHeight)

    if($nav && $page){
        if(this.scrollY >= headerHeight) {
            $page.style.paddingTop = "80px"
            $nav.classList.add("fixed")
        } else {
            $page.style.paddingTop = "0"
            $nav.classList.remove("fixed")
        }

        window.addEventListener("scroll", function(){
            if(this.scrollY >= headerHeight) {
                $page.style.paddingTop = "80px"
                $nav.classList.add("fixed")
            } else {
                $page.style.paddingTop = "0"
                $nav.classList.remove("fixed")
            }
        })
    }
})