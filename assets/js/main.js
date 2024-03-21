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


original(jQuery)




/*https://gist.github.com/JCPedroza/04d13c652c1c83e32097d9b5a1b58f30*/

function spa() {
    console.log('activar!')

    function getElement(htmlString, tag){
        var bodyRegex = new RegExp(`<${tag}[\\s\\S]*?>([\\s\\S]*?)<\\/${tag}>`,"i");
        console.log(bodyRegex)
        var bodyMatch = bodyRegex.exec(htmlString);
        return bodyMatch? bodyMatch[1] : false
    }

    function highlightActive( link ) {
        if( window.location.href.includes(link.href) ){
            link.classList.add('active')
        } else {
            link.classList.remove('active')
        }
    }

    updateLinks()

    // next we need to subscribe to "popstate" which let's us know when the user has clicked the 
    // "back" or "forward" button on their browser
    window.addEventListener('popstate', handleNavigation)


    // first we need to intercept all clicks on our "spa-links" so they don't trigger a page reload.
    // we can then use `history.pushState` so those link clicks still change the url appropriately.
    function updateLinks() {
        let links = document.querySelectorAll('a:not(.no-spa):not([href="#"])')
        for (var i = 0; i < links.length; i++) {
            highlightActive(links[i])
            links[i].onclick = function(e){
                e.preventDefault()
                history.pushState(null, document.title, e.target.getAttribute('href'))
                handleNavigation()
            }
        }
    }
    

    // now our handleNavigation callback is reliably fired whenever we need to react to a
    // a SPA navigation action. We can define it however we want.
    function handleNavigation(argument) {
        let path = window.location.pathname
        path = path.replace('http://127.0.0.1:4000/','https://arrietaeguren.es/calzadosarrieta')
        console.log('enviar!', path)
        var xhr= new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onreadystatechange = function() {
            if (this.readyState!==4) return;
            if (this.status!==200) return; // or whatever error handling you want
            document.getElementsByTagName('body')[0].innerHTML = getElement(this.responseText, 'body');
            document.title = getElement(this.responseText, 'title') || document.title
            updateLinks()
            original(jQuery)
        };
        xhr.send();
    }

}

spa()

