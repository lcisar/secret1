document.addEventListener("contextmenu",block_image_full, false);
document.addEventListener("dragstart",block_image_full, false);
document.addEventListener("touchmove",block_image_full, false); /* same as drag? */
document.addEventListener("touchstart",block_image_full, false);
document.addEventListener("gesturestart",block_image_full, false);
	

function full_block(event) {
	event.cancelBubble = true;
	if(event.preventDefault != undefined) {
		event.preventDefault();
	}
	if(event.stopPropagation != undefined) {
		event.stopPropagation();
	}
	return false;
}
function block_image_full(event) {
	try {
		if (event.target.tagName == "IMG") {
			
            event.cancelBubble = true;
			if(event.preventDefault != undefined) {
				event.preventDefault();
			}
			if(event.stopPropagation != undefined) {
				event.stopPropagation();
			}

            console.log("Ťahaj čórovať obrázky inde !");

			return false;
		} 
	} catch(error) {
		console.log("error:"+error);
	}

	try {
		if(event.target.getAttribute("style")==null || 
			event.target.getAttribute("style")=="") {
				return true;
		}
		if  (event.target.style.backgroundImage != null 
			&& event.target.style.backgroundImage != 'none' 
			&& event.target.style.backgroundImage != '') {
				event.cancelBubble = true;
				if(event.preventDefault != undefined) {
					event.preventDefault();
				}
				if(event.stopPropagation != undefined) {
					event.stopPropagation();
				}
				return false;
		}
	} catch(error) {
		console.log("error:"+error);
	}
	return true;
	
}