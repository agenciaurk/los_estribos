const closeSidenav = new Event("closeSidenav")

/** @typedef {{place:string, distance:string, description:string}} place */

/** @type {place[]} */
const places = [

]

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

class VentajasCarousel {
    constructor(_element, _prev_btn, _next_btn, _place, _distance, _description, places){
        this.element = _element
        this.transition_time = 200
        this.next_time = 3000
        this.prev_btn = _prev_btn
        this.next_btn = _next_btn
        this.place = _place
        this.distance = _distance
        this.description = _description
        this.places = places
        this.test = 0
        this.carousel = M.Carousel.init(this.element, {
            fullWidth: true,
            indicators: false,
            duration: this.transition_time,
            onCycleTo: () => {
                console.log("Me moví!", this.test)
                this.test++
            }
        });
        this.interval = setInterval(() => this.carousel.next(), this.next_time)

        this.element.addEventListener("mouseover", () => clearInterval(this.interval))
        this.element.addEventListener("mouseleave", () => this.interval = setInterval(() => this.carousel.next(), this.next_time))

        this.element.addEventListener("mousedown", () => clearInterval(this.interval))
        this.element.addEventListener("mouseup", () => this.interval = setInterval(() => this.carousel.next(), this.next_time))

        this.prev_btn.addEventListener("mouseover", () => clearInterval(this.interval))
        this.prev_btn.addEventListener("mouseleave", () => this.interval = setInterval(() => this.carousel.next(), this.next_time))

        this.next_btn.addEventListener("mouseover", () => clearInterval(this.interval))
        this.next_btn.addEventListener("mouseleave", () => this.interval = setInterval(() => this.carousel.next(), this.next_time))

        this.prev_btn.addEventListener("click", () => {
            clearInterval(this.interval)
            this.carousel.prev()
            this.interval = setInterval(() => this.carousel.next(), this.next_time)
        })
        this.next_btn.addEventListener("click", () => {
            clearInterval(this.interval)
            this.carousel.next()
            this.interval = setInterval(() => this.carousel.next(), this.next_time)
        })
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

        let fincas_carousel_interval = setInterval(() => fincas_carousel.next(), 3000)

        $fincas_car.addEventListener("mouseover", () => clearInterval(fincas_carousel_interval))
        $fincas_car.addEventListener("mouseleave", () => fincas_carousel_interval = setInterval(() => fincas_carousel.next(), 3000))
        $fincas_car.addEventListener("mousedown", () => clearInterval(fincas_carousel_interval))
        $fincas_car.addEventListener("mouseup", () => fincas_carousel_interval = setInterval(() => fincas_carousel.next(), 3000))
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

})