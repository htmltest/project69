var sliderPeriod    = 5000;
var sliderTimer     = null;

$(document).ready(function() {

    $.validator.addMethod('maskPhone',
        function(value, element) {
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Не соответствует формату'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('.catalogue-sort-value').click(function() {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.catalogue-sort').length == 0) {
            $('.catalogue-sort-select').removeClass('open');
        }
    });

    $('.product-photo-preview ul li a').click(function(e) {
        var curLink = $(this);
        var curLi = curLink.parent();
        if (!curLink.parent().hasClass('active')) {
            $('.product-photo-preview ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.product-photo-big img').attr('src', curLink.attr('href'));
        }
        e.preventDefault();
    });

    $('.slider').each(function() {
        var curSlider = $(this);
        curSlider.data('curIndex', 0);
        curSlider.data('disableAnimation', true);
        if (curSlider.find('.slider-item').length > 1) {
            var curHTML = '';
            curSlider.find('.slider-item').each(function() {
                curHTML += '<a href="#"></a>';
            });
            $('.slider-ctrl').html(curHTML);
            $('.slider-ctrl a:first').addClass('active');
            sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
        }
    });

    function sliderNext() {
        var curSlider = $('.slider');

        if (curSlider.data('disableAnimation')) {
            var curIndex = curSlider.data('curIndex');
            var newIndex = curIndex + 1;
            if (newIndex >= curSlider.find('.slider-item').length) {
                newIndex = 0;
            }

            curSlider.data('curIndex', newIndex);
            curSlider.data('disableAnimation', false);

            curSlider.find('.slider-item').eq(curIndex).css({'z-index': 2});
            curSlider.find('.slider-item').eq(newIndex).css({'z-index': 1}).show();

            curSlider.find('.slider-ctrl a.active').removeClass('active');
            curSlider.find('.slider-ctrl a').eq(newIndex).addClass('active');

            curSlider.find('.slider-item').eq(curIndex).fadeOut(function() {
                curSlider.data('disableAnimation', true);
                sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
            });
        }
    }

    $('.slider').on('click', '.slider-ctrl a', function(e) {
        if (!$(this).hasClass('active')) {
            window.clearTimeout(sliderTimer);
            sliderTimer = null;

            var curSlider = $('.slider');
            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                var newIndex = $('.slider-ctrl a').index($(this));

                curSlider.data('curIndex', newIndex);
                curSlider.data('disableAnimation', false);

                curSlider.find('.slider-item').eq(curIndex).css({'z-index': 2});
                curSlider.find('.slider-item').eq(newIndex).css({'z-index': 1}).show();

                curSlider.find('.slider-ctrl a.active').removeClass('active');
                curSlider.find('.slider-ctrl a').eq(newIndex).addClass('active');

                curSlider.find('.slider-item').eq(curIndex).fadeOut(function() {
                    curSlider.data('disableAnimation', true);
                    sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                });
            }
        }

        e.preventDefault();
    });

    $('.main-catalogue-menu > ul > li > a').click(function(e) {
        $(this).parent().toggleClass('open');
        e.preventDefault();
    });

    $('.bestsellers').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: false,
        dots: true
    });

    $('.order-tabs-menu-item label input').change(function() {
        var curItem = $(this).parent().parent();
        var curTabs = curItem.parent().parent();
        var curIndex = curTabs.find('.order-tabs-menu-item').index(curItem);
        curTabs.find('.order-tab.active').removeClass('active');
        curTabs.find('.order-tab').eq(curIndex).addClass('active');
    });

});

$(window).on('resize', function() {
    $('.form-select select').chosen('destroy');
    $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
});

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});

    curForm.find('input[type="number"]').each(function() {
        var curBlock = $(this).parent();
        var curHTML = curBlock.html();
        curBlock.html(curHTML.replace(/type=\"number\"/g, 'type="text"'));
        curBlock.find('input').spinner();
        curBlock.find('input').keypress(function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode
            if (charCode > 31 && (charCode < 43 || charCode > 57)) {
                return false;
            }
            return true;
        });
    });

    curForm.find('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });

    curForm.validate({
        ignore: '',
        invalidHandler: function(form, validatorcalc) {
            validatorcalc.showErrors();
            checkErrors();
        }
    });
}

function checkErrors() {
    $('.form-checkbox, .form-input, .form-file').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0 || curField.find('textarea.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('input.valid').length > 0 || curField.find('textarea.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });
}