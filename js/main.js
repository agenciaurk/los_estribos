document.addEventListener('DOMContentLoaded', () => {
    const skivid = document.getElementById("skivid");
    const header = document.getElementById("header");
    let header_height = skivid.clientHeight
    header.style.height = `${header_height}px`
    if(window.innerWidth < 992) header.style.height = `${250}px`

    window.addEventListener("resize", () => {
        let header_height_r = skivid.clientHeight    
        header.style.height = `${header_height_r}px`

        if(window.innerWidth < 992) header.style.height = `${250}px`
    })

    const img_container = document.getElementsByClassName("i-img")
    const a_elements = document.getElementById("instagram").children

    fetch("https://www.instagram.com/demianlasry?__a=1").then(response => response.json())
        .then(res => {
            let posts = res.graphql.user.edge_owner_to_timeline_media.edges
            for(i = 0; i < 9; i++){
                let this_url = posts[i].node.display_url
                let shortcode = posts[i].node.shortcode
                img_container[i].style.backgroundImage = `url(${this_url})`
                img_container[i].style.opacity = "1"
                a_elements[i].setAttribute("href", `https://www.instagram.com/p/${shortcode}`)
            }
        })

    const parallaxed = document.querySelectorAll('.parallax');
    M.Parallax.init(parallaxed);

    const $name = document.getElementById("name")
    const $email = document.getElementById("email")
    const $topic = document.getElementById("topic")
    const $content = document.getElementById("content")

    $name.value = ""
    $email.value = ""
    $topic.value = ""
    $content.value = ""
    
    $('.customer-logos').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 700,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 3
            }
            },
            {
            breakpoint: 520,
            settings: {
                slidesToShow: 2
            }
        }]
    });

    $("a").on("click", function(e){
        if(this.hash !== ""){
            e.preventDefault()
            let hash = this.hash
            $("html, body").animate({
                scrollTop: $(hash).offset().top
            }, 800, () => window.location.hash = hash)
        }
    })
});