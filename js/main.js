document.addEventListener('DOMContentLoaded', () => {
    const sidenavs = document.querySelectorAll('.sidenav')
    M.Sidenav.init(sidenavs)

    const nav = document.querySelector("nav")
    const sections = document.querySelector(".sections")
    let mainHeight = document.getElementById("main").clientHeight
    window.addEventListener("resize", () => mainHeight = document.getElementById("main").clientHeight)

    if(nav && sections){
        window.addEventListener("scroll", function(){
            if(this.scrollY > mainHeight) {
                nav.classList.add("fixed")
                sections.style.paddingTop = "80px"
            } else {
                nav.classList.remove("fixed")
                sections.style.paddingTop = "0"
            }
        })
    }

    const godown = document.getElementById("godown")
    if(godown) godown.addEventListener("click", () => window.scrollTo(0, mainHeight))
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
