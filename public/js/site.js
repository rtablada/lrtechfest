(function($) {
	function landingInit() {
		var landing = $('#landing');
		var winHeight = $(window).height();
		var contentHeight = $(".landing-content").height();
		var landingHeight = Math.max(winHeight, contentHeight+195);
		landing.css({
			//height: landingHeight + "px"
		});
	};

	$(window).resize(landingInit);
	$(document).ready(landingInit);
})(jQuery);