try {
    function getURL(path) {
        return "url('chrome://threebeats/content/inject/images/" + path + "')";
    }

    // popupHTML will be initialized from the extension
    $('body').prepend(popupHTML);

    $('#threebeats_header_bg').css('background-image', getURL('header_bg.png'));
    $('#threebeats_middle_bg').css('background-image', getURL('middle_bg.png'));
    $('#threebeats_facebook_bg').css('background-image', getURL('facebook_bg.png'));
    $('#threebeats_footer_bg').css('background-image', getURL('footer_bg.png'));
    $('#threebeats').css('background-image', getURL('3beats.png'));
    $('.threebeats_button_m2').css('background-image', getURL('rank-buttons.png'));
    $('#threebeats_current_rank_m2').css('background-image', getURL('rank-buttons.png'));
    $('.threebeats_button_m1').css('background-image', getURL('rank-buttons.png'));
    $('#threebeats_current_rank_m1').css('background-image', getURL('rank-buttons.png'));
    $('.threebeats_button_p1').css('background-image', getURL('rank-buttons.png'));
    $('#threebeats_current_rank_p1').css('background-image', getURL('rank-buttons.png'));
    $('.threebeats_button_p2').css('background-image', getURL('rank-buttons.png'));
    $('#threebeats_current_rank_p2').css('background-image', getURL('rank-buttons.png'));
    $('#threebeats_middle_area').css('background-image', getURL('middle_area.png'));
    // $('#threebeats_comment_state').css('background-image', getURL('comment_border.png'));

    $('.threebeats_fb_comment_bg').hover(
            function() {
                $(this).css('background-image', 'none');
            },
            function() {
                $(this).css('background-image', getURL('comment_hv.png'));
            });

    $('.threebeats_submitbtn').css('background-image', getURL('submit_sprite.png'));
	
	//textarea background fix
	$("#threebeats_comment_textbox").css("background-color","#000");
    
    $('#threeBeatsExtPopup').createPopup();
    $("i[title=threeBeatsExtPopup]").each(function(i){
        $(this).mymodal();
    });
    
} catch(exc) {
    alert("Injected code exception: " + exc + "\n\n" + exc.stack);
}
