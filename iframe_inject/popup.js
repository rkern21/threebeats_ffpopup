try {
    function getURL(path) {
        return "url('chrome://threebeats/content/inject/images/" + path + "')";
    }

    // popupHTML will be initialized from the extension
    $('body').prepend(popupHTML);
	
	$('.threebeats_popup').css('background-image', getURL('popup_bg.png'));
	
    $("i[title=threeBeatsExtPopup]").mymodal();
    
} catch(exc) {
    alert("Injected code exception: " + exc + "\n\n" + exc.stack);
}