(function($) {

	// variables used to auto fadeout popup
    var hideDelay = 2000; //two seconds delay before hiding popup
    var hideDelayTimer = null;
    var beingShown = false;
    var shown = false;
    var vote = 0;
    var rank = "";

    $.fn.mymodal = function(options) {
        try {
            // creating popup on page load and hiding it till mouseover
            var area_id = this.attr("title");
            var imagePath = this.attr("img");

            divText = $("#" + area_id).html();
            $("#" + area_id).html("<div id='trbcom'>" + divText + "</div>");
            $("#" + area_id).css("display", "none");


            // special variables which are used in plugin
            var h = self.innerHeight || document.body.clientHeight;
            var w = self.innerWidth || document.body.clientWidth;
            var scrollY = 0;
            var linkwidth = this.width();
            var left_offset_position = parseInt(this.offset().left);
            var top_offset_position = this.offset().top;
            var right_offset_position = w - left_offset_position - linkwidth;
            var bottom_offset_position = h - this.offset().top + this.height();

            //default popup position
            var topns = top_offset_position + 20;
            var left = left_offset_position + 80;

            // setting popup position
            if (bottom_offset_position < 400) {
                topns = top_offset_position - 270;
            }
            if (bottom_offset_position < top_offset_position) {
                topns = top_offset_position - 270;
            } else {
                topns = top_offset_position;
            }
            if (right_offset_position < 400) {
                left = w - 490;
            }
            if (bottom_offset_position < 250 && top_offset_position < 250) {
                topns = top_offset_position - 90;
            }

            // setting popup position if window scroll
            $(window).scroll(function () {
                if (typeof window.pageYOffset == "number") {
                    scrollY = window.pageYOffset;
                } else if (document.documentElement && document.documentElement.scrollTop) {
                    scrollY = document.documentElement.scrollTop;
                } else if (document.body && document.body.scrollTop) {
                    scrollY = document.body.scrollTop;
                } else if (window.scrollY) {
                    scrollY = window.scrollY;
                }

                h = self.innerHeight || document.body.clientHeight;
                w = self.innerWidth || document.body.clientWidth;
                h = h + scrollY;
            });
			
            var parts = $(this).html().split(" "); 
			var seleb=parts[0]+" "+parts[1];
			return_to_default(seleb,imagePath);
			
            // Auto fadeout when mouse is on the link
            this.mouseover(function (e) {
                if (hideDelayTimer) {
                    clearTimeout(hideDelayTimer);
                }

                if (beingShown || shown) {
                    // don't trigger the  animation again
                    return;
                }

                
                topns = e.pageY;
                left = e.pageX;
                if (h - topns < 250) {
                    topns = topns - 250;
                }
                if (w - left < 380) {
                    left = left - 380;
                }

                // showing popup on mouse over the link
                beingShown = true;

                var popup = $("#" + area_id);

                popup.css({"top":topns,"left":left});
                popup.fadeIn(500);
                beingShown = false;
                shown = true;
                return false;
            }).mouseout(function() {
                hidePopup(area_id,seleb,imagePath);
            });


            // Auto fadout when mouse is on the popup
            $("#" + area_id).mouseover(function () {
                if (hideDelayTimer) {
                    clearTimeout(hideDelayTimer);
                }

                if (beingShown || shown) {
                    // don't trigger the  animation again
                    return;
                }
                // avoiding fadeout when mouse is in popup borders
                beingShown = true;
                $("#" + area_id).fadeIn(500);
                beingShown = false;
                shown = true;
                return false;
            }).mouseout(function() {
                hidePopup(area_id,seleb,imagePath);
            });


            // "X" (close) button functionality
            $(".threebeats_close_button").click(function() {
                $("#" + area_id).fadeOut(500, function () {
                		hideDelayTimer = null;
                		shown = false;
               			rank = "";
                        return_to_default(seleb,imagePath);
                });
                return false;

            });

        } catch(ex) {
            alert("Injected code exception[jpopup]: " + ex + "\n\n" + ex.stack);
        }
    };

    function hidePopup(area_id,seleb,imagePath) {
        if (hideDelayTimer) {
            clearTimeout(hideDelayTimer);
        }
        hideDelayTimer = setTimeout(function () {

            //auto fadeout when mose lefts popup borders
            hideDelayTimer = null;
            rank = "";
            shown = false;
            $("#" + area_id).fadeOut(500, function () {
            	return_to_default(seleb,imagePath);
            });
          }, hideDelay);
        return false;
    }

    //reseting to default view after click "X" or vote
	function return_to_default(seleb,imagePath) {
        // alter this sting to set path to the 3beats server 
        $('#trbeats_iframe').attr("src", "http://knopka.in/iframe/server.php?seleb="+seleb+"&imgpath="+imagePath);
    }




    
})(jQuery);
