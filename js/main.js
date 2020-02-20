const carruselContent = [
    {
        place: "Lorem ipsum",
        distance: "0",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, natus. Voluptates dolorum odit laudantium molestias reprehenderit doloribus architecto magnam voluptas, tenetur nesciunt maxime, ut laboriosam natus soluta dicta repellendus cum?",
        img: "https://cdn.idropnews.com/wp-content/uploads/2017/09/13112449/Blorange-iPhone-Wallpaper-1080x1920.jpg"
    },
    {
        place: "Lorem ipsum",
        distance: "0",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, natus. Voluptates dolorum odit laudantium molestias reprehenderit doloribus architecto magnam voluptas, tenetur nesciunt maxime, ut laboriosam natus soluta dicta repellendus cum?",
        img: "https://image.freepik.com/free-photo/whole-lemon-blue-background_23-2147931322.jpg"
    }
]

class Carrusel {
    constructor(toleft, toright, place, distance, description, placeimg){
        this.place = place
        this.distance = distance
        this.description = description
        this.placeimg = placeimg
        this.toleft = toleft
        this.toright = toright
        this.index = 0
        this.maxIndex = carruselContent.length - 1
        this.interval = setInterval(() => {
            if(this.index >= this.maxIndex) this.index = 0
            else if(this.index <= 0) this.index = this.maxIndex
            else this.index++
            this.swap(this.index)
        }, 3000)

        this.toleft.addEventListener("click", () => {
            clearInterval(this.interval)

            if(this.index >= this.maxIndex) this.index = 0
            else if(this.index <= 0) this.index = this.maxIndex
            else this.index--

            this.swap(this.index)
                this.interval = setInterval(() => {
                if(this.index >= this.maxIndex) this.index = 0
                else if(this.index <= 0) this.index = this.maxIndex
                else this.index++

                this.swap(this.index)
            }, 3000)

        })

        this.toright.addEventListener("click", () => {
            clearInterval(this.interval)

            if(this.index >= this.maxIndex) this.index = 0
            else if(this.index <= 0) this.index = this.maxIndex
            else this.index++

            this.swap(this.index)

            this.interval = setInterval(() => {
                if(this.index >= this.maxIndex) this.index = 0
                else if(this.index <= 0) this.index = this.maxIndex
                else this.index++

                this.swap(this.index)
            }, 3000)
        })

        this.placeimg.addEventListener("mouseover", () => clearInterval(this.interval))
        this.placeimg.addEventListener("mouseleave", () => this.interval = setInterval(() => {
            if(this.index >= this.maxIndex) this.index = 0
            else if(this.index <= 0) this.index = this.maxIndex
            else this.index++

            this.swap(this.index)
        }, 3000))

        this.swap(this.index)
    }

    swap(i) {
        this.place.innerText = carruselContent[i].place
        this.description.innerText = carruselContent[i].description
        this.distance.innerText = carruselContent[i].distance
        this.placeimg.style.backgroundImage = `url("${carruselContent[i].img}")`
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const $sidenavs = document.querySelectorAll('.sidenav')
    M.Sidenav.init($sidenavs)

    const $main = document.getElementById("main")
    $main.style.height = `${window.innerHeight}px`

    const $nav = document.querySelector("nav")
    const $sections = document.querySelector(".sections")
    let mainHeight = $main.clientHeight
    window.addEventListener("resize", () => mainHeight = document.getElementById("main").clientHeight)

    if($nav && $sections){
        if(this.scrollY >= mainHeight) {
            $sections.style.paddingTop = "80px"
            $nav.classList.add("fixed")
        } else {
            $sections.style.paddingTop = "0"
            $nav.classList.remove("fixed")
        }
        window.addEventListener("scroll", function(){
            if(this.scrollY >= mainHeight) {
                $sections.style.paddingTop = "80px"
                $nav.classList.add("fixed")
            } else {
                $sections.style.paddingTop = "0"
                $nav.classList.remove("fixed")
            }
        })
    }

    const $godown = document.getElementById("godown")
    if($godown) $godown.addEventListener("click", () => window.scrollTo(0, mainHeight))

    const $toleft = document.getElementById("toleft")
    const $toright = document.getElementById("toright")
    const $placeimg = document.getElementById("placeimg")
    const $place = document.getElementById("place")
    const $description = document.getElementById("description")
    const $distance = document.getElementById("distance")

    if($toleft && $toright && $placeimg && $place && $description && $distance) {
        let carrusel = new Carrusel($toleft, $toright, $place, $distance, $description, $placeimg)
    }
});


// var  mn = $("nav");
// mns = "fixed";
// hdr = $('#fixeador').height();
// $(window).scroll(function() {
//     if( $(this).scrollTop() > hdr ) {
//         mn.addClass(mns);
//     } else {
//         mn.removeClass(mns);
//     }
// });   
