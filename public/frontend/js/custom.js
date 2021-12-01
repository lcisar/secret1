$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

var files;

(function($){
    var retainCount = 0;

    $.extend({
        loadingSpinner: function() {
            var over = '<div id="custom-loading-overlay">' +
                '<i id="custom-loading" class="fa fa-spinner fa-spin fa-3x fa-fw" style="font-size:48px; color: var(--tyrkys);"></i>'+
                '</div>';
            if (0===retainCount) {
                $(over).appendTo('body');
            }
            retainCount++;
        },
        removeLoadingSpinner: function() {
            retainCount--;
            if (retainCount<=0) {
                $('#custom-loading-overlay').remove();
                retainCount = 0;
            }
        }
    });
}(jQuery)); 

$(window).on('scroll', function () {
    if ($(this).scrollTop() > 600) {
        $('.tap-top').fadeIn();
    } else {
        $('.tap-top').fadeOut();
    }
});
$('.tap-top').on('click', function () {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;
});


function contact_us() {

    var url = window.location.origin;

    $.ajax({
        url: url + '/contact-form',
        method: 'GET',
        dataType:'html',
        beforeSend: function(){
            $("#contact-form-holder").html("");
        },
        success: function(html) {
            $("#contact-form-holder").html(html);
            $("#contact-form").modal("show");
        }
    });

    
}

function ask(product) {

    var url = window.location.origin;

    $.ajax({
        url: url + '/ask-form',
        data: 'product_name=' + product,
        method: 'GET',
        dataType:'html',
        beforeSend: function(){
            $("#ask-form-holder").html("");
        },
        success: function(html) {
            $("#ask-form-holder").html(html);
            $("#ask-modal").modal("show");
            $('#ask-modal input[type=file]').on('change', prepareUpload);
        }
    });

    
}

function prepareUpload(event){
    files = event.target.files;
};

function ask_submit(product) {

    var response = grecaptcha.getResponse();
    
    if(response == ""){

        $('#recaptcha iframe').css('border', '1px solid red');

        setTimeout(function() {
            $('#recaptcha iframe').css('border', 'none');
        }, 400);
        return false;
    }

    var url = window.location.origin;

    var formData = new FormData();

    if($('input[name="attachement"]').length > 0){
        var file_data = $('input[name="attachement"]').prop('files')[0];   
        formData.append('file', file_data);
    }
   
    $.each($("#ask-modal .modal-bg input[type='text'], #ask-modal .modal-bg input[type='file'], #ask-modal .modal-bg textarea, #ask-modal .modal-bg input[type='hidden'], #ask-modal .modal-bg select, #ask-modal input[type=email], #ask-modal input[type=checkbox]:checked"), function(key, value){
        formData.append($(value).attr('name'), $(value).val());
    });

    $.ajax({
        url: url + '/ask-form',
        data: formData,
        method: 'POST',
        dataType:'json',
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function(){
            $('#ask-modal .form-control').removeClass('error');
            $('#ask-modal .error-text').remove();
            $('#ask-modal-button').attr("disabled", true);
        },
        success: function(json) {
            
            if(json.errors){

                var error = '';
                
                for (var key in json.errors) {    
                    if(key == 'gdpr'){
                        $('#ask-modal [name="'+ key +'"]').addClass('error');
                        $('#ask-modal [name="'+ key +'"]').siblings().after('<span class="error-text text-danger" style="display: block;">'+ json.errors[key] +'</span>');
                    }else{
                        $('#ask-modal [name="'+ key +'"]').addClass('error');
                        $('#ask-modal [name="'+ key +'"]').after('<span class="error-text text-danger">'+ json.errors[key] +'</span>');  
                    } 
                }

            }
            
            if(json.success){
                $('#ask-modal').modal('dispose'); $('#ask-modal').remove();$('body').removeClass('modal-open');$('.modal-backdrop').remove();
                alert(json.title, json.success, "success");

                if(typeof fbq === 'undefined') {
                    fbq('track', 'Lead');
                }
            }

            $('#ask-modal-button').attr("disabled", false);

        }
    });

    
}

function addToCart(product_id, quantity){

    var variant = $(document).find("select[name='variant']").val();

    if(variant != '' && variant != undefined){
        var variant_query = "&variant=" + variant;
    }else{

        var variant = $(document).find("input[name='variant']").val();

        if(variant != '' && variant != undefined){
            var variant_query = "&variant=" + variant;
        }else{
            var variant_query = "";
        }

    }

    $.ajax({
        url: '/cart/add',
        method: 'POST',
        data: 'product_id=' + product_id + '&quantity=' + quantity + variant_query,
        dataType:'json',
        beforeSend: function(){
            $.loadingSpinner();
        },
        success: function(json) {
            $.removeLoadingSpinner();

            $(".cart_qty_cls").html(json.total);
            $("#cart-list").html(json.html);

            if(typeof fbq === 'undefined') {
                fbq('track', 'AddToCart');
            }

            if(json.popup){
                $("body").append(json.popup);
                $("#cart-modal").modal('show');
            }

        }
    });
}

function updateCart(cart_id, quantity){

    
    $.ajax({
        url: '/cart/update',
        method: 'POST',
        data: 'cart_id=' + cart_id + '&quantity=' + quantity,
        dataType:'json',
        beforeSend: function(){
            $.loadingSpinner();
        },
        success: function(json) {
            load_items();
            load_totals();
            $.removeLoadingSpinner();
        }
    });
}

function removeCart(cart_id, reload = 0){
    $.ajax({
        url: '/cart/remove',
        method: 'POST',
        data: 'cart_id=' + cart_id,
        dataType:'json',
        beforeSend: function(){
            $.loadingSpinner();
        },
        success: function(json) {
            $.removeLoadingSpinner();

            $(".cart_qty_cls").html(json.total);
            $("#cart-list").html(json.html);

            load_items();
            load_totals();

            if(json.total == 0 || reload == 1){
                window.location.reload();
            }

        }
    });
}

function items(){
    $.ajax({
        url: '/cart/items',
        method: 'GET',
        dataType:'json',
        beforeSend: function(){
            $.loadingSpinner();
        },
        success: function(json) {
            $.removeLoadingSpinner();
            $(".cart_qty_cls").html(json.total);
            $("#cart-list").html(json.html);
        }
    });
}

function addToWishlist(product_id){
    $.ajax({
        url: '/wishlist/add',
        method: 'POST',
        data: 'product_id=' + product_id,
        dataType:'json',
        beforeSend: function(){
            $.loadingSpinner();
        },
        success: function(json) {
            $.removeLoadingSpinner();

            if(json.total > 0){
                $(".wishlist_qty_cls").html(json.total);
            }else{
                $(".wishlist_qty_cls").html("");
            }
        }
    });
}

function removeWishlist(product_id){
    $.ajax({
        url: '/wishlist/remove',
        method: 'POST',
        data: 'wishlist_id=' + product_id,
        dataType:'json',
        beforeSend: function(){
            $.loadingSpinner();
        },
        success: function(json) {
            $.removeLoadingSpinner();

            if(json.total == 0){
                location.reload();
            }

            $(".wishlist_qty_cls").html(json.total);
        }
    });
}

$('.toggle-nav').on('click', function() {
    $('.sm-horizontal').css("right", "0px");
});

$(".mobile-back").on('click', function() {
    $('.sm-horizontal').css("right", "-410px");
});

$(document).on("click", ".menu-toggle", function(){
    $(".menu-holder").toggleClass("active");
});

$(document).on("click", ".mobile-search img", function(){
    $("#search-overlay").show();
});

$(document).on("click", "#search-overlay .closebtn", function(){
    $("#search-overlay").hide();
});

$('.filter-btn').on('click', function(e) {
    $('.collection-filter').css("left", "-15px");
});

$('.filter-back').on('click', function(e) {
    $('.collection-filter').css("left", "-365px");
    $('.sidebar-popup').trigger('click');
});

$(document).on("click", ".c-btn", function(){
    $(".c-btn").removeClass("is-active").removeClass("is-active-mobile");
    $(".autocomplete__box").removeClass("is-active").removeClass("not-active-tab-mobile");
    $(this).addClass("is-active");


    var box = $(this).attr("id");


    if(box != "categories-nav"){
        $(".autocomplete__left").css("display", "none");
    }else{
        $(".autocomplete__left").css("display", "initial");
    }

    $("#" + box + "-box").addClass("is-active");
});


function openSearch() {
    document.getElementById("search-overlay").style.display = "block";
}

function closeSearch() {
    document.getElementById("search-overlay").style.display = "none";
}


var lookupDelay = 300, lookupTimer = null;

function lookup(t){

    if(t.value.length < 2){
        $("#smart-suggestions").hide();
        $.removeLoadingSpinner();
        return false;
    }

    window.clearTimeout(lookupTimer);

    lookupTimer = window.setTimeout(function() {
            
        $.ajax({
            url: '/search',
            method: 'POST',
            data: 'queryString=' + t.value,
            dataType:'html',
            beforeSend: function(){
                $.loadingSpinner();
            },
            success: function(html) {
                $.removeLoadingSpinner();
                $("#smart-suggestions").show();
                $("#smart-autoSuggestionsList").html(html)
            }
        });

    }, lookupDelay);
}

function addToWatchdog(product_id){
    $.ajax({
        url: '/watchdog/add',
        method: 'POST',
        data: 'product_id=' + product_id,
        dataType:'json',
        beforeSend: function(){
            $.loadingSpinner();
        },
        success: function(json) {
            $.removeLoadingSpinner();

            if(json.popup){
                $("body").append(json.popup);
                $("#watchdog-modal").modal('show');
            }
        }
    });
}

$(document).on('click', '.qty-box .quantity-right-plus', function() {
    var $qty = $(this).closest(".input-group").find("input");
    var currentVal = parseInt($qty.val(), 10);
    if (!isNaN(currentVal)) {
        $qty.val(currentVal + 1).trigger("change");
    }
});

$(document).on('click', '.qty-box .quantity-left-minus', function() {
    var $qty = $(this).closest(".input-group").find("input");
    var currentVal = parseInt($qty.val(), 10);
    if (!isNaN(currentVal) && currentVal > 1) {
        $qty.val(currentVal - 1).trigger("change");
    }
});


$(document).on('click', function (e) {

    if($('#smart-autoSuggestionsList').contents().length > 1){
        var t = $(e.target).closest('#smart-suggestions');
        var exceptDiv = $('#smart-suggestions');
        
        if (exceptDiv.is(t) == false) {
            $('#smart-autoSuggestionsList').empty();
            $('#smart-suggestions').hide();
            $('.mobile-search input[name="search_term"]').val('');
        }
    }

    var window_width = jQuery(window).width();

    if ((window_width) <= 991) {
        if($(".collection-filter").css("left") == '-15px'){
            var exceptDiv = $('.collection-filter');
            var t = $(e.target).closest('.collection-filter');

            if (exceptDiv.is(t) == false) {
                $(".collection-filter").css("left", '-350px');
            }
        } 
    }

    if ((window_width) <= 991) {
        if($("#main-menu").css("right") == '0px'){
            var exceptDiv = $('#main-menu');
            var t = $(e.target).closest('#main-menu');

            if (exceptDiv.is(t) == false) {
                $("#main-menu").css("right", '-410px');
            }
        } 
    }
    

});



$(document).on('click', '#contact-form-submit', function(e){
    e.preventDefault();

    var response = grecaptcha.getResponse();

    if(response == ""){

        $('#recaptcha iframe').css('border', '1px solid red');

        setTimeout(function() {
            $('#recaptcha iframe').css('border', 'none');
        }, 400);
        return false;
    }


    var url = window.location.origin;

    $.ajax({
        url: url + '/contact-form',
        method: 'POST',
        data: $('#contact-form input[type=text], #contact-form input[type=hidden], #contact-form input[type=email], #contact-form input[type=checkbox]:checked, #contact-form textarea'),
        dataType:'json',
        beforeSend: function(){
            $('#contact-form .form-control').removeClass('error');
            $('#contact-form .error-text').remove();
            $('#contact-form-submit').attr("disabled", true);
        },
        success: function(json) {
            
            if(json.errors){
                
                var error = '';
                
                for (var key in json.errors) {    
                    
                    if(key == 'contact_form_gdpr'){
                        $('#contact-form [name="'+ key +'"]').addClass('error');
                        $('#contact-form [name="'+ key +'"]').siblings().after('<span class="error-text text-danger" style="display: block;">'+ json.errors[key] +'</span>');
                    }else{
                        $('#contact-form [name="'+ key +'"]').addClass('error');
                        $('#contact-form [name="'+ key +'"]').after('<span class="error-text text-danger">'+ json.errors[key] +'</span>');
                    }
                        
                }

            }
            
            if(json.success){
                $('#contact-form .modal-body').html("<div class='col-12 text-left'><h3>" + json.success + "</h3></div>");
                $('#contact-form')[0].reset();

                alert(json.title, json.success, "success");

                if(typeof fbq === 'undefined') {
                    fbq('track', 'Lead');
                }
            }

            $('#contact-form-submit').attr("disabled", false);

        }
    });
});


function alert(title, message, type){
    $("#alert_modal .svg-box").hide();
    $("#alert-" + type).show();
    $("#alert-title").html(title);
    $("#alert-message").html(message);
    $("#alert_modal").modal("show");
}

$(function() {
    $('ul#main-menu').smartmenus({
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8
    });
    $('ul#sub-menu').smartmenus({
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8
    });
});



$(".bg-top").parent().addClass('b-top');
$(".bg-bottom").parent().addClass('b-bottom');
$(".bg-center").parent().addClass('b-center');
$(".bg_size_content").parent().addClass('b_size_content');
$(".bg-img").parent().addClass('bg-size');
$(".bg-img.blur-up").parent().addClass('blur-up lazyload');

jQuery('.bg-img').each(function () {

    var el = $(this),
        src = el.attr('src'),
        parent = el.parent();

    parent.css({
        'background-image': 'url(' + src + ')',
        'background-size': 'cover',
        'background-position': 'center',
        'display': 'block'
    });

    el.hide();
});



    
    

    /*=====================
     08. toggle nav
     ==========================*/
    $('.toggle-nav').on('click', function () {
        $('.sm-horizontal').css("right", "0px");
    });
    $(".mobile-back").on('click', function () {
        $('.sm-horizontal').css("right", "-410px");
    });
    
   

    /*=====================
     10. footer according
     ==========================*/
    var contentwidth = jQuery(window).width();
    if ((contentwidth) < '750') {
        jQuery('.footer-title h4').append('<span class="according-menu"></span>');
        jQuery('.footer-title').on('click', function () {
            jQuery('.footer-title').removeClass('active');
            jQuery('.footer-contant').slideUp('normal');
            if (jQuery(this).next().is(':hidden') == true) {
                jQuery(this).addClass('active');
                jQuery(this).next().slideDown('normal');
            }
        });
        jQuery('.footer-contant').hide();
    } else {
        jQuery('.footer-contant').show();
    }

    if ($(window).width() < '1183') {
        jQuery('.menu-title h5').append('<span class="according-menu"></span>');
        jQuery('.menu-title').on('click', function () {
            jQuery('.menu-title').removeClass('active');
            jQuery('.menu-content').slideUp('normal');
            if (jQuery(this).next().is(':hidden') == true) {
                jQuery(this).addClass('active');
                jQuery(this).next().slideDown('normal');
            }
        });
        jQuery('.menu-content').hide();
    } else {
        jQuery('.menu-content').show();
    }


    /*=====================
     11. Add to cart quantity Counter
     ==========================*/
    $("button.add-button").click(function () {
        $(this).next().addClass("open");
        $(".qty-input").val('1');
    });
    $('.quantity-right-plus').on('click', function () {
        var $qty = $(this).siblings(".qty-input");
        var currentVal = parseInt($qty.val());
        if (!isNaN(currentVal)) {
            $qty.val(currentVal + 1);
        }
    });
    $('.quantity-left-minus').on('click', function () {
        var $qty = $(this).siblings(".qty-input");
        var _val = $($qty).val();
        if (_val == '1') {
            var _removeCls = $(this).parents('.cart_qty');
            $(_removeCls).removeClass("open");
        }
        var currentVal = parseInt($qty.val());
        if (!isNaN(currentVal) && currentVal > 0) {
            $qty.val(currentVal - 1);
        }
    });


    /*=====================
     12. Product page Quantity Counter
     ==========================*/
    $('.collection-wrapper .qty-box .quantity-right-plus').on('click', function () {
        var $qty = $('.qty-box .input-number');
        var currentVal = parseInt($qty.val(), 10);
        if (!isNaN(currentVal)) {
            $qty.val(currentVal + 1);
        }
    });
    $('.collection-wrapper .qty-box .quantity-left-minus').on('click', function () {
        var $qty = $('.qty-box .input-number');
        var currentVal = parseInt($qty.val(), 10);
        if (!isNaN(currentVal) && currentVal > 1) {
            $qty.val(currentVal - 1);
        }
    });



    /*=====================
     13. Full slider
     ==========================*/
     if ($(window).width() > 767) {
        var $slider = $(".full-slider");
        $slider.
            on('init', function () {
                mouseWheel($slider);
            }).
            slick({
                dots: true,
                nav: false,
                vertical: true,
                infinite: false
            });

        function mouseWheel($slider) {
            $(window).on('wheel', {
                $slider: $slider
            }, mouseWheelHandler);
        }

        function mouseWheelHandler(event) {
            var $slider = event.data.$slider;
            var delta = event.originalEvent.deltaY;
            if (delta > 0) {
                $slider.slick('slickNext');
            } else {
                $slider.slick('slickPrev');
            }
        }
    } else {
        var $slider = $(".full-slider");
        $slider.
            on('init', function () {
                mouseWheel($slider);
            }).
            slick({
                dots: true,
                nav: false,
                vertical: false,
                infinite: false
            });

        function mouseWheel($slider) {
            $(window).on('wheel', {
                $slider: $slider
            }, mouseWheelHandler);
        }

        function mouseWheelHandler(event) {
            var $slider = event.data.$slider;
            var delta = event.originalEvent.deltaY;
            if (delta > 0) {
                $slider.slick('slickNext');
            } else {
                $slider.slick('slickPrev');
            }
        }
    }


    
    
    

    /*=====================
     16.Tab js
     ==========================*/
     
     $(".default").css("display", "Block");
     $(".tabs li a").on('click', function (event) {
         event.preventDefault();
         $('.tab_product_slider').slick('unslick');
         $('.product-4').slick('unslick');
         $(this).parent().parent().find("li").removeClass("current");
         $(this).parent().addClass("current");
         var currunt_href = $(this).attr("href");
         $('#' + currunt_href).show();
         $(this).parent().parent().parent().find(".tab-content").not('#' + currunt_href).css("display", "none");
         $(".product-4").slick({
             arrows: true,
             dots: false,
             infinite: false,
             speed: 300,
             slidesToShow: 4,
             slidesToScroll: 1,
             responsive: [{
                 breakpoint: 1200,
                 settings: {
                     slidesToShow: 3,
                     slidesToScroll: 3
                 }
             },
             {
                 breakpoint: 991,
                 settings: {
                     slidesToShow: 2,
                     slidesToScroll: 2
                 }
             },
             {
                 breakpoint: 420,
                 settings: {
                     slidesToShow: 1,
                     slidesToScroll: 1
                 }
             }
             ]
         });
     });
     $(".tabs li a").on('click', function () {
         event.preventDefault();
         $('.tab_product_slider').slick('unslick');
         $('.product-5').slick('unslick');
         $(this).parent().parent().find("li").removeClass("current");
         $(this).parent().addClass("current");
         var currunt_href = $(this).attr("href");
         $('#' + currunt_href).show();
         $(this).parent().parent().parent().find(".tab-content").not('#' + currunt_href).css("display", "none");
         
         $(".product-5").slick({
             arrows: true,
             dots: false,
             infinite: false,
             speed: 300,
             slidesToShow: 5,
             slidesToScroll: 1,
             responsive: [{
                 breakpoint: 1367,
                 settings: {
                     slidesToShow: 4,
                     slidesToScroll: 4
                 }
             },
             {
                 breakpoint: 1024,
                 settings: {
                     slidesToShow: 3,
                     slidesToScroll: 3,
                     infinite: true
                 }
             },
             {
                 breakpoint: 768,
                 settings: {
                     slidesToShow: 2,
                     slidesToScroll: 2
                 }
             },
             {
                 breakpoint: 576,
                 settings: {
                     slidesToShow: 1,
                     slidesToScroll: 1
                 }
             }
             ]
 
         });
     });
 
 
     $("#tab-1").css("display", "Block");
     $(".default").css("display", "Block");
     $(".tabs li a").on('click', function () {
         event.preventDefault();
         $('.tab_product_slider').slick('unslick');
         $('.product-3').slick('unslick');
         $(this).parent().parent().find("li").removeClass("current");
         $(this).parent().addClass("current");
         var currunt_href = $(this).attr("href");
         $('#' + currunt_href).show();
         $(this).parent().parent().parent().parent().find(".tab-content").not('#' + currunt_href).css("display", "none");
         $(".product-3").slick({
             arrows: true,
             dots: false,
             infinite: false,
             speed: 300,
             slidesToShow: 3,
             slidesToScroll: 1,
             responsive: [{
                 breakpoint: 991,
                 settings: {
                     slidesToShow: 2,
                     slidesToScroll: 2
                 }
             }]
         });
     });

    /*=====================
     17 .category page
     ==========================*/
    $('.collapse-block-title').on('click', function (e) {
        e.preventDefault;
        var speed = 300;
        var thisItem = $(this).parent(),
            nextLevel = $(this).next('.collection-collapse-block-content');
        if (thisItem.hasClass('open')) {
            thisItem.removeClass('open');
            nextLevel.slideUp(speed);
        } else {
            thisItem.addClass('open');
            nextLevel.slideDown(speed);
        }
    });
    $('.color-selector ul li').on('click', function (e) {
        $(".color-selector ul li").removeClass("active");
        $(this).addClass("active");
    });
    
    
    $('.list-layout-view').on('click', function (e) {
        $('.collection-grid-view').css('opacity', '0');
        $(".product-wrapper-grid").css("opacity", "0.2");
        $('.shop-cart-ajax-loader').css("display", "block");
        $('.product-wrapper-grid').addClass("list-view");
        $(".product-wrapper-grid").children().children().removeClass();
        $(".product-wrapper-grid").children().children().addClass("col-lg-12");
        setTimeout(function () {
            $(".product-wrapper-grid").css("opacity", "1");
            $('.shop-cart-ajax-loader').css("display", "none");
        }, 500);
    });

    $(document).ready(function(){
        
        $('.grid-layout-view').on('click', function (e) {
            $('.collection-grid-view').css('opacity', '1');
            $('.product-wrapper-grid').removeClass("list-view");
            $(".product-wrapper-grid").children().children().removeClass();
            $(".product-wrapper-grid").children().children().addClass("col-lg-3");

        });
        $('.product-2-layout-view').on('click', function (e) {
            if ($('.product-wrapper-grid').hasClass("list-view")) { } else {
                $(".product-wrapper-grid").children().children().removeClass();
                $(".product-wrapper-grid").children().children().addClass("col-lg-6");
            }
        });
        

        $('.product-3-layout-view').on('click', function (e) {
            if ($('.product-wrapper-grid').hasClass("list-view")) { } else {
                $(".product-wrapper-grid").children().children().removeClass();
                $(".product-wrapper-grid").children().children().addClass("col-lg-4 col-6");
            }
        });
        $('.product-4-layout-view').on('click', function (e) {
            if ($('.product-wrapper-grid').hasClass("list-view")) { } else {
                $(".product-wrapper-grid").children().children().removeClass();
                $(".product-wrapper-grid").children().children().addClass("col-xl-3 col-6");
            }
        });
        $('.product-6-layout-view').on('click', function (e) {
            if ($('.product-wrapper-grid').hasClass("list-view")) { } else {
                $(".product-wrapper-grid").children().children().removeClass();
                $(".product-wrapper-grid").children().children().addClass("col-lg-2");
            }
        });

    });


    /*=====================
     18.filter sidebar js
     ==========================*/
    $('.sidebar-popup').on('click', function (e) {
        $('.open-popup').toggleClass('open');
        $('.collection-filter').css("left", "-15px");
    });
    $('.filter-btn').on('click', function (e) {
        $('.collection-filter').css("left", "-15px");
    });
    $('.filter-back').on('click', function (e) {
        $('.collection-filter').css("left", "-365px");
        $('.sidebar-popup').trigger('click');
    });

    $('.account-sidebar').on('click', function (e) {
        $('.dashboard-left').css("left", "0");
    });
    $('.filter-back').on('click', function (e) {
        $('.dashboard-left').css("left", "-365px");
    });

    


    


    /*=====================
    26. other js
    ==========================*/


    $('.size-box ul li').on('click', function (e) {
        $(".size-box ul li").removeClass("active");
        $('#selectSize').removeClass('cartMove');
        $(this).addClass("active");
        $(this).parent().addClass('selected');
    });


/*! lazysizes - v3.0.0 */
!function(a,b){var c=b(a,a.document);a.lazySizes=c,"object"==typeof module&&module.exports&&(module.exports=c)}(window,function(a,b){"use strict";if(b.getElementsByClassName){var c,d=b.documentElement,e=a.Date,f=a.HTMLPictureElement,g="addEventListener",h="getAttribute",i=a[g],j=a.setTimeout,k=a.requestAnimationFrame||j,l=a.requestIdleCallback,m=/^picture$/i,n=["load","error","lazyincluded","_lazyloaded"],o={},p=Array.prototype.forEach,q=function(a,b){return o[b]||(o[b]=new RegExp("(\\s|^)"+b+"(\\s|$)")),o[b].test(a[h]("class")||"")&&o[b]},r=function(a,b){q(a,b)||a.setAttribute("class",(a[h]("class")||"").trim()+" "+b)},s=function(a,b){var c;(c=q(a,b))&&a.setAttribute("class",(a[h]("class")||"").replace(c," "))},t=function(a,b,c){var d=c?g:"removeEventListener";c&&t(a,b),n.forEach(function(c){a[d](c,b)})},u=function(a,c,d,e,f){var g=b.createEvent("CustomEvent");return g.initCustomEvent(c,!e,!f,d||{}),a.dispatchEvent(g),g},v=function(b,d){var e;!f&&(e=a.picturefill||c.pf)?e({reevaluate:!0,elements:[b]}):d&&d.src&&(b.src=d.src)},w=function(a,b){return(getComputedStyle(a,null)||{})[b]},x=function(a,b,d){for(d=d||a.offsetWidth;d<c.minSize&&b&&!a._lazysizesWidth;)d=b.offsetWidth,b=b.parentNode;return d},y=function(){var a,c,d=[],e=[],f=d,g=function(){var b=f;for(f=d.length?e:d,a=!0,c=!1;b.length;)b.shift()();a=!1},h=function(d,e){a&&!e?d.apply(this,arguments):(f.push(d),c||(c=!0,(b.hidden?j:k)(g)))};return h._lsFlush=g,h}(),z=function(a,b){return b?function(){y(a)}:function(){var b=this,c=arguments;y(function(){a.apply(b,c)})}},A=function(a){var b,c=0,d=125,f=666,g=f,h=function(){b=!1,c=e.now(),a()},i=l?function(){l(h,{timeout:g}),g!==f&&(g=f)}:z(function(){j(h)},!0);return function(a){var f;(a=a===!0)&&(g=44),b||(b=!0,f=d-(e.now()-c),0>f&&(f=0),a||9>f&&l?i():j(i,f))}},B=function(a){var b,c,d=99,f=function(){b=null,a()},g=function(){var a=e.now()-c;d>a?j(g,d-a):(l||f)(f)};return function(){c=e.now(),b||(b=j(g,d))}},C=function(){var f,k,l,n,o,x,C,E,F,G,H,I,J,K,L,M=/^img$/i,N=/^iframe$/i,O="onscroll"in a&&!/glebot/.test(navigator.userAgent),P=0,Q=0,R=0,S=-1,T=function(a){R--,a&&a.target&&t(a.target,T),(!a||0>R||!a.target)&&(R=0)},U=function(a,c){var e,f=a,g="hidden"==w(b.body,"visibility")||"hidden"!=w(a,"visibility");for(F-=c,I+=c,G-=c,H+=c;g&&(f=f.offsetParent)&&f!=b.body&&f!=d;)g=(w(f,"opacity")||1)>0,g&&"visible"!=w(f,"overflow")&&(e=f.getBoundingClientRect(),g=H>e.left&&G<e.right&&I>e.top-1&&F<e.bottom+1);return g},V=function(){var a,e,g,i,j,m,n,p,q;if((o=c.loadMode)&&8>R&&(a=f.length)){e=0,S++,null==K&&("expand"in c||(c.expand=d.clientHeight>500&&d.clientWidth>500?500:370),J=c.expand,K=J*c.expFactor),K>Q&&1>R&&S>2&&o>2&&!b.hidden?(Q=K,S=0):Q=o>1&&S>1&&6>R?J:P;for(;a>e;e++)if(f[e]&&!f[e]._lazyRace)if(O)if((p=f[e][h]("data-expand"))&&(m=1*p)||(m=Q),q!==m&&(C=innerWidth+m*L,E=innerHeight+m,n=-1*m,q=m),g=f[e].getBoundingClientRect(),(I=g.bottom)>=n&&(F=g.top)<=E&&(H=g.right)>=n*L&&(G=g.left)<=C&&(I||H||G||F)&&(l&&3>R&&!p&&(3>o||4>S)||U(f[e],m))){if(ba(f[e]),j=!0,R>9)break}else!j&&l&&!i&&4>R&&4>S&&o>2&&(k[0]||c.preloadAfterLoad)&&(k[0]||!p&&(I||H||G||F||"auto"!=f[e][h](c.sizesAttr)))&&(i=k[0]||f[e]);else ba(f[e]);i&&!j&&ba(i)}},W=A(V),X=function(a){r(a.target,c.loadedClass),s(a.target,c.loadingClass),t(a.target,Z)},Y=z(X),Z=function(a){Y({target:a.target})},$=function(a,b){try{a.contentWindow.location.replace(b)}catch(c){a.src=b}},_=function(a){var b,d,e=a[h](c.srcsetAttr);(b=c.customMedia[a[h]("data-media")||a[h]("media")])&&a.setAttribute("media",b),e&&a.setAttribute("srcset",e),b&&(d=a.parentNode,d.insertBefore(a.cloneNode(),a),d.removeChild(a))},aa=z(function(a,b,d,e,f){var g,i,k,l,o,q;(o=u(a,"lazybeforeunveil",b)).defaultPrevented||(e&&(d?r(a,c.autosizesClass):a.setAttribute("sizes",e)),i=a[h](c.srcsetAttr),g=a[h](c.srcAttr),f&&(k=a.parentNode,l=k&&m.test(k.nodeName||"")),q=b.firesLoad||"src"in a&&(i||g||l),o={target:a},q&&(t(a,T,!0),clearTimeout(n),n=j(T,2500),r(a,c.loadingClass),t(a,Z,!0)),l&&p.call(k.getElementsByTagName("source"),_),i?a.setAttribute("srcset",i):g&&!l&&(N.test(a.nodeName)?$(a,g):a.src=g),(i||l)&&v(a,{src:g})),a._lazyRace&&delete a._lazyRace,s(a,c.lazyClass),y(function(){(!q||a.complete&&a.naturalWidth>1)&&(q?T(o):R--,X(o))},!0)}),ba=function(a){var b,d=M.test(a.nodeName),e=d&&(a[h](c.sizesAttr)||a[h]("sizes")),f="auto"==e;(!f&&l||!d||!a.src&&!a.srcset||a.complete||q(a,c.errorClass))&&(b=u(a,"lazyunveilread").detail,f&&D.updateElem(a,!0,a.offsetWidth),a._lazyRace=!0,R++,aa(a,b,f,e,d))},ca=function(){if(!l){if(e.now()-x<999)return void j(ca,999);var a=B(function(){c.loadMode=3,W()});l=!0,c.loadMode=3,W(),i("scroll",function(){3==c.loadMode&&(c.loadMode=2),a()},!0)}};return{_:function(){x=e.now(),f=b.getElementsByClassName(c.lazyClass),k=b.getElementsByClassName(c.lazyClass+" "+c.preloadClass),L=c.hFac,i("scroll",W,!0),i("resize",W,!0),a.MutationObserver?new MutationObserver(W).observe(d,{childList:!0,subtree:!0,attributes:!0}):(d[g]("DOMNodeInserted",W,!0),d[g]("DOMAttrModified",W,!0),setInterval(W,999)),i("hashchange",W,!0),["focus","mouseover","click","load","transitionend","animationend","webkitAnimationEnd"].forEach(function(a){b[g](a,W,!0)}),/d$|^c/.test(b.readyState)?ca():(i("load",ca),b[g]("DOMContentLoaded",W),j(ca,2e4)),f.length?(V(),y._lsFlush()):W()},checkElems:W,unveil:ba}}(),D=function(){var a,d=z(function(a,b,c,d){var e,f,g;if(a._lazysizesWidth=d,d+="px",a.setAttribute("sizes",d),m.test(b.nodeName||""))for(e=b.getElementsByTagName("source"),f=0,g=e.length;g>f;f++)e[f].setAttribute("sizes",d);c.detail.dataAttr||v(a,c.detail)}),e=function(a,b,c){var e,f=a.parentNode;f&&(c=x(a,f,c),e=u(a,"lazybeforesizes",{width:c,dataAttr:!!b}),e.defaultPrevented||(c=e.detail.width,c&&c!==a._lazysizesWidth&&d(a,f,e,c)))},f=function(){var b,c=a.length;if(c)for(b=0;c>b;b++)e(a[b])},g=B(f);return{_:function(){a=b.getElementsByClassName(c.autosizesClass),i("resize",g)},checkElems:g,updateElem:e}}(),E=function(){E.i||(E.i=!0,D._(),C._())};return function(){var b,d={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.5,hFac:.8,loadMode:2};c=a.lazySizesConfig||a.lazysizesConfig||{};for(b in d)b in c||(c[b]=d[b]);a.lazySizesConfig=c,j(function(){c.init&&E()})}(),{cfg:c,autoSizer:D,loader:C,init:E,uP:v,aC:r,rC:s,hC:q,fire:u,gW:x,rAF:y}}});