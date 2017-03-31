$(document).ready(function () {
	// Start Btn
	$$.btnStart.on('click', function (e) {
		e.preventDefault();

		if (playerName === ''){
			// do something
		}else {
			var playerName = $$.nameInput.val().trim();
			fb.playerInit(playerName);
		}


	});




});



