function original ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
}




/*https://gist.github.com/JCPedroza/04d13c652c1c83e32097d9b5a1b58f30*/


(function () {
    console.log('Activate Single Page Application!')
    let currentPath = location.pathname

    // Extract tag from html string
    function getElement(htmlString, tag){
        var bodyRegex = new RegExp(`<${tag}[\\s\\S]*?>([\\s\\S]*?)<\\/${tag}>`,"i");
        var bodyMatch = bodyRegex.exec(htmlString);
        return bodyMatch? bodyMatch[1] : false
    }

    // Subscribe to "popstate" aka clicks to "back" or "forward" button on their browser
    window.addEventListener('popstate', handleNavigation)

    // Intercept all clicks on links so they don't trigger a page reload.
    // we can then use `history.pushState` so those link clicks still change the url appropriately.
    document.addEventListener('click', (e) => {
        let href = e.target.href
        if (!href) return
        let url = new URL(href)

        // If same origin, but different path, use SPA navigation    
        if (url.origin === location.origin && url.pathname !== location.pathname ) {
            e.preventDefault()
            history.pushState(null, document.title, href)
            handleNavigation()
        }
    })

    // handleNavigation callback is fired whenever we need to react to a SPA navigation action.
    function handleNavigation(e) {
        // If we have not changed the path, skip processing
        if( currentPath == location.pathname ) return
        // Now route accordingly
        console.log('Routing SPA to:', location.pathname)
        var xhr= new XMLHttpRequest();
        xhr.open('GET', location.pathname, true);
        xhr.onreadystatechange = function() {
            if (this.readyState!==4 || this.status!==200){
                return; // TODO: smarter error handling
            }
            // Update path
            document.body.innerHTML = getElement(this.responseText, 'body');
            document.title = getElement(this.responseText, 'title') || document.title
            currentPath = location.pathname
            window.dispatchEvent(new Event("load"));

            // Handle hash
            if (location.hash && document.getElementById( location.hash )) {
                document.getElementById( location.hash ).scrollIntoView();
            } else {
                window.scrollTo({ top: 0 });    
            }   
        };
        xhr.send();
    }
    
})();


window.onload = function (){
    updateActiveLink()
    original(jQuery)
}



// Contact form
function sendForm(selector){
    let fields = document.querySelectorAll( selector + ' :is(input, select, textarea)')
    let message = {}
    for (var i = 0; i < fields.length; i++) {
        let key = fields[i].name || fields[i].id
        if (fields[i].required && !fields[i].value) {
            fields[i].parentNode.classList.add('required')
            fields[i].parentNode.dataset.required = 'Por favor, introduce tu ' + key
            return
        } else {
            fields[i].parentNode.classList.remove('required')
        }
        message[key] = fields[i].value
    }
    // Clear
    for (var i = 0; i < fields.length; i++) { fields[i].value = '' }
    let form = document.querySelector(selector)
    form.classList.add('success')
    form.dataset.success = 'Gracias por tu mensaje!'
    console.log(message)
}


// Update active link
function updateActiveLink() {
    let links = document.querySelectorAll('a')
    for (var i = 0; i < links.length; i++) {
        if( window.location.href.includes(links[i].href) ){
            links[i].classList.add('active')
        } else {
            links[i].classList.remove('active')
        }
    }
}



/* PRODUCT FILTER */
function cleanString(str){
    if (!str) return ''
    let accents = { 'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n','s':''};
    return str.toLowerCase().replace(/[áéíóúñs\b]/g,v=>accents[v])
}

function sortProducts(query){
    let products = document.getElementsByClassName('single-product')
    query = cleanString(query).split('|')
    for (var i = 0; i < products.length; i++) {
        let filter = cleanString(products[i].dataset.filter)
        let matches = query.filter((word) => filter.includes(word)).length;
        products[i].parentNode.style.order = - matches
        products[i].parentNode.style.display = matches < query.length? 'none' : 'block'
    }
}




/* IMAGE MODAL */
function previewImage(img) {
    // Get the modal
    var modal = document.getElementById("myModal")
    
    // Show the modal
    document.getElementById("img01").src = img.src;
    modal.style.display = 'block';
    document.getElementById("caption").innerText = img.alt
    
    // Close the modal
    modal.onclick = function() {
      modal.style.display = "none";
    }
    document.body.addEventListener('keydown', function(e) {
      if (e.key == "Escape") modal.style.display = "none";
    });
}

/* SHARE */

function showShare(elem) {
    // body...
}