---
---

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


    // Testimonials carousel
    $(".similar-product-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 800,
        margin: 40,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:6
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

    // Simple (buggy?) event delegation
    function getLink(elem) {
        if (elem.href){
            return new URL(elem.href)
        } else if ( !elem.matches('a *')) {
            return false
        } else {
            for (var i = 0; i < 10; i++) {
                elem = elem.parentNode
                if( !elem ) return false
                if( elem.href ) return new URL(elem.href)
            }
        }
    }

    // Subscribe to "popstate" aka clicks to "back" or "forward" button on their browser
    window.addEventListener('popstate', handleNavigation)

    // Intercept all clicks on links so they don't trigger a page reload.
    // we can then use `history.pushState` so those link clicks still change the url appropriately.
    window.addEventListener('click', (e) => {
        // Get desired url (if any)
        let url = getLink(e.target)
        if (!url) return

        // Open external (crossorigin) links on new page
        if (url.origin !== location.origin) {
            e.preventDefault()
            return window.open(url.href, '_blank').focus();
       }

       // If same origin, but different path, use SPA navigation
       if (url.pathname !== location.pathname ) {
            e.preventDefault()
            history.pushState(null, document.title, url.href)
            handleNavigation()
        }
    })

    // handleNavigation callback is fired whenever we need to react to a SPA navigation action.
    function handleNavigation(e) {
        // If we have not changed the path, skip processing
        if( currentPath == location.pathname ) return
        // Now route accordingly
        console.log('Routing SPA to:', location.pathname)
        let xhr = new XMLHttpRequest();
        xhr.open('GET', location.pathname, true);
        xhr.onreadystatechange = function() {
            // If something failed, fallback to good old page load
            if (this.readyState !==4 ) return
            if (this.status !==200 ) return location.reload()

            // Update path
            document.body.innerHTML = getElement(this.responseText, 'body');
            document.title = getElement(this.responseText, 'title') || document.title
            currentPath = location.pathname

            // Dispatch 'onload' event
            window.dispatchEvent(new Event("load"));

            // Handle hash
            if (location.hash && document.querySelector( location.hash )) {
                document.querySelector( location.hash ).scrollIntoView();
                document.querySelector( location.hash ).focus()
            }
        };
        xhr.send();
    }
    
})();


function goTo( url ){
    url = new URL(url)
    if( location.pathname != url.pathname){
        history.pushState(null, document.title, url.href)
        return dispatchEvent(new PopStateEvent('popstate'));
    }
}


window.onload = function (){
    updateActiveLink()
    original(jQuery)

    if (location.pathname.includes('/productos/')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    markFavourites()

    hideEmptySections()

    /*let search = window.location.hash.split('search-')[1]
    if (search) { sortProducts( search.replace('-',''))}*/
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

    var xhr= new XMLHttpRequest();
    let url = `https://arrietaeguren.es/api/email?message=${JSON.stringify(message, null, 2)}&from=${message.email}&subject=${message.asunto}`
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (this.readyState!==4 || this.status!==200){
            form.classList.add('success')
            form.dataset.success = 'Error... ' + this.responseText
            return; // TODO: smarter error handling
        }
        // Clear
        for (var i = 0; i < fields.length; i++) { fields[i].value = '' }
        let form = document.querySelector(selector)
        form.classList.add('success')
        form.dataset.success = 'Gracias por tu mensajee!'
    };
    xhr.send();
    console.log(message)
}




// Update active link
function updateActiveLink() {
    let links = document.querySelectorAll('a[href]')
    for (var i = 0; i < links.length; i++) {
        let linkPath = links[i].href? new URL(links[i].href).pathname : null
        if( linkPath === location.pathname ){
            links[i].classList.add('active')
        } else {
            links[i].classList.remove('active')
        }
    }
}


function handleProductClick( product ) {
    let elem = event.target
    if (elem.matches('.toogleFavorite, .toogleFavorite *')) {
        toogleFavorite( product )
    } else if ( elem.matches('.showShare *')){
        showShare( product )
    } else if ( elem.matches('.preview *')){
        previewImage( product.getElementsByTagName('img')[0] )
    } else if ( elem.matches('.clipboard *')){
        navigator.clipboard.writeText(product.dataset.url)
        product.classList.remove('sharing')
    } else if ( elem.matches('.share *')) {
        let i = elem.tagName == 'I'? elem : elem.getElementsByTagName('I')[0]
        share( i.classList.value, product )
    }
}


/* PRODUCT FILTER */
function cleanString(str){
    if (!str) return ''
    // Remove funny accents
    let accents = { 'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n','s':'',',':''}
    str = str.toLowerCase().replaceAll(/[áéíóúñ,]|s\b/g,v=>accents[v])
    // Simple "semantic" search (chatGPT)
    let semantic = {
        'sin cuna': 'plana',
        'loneta':'lona',
        "señorita":"senora",
        "mujer":"senora",
        "hombre":"caballero",
        "primavera":"verano",
        "otroño":"invierno",
        "hogar":"casa",
        "nino":"infantil",
        "nina":"infantil",
        "cerrado":"cerrada",
        "abierto":"abierta",
        "plano":"plana",
        "violeta":"lila",
        "beig":"beige",
        "destalonado":"destalonada",
        "poroso":"porosa",
        "estampado":"estampada",
        "cuero":"piel",
        "blanco":"blanca",
        "rosado":"rosa",
        "rosada":"rosa",
        "rojo":"roja",
        "relajacion":"descanso",
        "biorrelax":"biorelax",
        "alto":"alta",
        "ligero":"ligera",
        "forrado":"forrada",
        "fuxia":"fucsia",
        "caqui":"kaki",
        "negro":"negra",
        "pluma flex":"plumaflex",
        "amarillo":"amarilla",
        "rizado":"rizo",
        "claro":"clara",
        "oscuro":"oscura",
        "liso":"lisa",
        "perrito":"perro",
        "beige":"beig",
        "clasico":"clasica",
        "invernal":"invierno",
        "decorado":"decorada",
        "destacado":"destacada",
        "sensible":"delicado",
        "montana":"monte",
        "impermeabilizadas":"impermeable",
        "deportivo":"deportiva",
        "no resbala":"antideslizante",
        "fucsia":"fuxia",
        "jayber":"j'hayber",
        "senderismo":"trekking",
        "grueso":"gruesa",
        "vaquero":"vaquera",
        "ortopedico":"ortopedia",
        "kungfu":"kunfu",
        "chancla":"chancleta",
        "metalizado":"metalizada",
        "centimetros":"cm",
        "crudo":"cruda",
        "plateada":"plata",
        "plateado":"plata",
        "cruzado":"cruzada",
        "dorado":"dorada",
        "bordado":"bordada"
    }
    var re = new RegExp(Object.keys(semantic).join("|"),"gi");
    return str.replace(re, m => semantic[m]);
}

function sortProducts(query, maxDiff = 0){
    if (!query) return
    let products = document.getElementsByClassName('single-product')
    query = cleanString(query).split(' ')
    for (var i = 0; i < products.length; i++) {
        let filter = cleanString( decodeURI(products[i].dataset.image) + products[i].classList.value)
        let matches = query.filter((word) => filter.includes(word)).length;
        products[i].parentNode.style.order = - matches
        products[i].parentNode.style.display = matches  + maxDiff < query.length? 'none' : 'block'
    }
    let box = document.getElementById('searchBox')
    if (box) box.scrollIntoView({ behavior: "smooth"});
}




/* IMAGE MODAL */
function previewImage(img) {
    // Get the modal
    var modal = document.getElementById("myModal")
    
    // Show the modal
    document.getElementById("img01").src = img.src;
    modal.style.display = 'block';
    document.getElementById("caption").innerText = (img.alt || '').split('|')[0]
    
    // Close the modal
    modal.onclick = function() {
      modal.style.display = "none";
    }
    document.body.addEventListener('keydown', function(e) {
      if (e.key == "Escape") modal.style.display = "none";
    });
}



/* FAVOURITES */
function toogleFavorite( product ) {
    let url = product.dataset.url
    let favourites = localStorage.getItem("favourites") || '{}'
    favourites = JSON.parse(favourites)
    favourites[url] = !favourites[url]
    localStorage.setItem('favourites',JSON.stringify(favourites))
    markFavourites()
}

function markFavourites(){
    let favourites = localStorage.getItem("favourites") || '{}'
    favourites = JSON.parse(favourites)
    let products = document.getElementsByClassName('single-product')
    for (var i = 0; i < products.length; i++) {
        if (products[i].dataset.url && favourites[products[i].dataset.url] ) {
            products[i].classList.add('favourite')
        } else {
            products[i].classList.remove('favourite')
        }
    }
}



/* SHARE */
function showShare( product ) {
    if(/iPhone|iPad|Android/i.test(navigator.userAgent)){
        navigator.share({
          title: product.dataset.title,
          text: product.dataset.description,
          url: product.dataset.url,
        });
     } else {
        product.classList.toggle('sharing')
    }
}

function share(destination, product) {
    let title = encodeURIComponent(product.dataset.title)
    let text = encodeURIComponent(product.dataset.description)
    let url = encodeURIComponent(product.dataset.url)
    let image = encodeURIComponent(product.dataset.image)

    let links = {
        whatsapp: `https://wa.me/?text=${text}`,
        telegram: `https://t.me/share/url?url=${url}&text=${text}`,
        tumblr: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}&caption=${text}`,
        envelope: `mailto:?subject=${title}&body=${url}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        //linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${url}&amp;media=${image}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=calzadosarrieta,zapatillas,alpargatas`,
        reddit: `https://reddit.com/submit?url=<URL>&title=<TITLE>`
    }

    for (let key in links) {
        if (destination.includes(key)) {
            //console.log(destination, key, links[key])
            window.open(links[key], '_blank').focus();        
        }
    }    
}


function hideEmptySections(){
    let sections = document.querySelectorAll('.hide-when-empty')
    for (var i = 0; i < sections.length; i++) {
        let products = sections[i].querySelectorAll('.single-product')
        if (!products || !products.length) sections[i].style.display = 'none'
    }
}





/* MODULES */
{% include module tag='script' %}