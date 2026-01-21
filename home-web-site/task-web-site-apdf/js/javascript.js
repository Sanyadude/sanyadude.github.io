$(document).ready(function(){

	/* SCROLL */
	
	$("#navbar").on("click","a", function (event) {
		event.preventDefault();
		var id  = $(this).attr('href'),
		top = $(id).offset().top-80;
		$('body,html').animate({scrollTop: top}, 600);
	});
	
	/* SLIDER */

	$("#slider li").each(function(){
		$(this).click(function(){
			$(".slideblock .container").empty().append("<p><span>"+$(this).children("p").children(".headslide").text()+"</span><br>"+$(this).children("p").children(".textslide").text()+"</p>");
			$("#slider li").removeClass("active");
			$(this).addClass("active");
			$(".slideblock").css({"background-image":"url("+$(".active img").attr("data-img-to-background")+")"});
		})
	})
	setInterval(
		function(){
			if ($("#slider li.active").next().hasClass("s")){
				$("#slider li.active").next().addClass("active").prev().removeClass("active");
			}
			else {
				$("#slider li").removeClass("active").first().addClass("active");
			}
			$(".slideblock .container").empty().append("<p><span>"+$(".active p .headslide").text()+"</span><br>"+$(".active p .textslide").text()+"</p>");
			$(".slideblock").css({"background-image":"url("+$(".active img").attr("data-img-to-background")+")"});
	},8000)

	/* CAROUSEL */

	$(".carouselpage").each(function(){
		$(this).click(function(){
			$(".carouselpage").removeClass("cpactive");
			$(this).addClass("cpactive");
			$(".carouselelement").removeClass("activecarousel hidecarousel previouscarousel nextcarousel").addClass("hidecarousel");
			$(".carouselelement").eq($(this).index()).removeClass("hidecarousel").addClass("activecarousel");
			if ($(this).index() == 4){
				$(".carouselelement").first().removeClass("hidecarousel").addClass("nextcarousel");
				$(".carouselelement").eq($(this).index()).prev().removeClass("hidecarousel").addClass("previouscarousel")
			}
			else {
				$(".carouselelement").eq($(this).index()).next().removeClass("hidecarousel").addClass("nextcarousel");
			}
			if ($(this).index() == 0){
				$(".carouselelement").last().removeClass("hidecarousel").addClass("previouscarousel")
			}
			else {
				$(".carouselelement").eq($(this).index()).prev().removeClass("hidecarousel").addClass("previouscarousel")
			}
		})
	})

	$(".prevarrow").click(function(){
			$(".nextcarousel").removeClass("nextcarousel").addClass("hidecarousel");
			$(".activecarousel").removeClass("activecarousel").addClass("nextcarousel");
			$(".previouscarousel").removeClass("previouscarousel").addClass("activecarousel");
			if ($(".activecarousel").prev().hasClass("hidecarousel")){
				$(".activecarousel").prev().removeClass("hidecarousel").addClass("previouscarousel");
			}
			else {
				$(".carouselelement").last().removeClass("hidecarousel").addClass("previouscarousel");
			}
			if ($(".cpactive").prev().hasClass("carouselpage")){
				$(".cpactive").prev().addClass("cpactive");
				$(".cpactive").last().removeClass("cpactive");
			}
			else {
				$(".cpactive").removeClass("cpactive");
				$(".carouselpage").last().addClass("cpactive");
			}
	})

	$(".nextarrow").click(function(){
			$(".previouscarousel").removeClass("previouscarousel").addClass("hidecarousel");
			$(".activecarousel").removeClass("activecarousel").addClass("previouscarousel");
			$(".nextcarousel").removeClass("nextcarousel").addClass("activecarousel");
			if ($(".activecarousel").next().hasClass("hidecarousel")){
				$(".activecarousel").next().removeClass("hidecarousel").addClass("nextcarousel");
			}
			else {
				$(".carouselelement").first().removeClass("hidecarousel").addClass("nextcarousel");
			}
			if ($(".cpactive").next().hasClass("carouselpage")){
				$(".cpactive").next().addClass("cpactive");
				$(".cpactive").first().removeClass("cpactive");
			}
			else {
				$(".cpactive").removeClass("cpactive");
				$(".carouselpage").first().addClass("cpactive");
			}
	})
});