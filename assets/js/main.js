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
var fb = new FirebaseInt(jquery);


$(document).ready(function () {
	////// JQuery Obj /////////



	/////////// Firebase ///////
	// User Authentication
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result) {

		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;
		// ...
		// Create listener event on data base table
	}.bind(this)).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		// ...
	});
	// Instantiating Firebase Obj

	fb.connected();
	//////////////////// Events Listener's ////////////////////
	jquery.btnStart.on('click', function (e) {
		e.preventDefault();

		var playerName = jquery.nameInput.val().trim();

		if (playerName !== ''){
			fb.playerStart(playerName);
		}
	});


});
