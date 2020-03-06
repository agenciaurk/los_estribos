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

class Gallery {
    constructor (gallery, galleryItems, featured, leftBtn, rightBtn, images){
        console.info("Gallery Class based on https://codepen.io/phileflanagan/pen/QgPdwz - by Phil Flanagan")
        this.gallery = gallery
        this.galleryItems = galleryItems
        this.featured = featured
        this.leftBtn = leftBtn
        this.rightBtn = rightBtn

        this.numOfItems = this.gallery.length
        this.itemWidth = 23 // <-

        this.scrollRate = 0.2 // <-
        this.left = 0

        this.leftInterval = null
        this.rightInterval = null

        this.leftBtn.addEventListener('mouseenter', () => this.moveLeft());
        this.leftBtn.addEventListener('mouseleave', () => this.stopMovement());
        this.rightBtn.addEventListener('mouseenter', () => this.moveRight());
        this.rightBtn.addEventListener('mouseleave', () => this.stopMovement());

        this.featured.style.backgroundImage = 'url(' + images[0] + ')';
        for (var i = 0; i < this.galleryItems.length; i++) {
            this.galleryItems[i].style.backgroundImage = 'url(' + images[i] + ')';
            this.galleryItems[i].addEventListener('click', () => this.selectItem());
        }
    }

    selectItem(e) {
        if (e.target.classList.contains('active')) return;

        featured.style.backgroundImage = e.target.style.backgroundImage;

        for (var i = 0; i < this.galleryItems.length; i++) {
            if (this.galleryItems[i].classList.contains('active'))
                this.galleryItems[i].classList.remove('active');
        }

        e.target.classList.add('active');
    }

    galleryWrapLeft() {
        var first = this.gallery.children[0];
        this.gallery.removeChild(first);
        this.gallery.style.left = -this.itemWidth + '%';
        this.gallery.appendChild(first);
        this.gallery.style.left = '0%';
    }

    galleryWrapRight() {
        var last = this.gallery.children[this.gallery.children.length - 1];
        this.gallery.removeChild(last);
        this.gallery.insertBefore(last, this.gallery.children[0]);
        this.gallery.style.left = '-23%';
    }

    moveLeft() {
        this.left = this.left || 0;

        this.leftInterval = setInterval(() => {
            this.gallery.style.left = this.left + '%';

            if (this.left > -this.itemWidth) {
                this.left -= this.scrollRate;
            } else {
                this.left = 0;
                this.galleryWrapLeft();
            }
        }, 1);
    }

    moveRight() {
        if (this.left > -this.itemWidth && this.left < 0) {
            this.left = this.left  - this.itemWidth;

            var last = this.gallery.children[this.gallery.children.length - 1];
            this.gallery.removeChild(last);
            this.gallery.style.left = this.left + '%';
            this.gallery.insertBefore(last, this.gallery.children[0]);
        }

        this.left = this.left || 0;

        this.leftInterval = setInterval(() => {
            this.gallery.style.left = this.left + '%';

            if (this.left < 0) {
                this.left += this.scrollRate;
            } else {
                this.left = -this.itemWidth;
                this.galleryWrapRight();
            }
        }, 1);
    }

    stopMovement() {
        clearInterval(this.leftInterval);
        clearInterval(this.rightInterval);
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

    const $gallery = document.querySelector(".gallery")
    const $galleryItems = document.querySelectorAll(".gallery-item")
    const $featured = document.querySelector(".featured-item")
    const $leftBtn = document.querySelector('.move-btn.left')
    const $rightBtn = document.querySelector('.move-btn.right')

    // if($gallery && $galleryItems && $featured && $leftBtn && $rightBtn && images)
        //var gallery = new Gallery($gallery, $galleryItems, $featured, $leftBtn, $rightBtn, images)

    const $fincas_car = document.getElementById("fincas-car")

    if($fincas_car){
        let fincas_carousel = M.Carousel.init($fincas_car, {
            fullWidth: true,
            indicators: true
        });

        let fincas_carousel_interval = setInterval(() => fincas_carousel.next(), 3000)

        $fincas_car.addEventListener("mouseover", () => clearInterval(fincas_carousel_interval))
        $fincas_car.addEventListener("mouseleave", () => fincas_carousel_interval = setInterval(() => fincas_carousel.next(), 3000))
        // window.addEventListener("resize", () => $fincas_car.style.height = "calc(100vh - 160px)")
    }

    const $ventajas_car = document.getElementById("ventajas-car")
    if($ventajas_car){
        let ventajas_carousel = M.Carousel.init($ventajas_car, {
            fullWidth: true,
            indicators: false
        });

        let ventajas_carousel_interval = setInterval(() => ventajas_carousel.next(), 3000)

        $ventajas_car.addEventListener("mouseover", () => clearInterval(ventajas_carousel_interval))
        $ventajas_car.addEventListener("mouseleave", () => ventajas_carousel_interval = setInterval(() => ventajas_carousel.next(), 3000))
    }

})