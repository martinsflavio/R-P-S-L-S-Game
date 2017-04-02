$(document).ready(function () {
////// JQuery Obj /////////
	var jquery = {
		formStart : $('#form-start'),
		textDialog : $('#text-dialog'),
		btnStart : $('#btn-start'),
		nameInput : $('#name-input'),
		nameDisplay : $('#name-display'),
		table : $('#table'),
		//player
		cardsContainer : $('#cards-container'),
		gameCards : $('.game-card'),
		win : $('#win'),
		lose : $('#lose'),
		//opponent
		oppNameDisplay : $('#opp-name-display'),
		oppCardsContainer : $('#opp-cards-container'),
		oppGameCards : $('.opp-game-card'),
		oppWin : $('#opp-win'),
		oppLose : $('#opp-lose'),
		//chat
		displayChat : $('#display-chat'),
		inputChat : $('#input-chat'),
		btnSend : $('#btn-send'),
	};

/////////// Firebase ///////
var fb = new FirebaseInt(jquery);
var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider).then(function(result) {
	// Create listener event on data base table
	fb.pageUptade(fb.tableRef);
	// This gives you a Google Access Token. You can use it to access the Google API.
	var token = result.credential.accessToken;
	// The signed-in user info.
	var user = result.user;
	// ...
}).catch(function(error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	// The email of the user's account used.
	var email = error.email;
	// The firebase.auth.AuthCredential type that was used.
	var credential = error.credential;
	// ...
});


//////////////////// Events Listener's ////////////////////
	jquery.btnStart.on('click', function (e) {
		e.preventDefault();

		var playerName = jquery.nameInput.val().trim();

		if (playerName !== ''){
			fb.playerStart(playerName);
		}
	});


});
