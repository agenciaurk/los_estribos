const closeSidenav = new Event("closeSidenav")

/** @typedef {{place:string, distance:string, description:string}} place */

/** @type {place[]} */
const places = [
    {
        place: "Cascadas Nant y Fall",
        distance: "4",
        description: "cnf"
    },
    {
        place: "El Molino",
        distance: "8",
        description: "em"
    },
    {
        place: "Los Tulipanes",
        distance: "4",
        description: "lt"
    },
    {
        place: "Frutillas orgánicas legua 13",
        distance: "3",
        description: "fol"
    },
    {
        place: "Los viñedos Nant y Fall",
        distance: "4",
        description: "lvnyf"
    },
    {
        place: "Paso Futaleufu Chile",
        distance: "20",
        description: "pfc"
    },
    {
        place: "Los cipreces",
        distance: "15",
        description: "lc"
    },
    {
        place: "Lago el baguilt",
        distance: "30",
        description: "leb"
    },
    {
        place: "Río grande",
        distance: "15",
        description: "rg"
    },
    {
        place: "Piscicultura",
        distance: "15",
        description: "psc"
    },
    {
        place: "Parque Nacional Los Alerces",
        distance: "0",
        description: "pnla"
    },
    {
        place: "Represa",
        distance: "0",
        description: "r"
    },
    {
        place: "Trevelin colonia galesa",
        distance: "0",
        description: "tcg"
    },
    {
        place: "Aeropuerto en Esquel",
        distance: "0",
        description: "aee"
    },
    {
        place: "Esquel",
        distance: "0",
        description: "esq"
    },
    {
        place: "La Hoya",
        distance: "0",
        description: "lh"
    }
]

function getScrollbarWidth(){
    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll'
    outer.style.msOverflowStyle = 'scrollbar'
    document.body.appendChild(outer)
    const inner = document.createElement('div')
    outer.appendChild(inner)
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth)
    outer.parentNode.removeChild(outer) 
    return scrollbarWidth
}

const scrollbarWidth = getScrollbarWidth()

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

class Popup {
    constructor(element, options){
        this.options = options || {}

        this.element = element || document.createElement("div")
        this.big = options.big || false
        this.animTime = options.animTime || 300
        this.displayed = false
        this.setStyle()
        this.setAnim()
        this.addCloseButton()

        if(this.options.setOverlay){
            if(!this.options.overlay) this.options.overlay = {}
            this.options.overlay.overwrite = true
            this.overlay = new Overlay(this.options.overlay)
        }

        this.caosclick = 0
        this.caosTimedout = null
        // this.closebuttonref = null
    }

    addClass(clazz){
        this.element.classList.add(clazz)
        this.setAnim()
    }

    setId(id){
        this.element.setAttribute("id", id)
    }

    /**
     * @param {{top:string, left:string, bottom:string, right:string}} position 
     */
    show(display, position){
        if(!this.displayed){
            this.displayed = true
            if(this.overlay) {
                this.overlay.show()
                this.overlay.removeOnClick()
            }

            this.addCloseShortcut()

            if(position){
                if(position.top) this.element.style.top = position.top
                if(position.bottom) this.element.style.bottom = position.bottom
                if(position.left) this.element.style.left = position.left
                if(position.right) this.element.style.right = position.right
            }

            this.element.style.display = display ? display : "inline"
            this.element.scrollTo(0, 0)

            if(document.body.clientHeight > window.innerHeight) document.body.style.borderRight = `${scrollbarWidth}px solid transparent`
            document.body.style.overflow = "hidden"

            this.element.addEventListener("mouseleave", e => {
                e.preventDefault()
                document.onclick = () => {
                    clearTimeout(this.caosTimedout)
                    this.caosclick++
                    if(this.caosclick >= 4) {
                        this.element.scrollTo(0, 0)
                        this.closebuttonref.classList.add("blr")
                    }
                    this.caosTimedout = setTimeout(() => this.caosclick = 0 , 1000)
                }
            })
            this.element.addEventListener("mouseover", e => {
                e.preventDefault()
                document.onclick = null
                this.caosclick = 0
            })

            return new Promise(res => setTimeout(() => {
                this.element.style.transform = "scale(1)"
                res()
            }, 50))
        }
    }

    hide(){
        if(this.displayed){
            this.displayed = false
            if(this.overlay) {
                this.overlay.hide() 
                this.overlay.addOnClick()
            }
            this.removeCloseShortcut()
            this.element.style.transform = "scale(0.5, 0)"
            document.body.style.borderRight = "none"
            document.body.style.overflow = "auto"
            this.closebuttonref.classList.remove("blr")
            return new Promise(res => setTimeout(() => {
                this.element.style.display = "none"
                res()
            }, this.animTime))
        }
    }

    setAnim() {
        this.element.style.display = "none"
        this.element.style.transform = "scale(0.5, 0)"
        this.element.style.transformOrigin = "top"
        this.element.style.transition = `transform ${this.animTime.toString()}ms`
    }

    addCloseButton() {
        let li = document.createElement("li")
        li.style.listStyle = "none"
        li.style.margin = "12px"
        li.style.textAlign = "unset"
        
        let a = document.createElement("a")
        a.setAttribute("href", "#")
        li.appendChild(a)

        let i = document.createElement("i")
        this.closebuttonref = i
        i.classList.add("material-icons")
        i.style.color = "rgb(20,20,20)"
        i.innerText = "close"
        a.appendChild(i)

        a.addEventListener("click", e => { 
            e.preventDefault();
            this.hide() 
        })
        this.element.prepend(li)
    }

    setStyle() {
        let s = this.element.style
        s.height = "80%"
        s.minHeight = "500px"
        if(this.big){
            s.width = "68%"
            s.left = "16%"
        } else {
            s.width = "50%"
            s.left = "calc(50% - 25%)"
        }
        s.top = "calc(50% - 40%)"
        s.borderRadius = "4px"
        s.borderTop = "3px solid #424953"
        s.boxShadow = "0 0 3px 0 rgba(0,0,0,0.5)"
        s.position = "absolute"
        s.backgroundColor = "#fafafa"
        s.zIndex = "1001"
        s.overflowY = "auto"
        s.borderBottom = "4px solid transparent"
        s.scrollBehavior = "smooth"
        this.element.classList.add("windowResponsive")
    }
    addCloseShortcut() {
        document.onkeyup = ({key, keyCode}) => (keyCode === 27 || key === "Escape") ? this.hide() : false
    }
    removeCloseShortcut() {
        document.onkeyup = null
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



//ARREGLAR CARRUSEL
class VentajasCarousel {
    /**
     * @param {place[]} places 
     */
    constructor(_element, _prev_btn, _next_btn, _place, _distance, _description, places){
        this.element = _element
        this.transition_time = 200
        this.next_time = 4000
        this.prev_btn = _prev_btn
        this.next_btn = _next_btn
        this.place = _place
        this.distance = _distance
        this.description = _description
        this.places = places
        let placesIndex = 0
        this.carousel = M.Carousel.init(this.element, {
            fullWidth: true,
            indicators: false,
            duration: this.transition_time,
            onCycleTo: () => {
                if(placesIndex >= places.length - 1) placesIndex = 0
                else placesIndex++

                this.place.innerText = places[placesIndex].place
                this.distance.innerText = places[placesIndex].distance
                this.description.innerText = places[placesIndex].description
                
            }
        });
        this.interval = setInterval(() => this.carousel.next(), this.next_time)

        this.element.addEventListener("mouseover", () => clearInterval(this.interval))
        this.element.addEventListener("mouseleave", () => this.interval = setInterval(() => this.carousel.next(), this.next_time))

        this.prev_btn.addEventListener("mouseover", () => clearInterval(this.interval))
        this.prev_btn.addEventListener("mouseleave", () => this.interval = setInterval(() => this.carousel.next(), this.next_time))

        this.next_btn.addEventListener("mouseover", () => clearInterval(this.interval))
        this.next_btn.addEventListener("mouseleave", () => this.interval = setInterval(() => this.carousel.next(), this.next_time))

        this.prev_btn.addEventListener("click", () => this.carousel.prev())
        this.next_btn.addEventListener("click", () => this.carousel.next())
    
        this.place.innerText = places[placesIndex].place
        this.distance.innerText = places[placesIndex].distance
        this.description.innerText = places[placesIndex].description
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

    const $selects = document.querySelectorAll('select')
    M.FormSelect.init($selects);

    const $header = document.querySelector("header")
    const $page = document.getElementById("page")

    const $nav = document.querySelector("nav")
    let headerHeight = $header.clientHeight
    window.addEventListener("resize", () => {
        document.querySelector("header").style.height = window.innerHeight
        headerHeight =  document.querySelector("header").clientHeight
    })

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

    const $360 = document.getElementById("360")
    const $jump360 = document.getElementById("jump360")
    if($360 && $jump360){
        let a360Top = $360.getBoundingClientRect().top

        if(a360Top <= 0){
            $jump360.style.position = "fixed"
            $jump360.style.top = "105px"
        } else {
            $jump360.style.position = "absolute"
            $jump360.style.top = "105px"
        }
        if(a360Top <= -($360.clientHeight-(105+40))) $jump360.style.display = "none"
        else $jump360.style.display = "block"

        window.addEventListener("scroll", () => {
            let a360Top = $360.getBoundingClientRect().top
            if(a360Top <= 0){
                $jump360.style.position = "fixed"
                $jump360.style.top = "105px"
            } else {
                $jump360.style.position = "absolute"
                $jump360.style.top = "105px"
            }
            if(a360Top <= -($360.clientHeight-(240))) $jump360.style.display = "none"
            else $jump360.style.display = "block"
        })

        
        $jump360.addEventListener("click", () => window.scrollTo(0, (window.scrollY + $360.getBoundingClientRect().top) - $360.clientHeight))
    }

    const $fincas_car = document.getElementById("fincas-car")

    if($fincas_car){
        let fincas_carousel = M.Carousel.init($fincas_car, {
            fullWidth: true,
            indicators: true
        });

        let fincas_carousel_interval = setInterval(() => fincas_carousel.next(), 4000)

        $fincas_car.addEventListener("mouseover", () => clearInterval(fincas_carousel_interval))
        $fincas_car.addEventListener("mouseleave", () => fincas_carousel_interval = setInterval(() => fincas_carousel.next(), 4000))
    }


    const $ventajas_car = document.getElementById("ventajas-car")
    const $prevBtn = document.getElementById('prev_btn')
    const $nextBtn = document.getElementById('next_btn')
    const $place = document.getElementById("place")
    const $distance = document.getElementById("distance")
    const $description = document.getElementById("description")

    if($ventajas_car && $prevBtn && $nextBtn && $place && $distance && $description){
        const ventajas_car = new VentajasCarousel($ventajas_car, $prevBtn, $nextBtn, $place, $distance, $description, places)
        
    }

    let $popup = document.getElementById("popup")
    let popup = new Popup($popup, {setOverlay: true, big: true})

    setTimeout(() => {
        let maphashes = document.querySelectorAll("a")
        maphashes.forEach(a => {
            a.addEventListener("click", e => {
                a.hash.replace("#", "")
                if(a.hash !== "" && a.hash.startsWith("_")) {
                    e.preventDefault()
                    console.log(a.hash)
                    let ctop = window.pageYOffset
                    popup.show(null, {top: `calc(${ctop}px + 90px)`})
                }
            })
            
        })
    }, 3000)

})