function rpsls(p2, p1){
	p1 = p1.toLowerCase();
	p2 = p2.toLowerCase();
	
	console.log("p1: "+p1);
	console.log("p2 : "+p2);	

	console.log("======================");
	if(p1 === p2){
		console.log("tie");
	}else if(p1 === "rock"){
		if(p2 === "paper"){console.log("p2 win");}
		if(p2 === "scissors"){console.log("p1 win");}
		if(p2 === "lizard"){console.log("p1 win");}
		if(p2 === "spock"){console.log("p2 win");}
	}else if(p1 === "paper"){
		if(p2 === "scissors"){console.log("p2 win");}
		if(p2 === "rock"){console.log("p1 win");}
		if(p2 === "lizard"){console.log("p2 win");}
		if(p2 === "spock"){console.log("p1 win");}
	}else if(p1 === "scissors"){
		if(p2 === "paper"){console.log("p1 win");}
		if(p2 === "rock"){console.log("p2 win");}
		if(p2 === "lizard"){console.log("p1 win");}
		if(p2 === "spock"){console.log("p2 win");}
	}else if(p1 === "lizard"){
		if(p2 === "paper"){console.log("p1 win");}
		if(p2 === "rock"){console.log("p2 win");}
		if(p2 === "scissors"){console.log("p2 win");}
		if(p2 === "spock"){console.log("p1 win");}
	}else if(p1 === "spock"){
		if(p2 === "paper"){console.log("p2 win");}
		if(p2 === "rock"){console.log("p1 win");}
		if(p2 === "scissors"){console.log("p1 win");}
		if(p2 === "lizard"){console.log("p2 win");}
	}else{
		console.log("input Invalid");
	}
}

//Get Elements
const $$ = {
	//Me
	meNameInput : $('#me-name-input'),
	meNameDisplay : $('.me-name-display'),
	chose : $('.chose'),
	meWin : $('#me-win'),
	meLose : $('#me-lose'),
	//Opponent
	opponentNameDisplay : $('#opponent-name-display'),
	opponentWin : $('#opponent-win'),
	opponentLose : $('#opponent-lose'),
	// DOM
	btnStart : $('#btn-start'),
}
//Create references
const db = {
	root : firebase.database(),
	players : firebase.database().ref('/players'),
	connected : firebase.database().ref('.info/connected'),
}

//============= Connecting =======================
//Take the .push() key and store in local variables
// all players key
var opponentKey;
// this player index who point to players array
var meKey; 
db.root.ref('.info/connected').on('value', function(snap) {
	
  if (snap.val()) {
  	// Look for Player Key
  	const status = db.root.ref('/players').push('on');
  	db.root.ref('/players').once('value', function(snap){
  		snap.forEach(function(childsnap){
  			meKey = childsnap.key;

  			// Look for Opponent Key
  			db.players.on('value', function(snap){	
  				var temp = Object.keys(snap.val());
  				for(var i = 0; i<temp.length; i++){
  					if(meKey === temp[i]){

  					}else{
  						opponentKey = temp[i];
  					}
  				}
  			});
  			//---------------------
  		});
  	});
  	//-------------------
  	status.onDisconnect().remove();
  }
});
//============== Monitoring db/players  ==========

db.players.on('value', function(snap){
	
	if(typeof(meKey) === 'string'){
		// Me
		db.players.child(meKey).on('value', function(snap){
			var dbMe = snap.val();
			console.log(snap.val());
			//========== DOM =============

			$$.meNameDisplay.text(dbMe.username);
			$$.meWin.text(dbMe.score.win);
			$$.meLose.text(dbMe.score.lose);
			//----------------------------
		});
	}

	if(typeof(opponentKey) === 'string'){
		// Opponent
		db.players.child(opponentKey).on('value', function(snap){
			var dbOpponent = snap.val();
			console.log(snap.val());
			//========== DOM =============
			$$.opponentNameDisplay.text(dbOpponent.username);
			$$.opponentWin.text(dbOpponent.score.win);
			$$.opponentLose.text(dbOpponent.score.lose);
			//----------------------------
		});
	}
});



//=================================================

$(document).ready(function(){

	
	// Click Events	=================
	// Start Form
	$$.btnStart.on("click", function(e){
		e.preventDefault();
		var playerName = $$.meNameInput.val().trim();
		write.player(playerName, meKey);
		console.log(playerName);
	});

	// Player Panel click event
	$$.chose.on("click", function(){
		var chose = $(this).attr("data-value").trim();
		write.playerChose(chose, meKey);			
	});

});


var write = {
	player: function(name,key){
		const dbRef = firebase.database().ref('/players').child(key);
		dbRef.set({
		  username: name,
		  chose :'',
		  score :{
		  	win : 0,
		  	lose : 0
		  }
		});
	},
	playerChose(myChose, key){
		console.log(key);
		const dbRef = firebase.database().ref('/players/'+key+'/').child('chose');
		dbRef.set(myChose);
	},

}








