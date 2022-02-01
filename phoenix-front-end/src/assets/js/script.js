/* =======================================
                Preloader
    ======================================= */
/* load event for the window with js anonymous function */
$(window).on('load', function() {
    /* hide image with iQuery method: fadeOut()*/
    $('#status').delay(2000).fadeOut();
    $('#preloader').delay(2000).fadeOut();
});

/* =======================================
                Team Section
    ======================================= */
$(function(){
    $("#team-members").owlCarousel({
        items: 1,
        /*autoplay the slides*/
        autoplay: true,
        /*autoplay after 700 miliseconds*/
        smartSpeed: 700,
        /* the slider starts again */
        loop: true, 
        /* pause the autoplayer when mouse on img */
        autoplayHoverPause: true,
        /*navigation
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
        */
        dots: true,
    });
  });

/* =======================================
                Progress bars
    ======================================= */
$(function () {
/* waypoint is for animation at scrolling */
    $("#progress-elements").waypoint(function () {

        $(".progress-bar").each(function () {

            $(this).animate({
                width: $(this).attr("aria-valuenow") + "%"
            }, 2500);

        });
/* prevent waypoints -> the handler from triggering again */
        this.destroy();
    }, {
        /* trigger an action when the bottom of elem hits
        the bottom of the viewpoint */
        offset: 'bottom-in-view'
    });

});

/* =======================================
                Responsive Tabs
    ======================================= */
$( function() {
    $('#services-tabs').responsiveTabs({
        startCollapsed: 'accordion',
        animation: 'slide'
    });
})

/* =======================================
            Portofolio Filter
    ======================================= */
$(window).on('load', function () {

    // Initialize Isotope --- the grid --- main container
    $("#isotope-container").isotope({});

    // filter items on button click
    $("#isotope-filters").on('click', 'button', function () {

        // get filter value
        var filterValue = $(this).attr('data-filter');

        // filter portfolio
        $("#isotope-container").isotope({
            filter: filterValue
        });

        // active button
        $("#isotope-filters").find('.active').removeClass('active');
        $(this).addClass('active');
    });
});

/* =======================================
            Magnifier -> zoom images
    ======================================= */
$( function() {
    /* the parent container for portofolio items */
    $('#portfolio-wrapper').magnificPopup({
        delegate: 'a', // child items selector, by clicking on it popup will open
        type: 'image',
        // other options
        gallery: {
            enabled: true
        }
    });
})

/* =========================================
               Testimonials
============================================ */
$(function () {
    $("#testimonial-slider").owlCarousel({
        items: 1,
        autoplay: false,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
        nav: true,
        dots: false,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
    });
});

/* =========================================
              Stats
============================================ */
$(function () {

    $(".counter").counterUp({
        delay: 10,
        time: 2000
    });

});

/* =========================================
              Clients
============================================ */
$(function () {
    $("#clients-list").owlCarousel({
        items: 6,
        autoplay: false,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
        nav: true,
        dots: false,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            // breakpoint from 0 up
            0: {
                items: 2
            },
            // breakpoint from 480 up
            480: {
                items: 3
            },
            // breakpoint from 768 up
            768: {
                items: 6
            }
        }
    });
});

/* =========================================
              Navigation
============================================ */
/*Show and hide white navigation*/
$( function() {

    //show/hide nav on page load
    showHideNav();

    $(window).scroll( function() {
        //show/hide nav on window's scroll
        showHideNav();
    });

    function showHideNav () {
        /* scrollTop() method -> gets the current verstical position of scrollbar */
        if ( $(window).scrollTop() > 50 ) {
            //Show white nav bar
            $("nav").addClass("white-nav-top");
            // Show back to top button
            $("#back-to-top").fadeIn();
        } else {
            //Hide white nav bar
            $("nav").removeClass("white-nav-top");
            // Hide back to top button
            $("#back-to-top").fadeOut();
        }
    }
});

//Smooth Scrolling
$( function() {
    //select all links which have the smooth-scroll class
    $("a.smooth-scroll").click(function (event) {

        event.preventDefault();

        // get section id like #about, #servcies, #work, #team and etc.
        var section_id = $(this).attr("href");

        //animate method is used to perform a custom animation
        $("html, body").animate({
            scrollTop: $(section_id).offset().top - 64
        }, 1250, "easeInOutExpo");

    });
});

/* =========================================
                Animation
============================================ */
// animate on scroll
$(function () {
    new WOW().init();
});

// home animation on page load
$(window).on('load', function () {

    $("#home-heading-1").addClass("animated fadeInDown");
    $("#home-heading-2").addClass("animated fadeInLeft");
    $("#home-text").addClass("animated zoomIn");
    $("#home-btn").addClass("animated zoomIn");
    $("#arrow-down i").addClass("animated fadeInDown infinite");

});