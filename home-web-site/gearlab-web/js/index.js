$(document).ready(function () {
    $('body').scrollspy({
        target: ".navbar",
        offset: 72
    });
    $(".smooth a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 72
            }, 600, function () {
                window.location.hash = hash;
            });
        }
    });
});