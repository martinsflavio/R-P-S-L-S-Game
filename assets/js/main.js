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
	//Player 1
	playerName : $('#player-name'),
	chose : $('.chose'),
	p1Current : $('#p1-current-chose'),
	p2Current : $('#p2-current-chose'),
	p1Win : $('#p1-win'),
	p1Lose : $('#p1-lose'),
	// DOM
	btnStart : $('#btn-start'),
}
//Create references
const db = {
	root : firebase.database(),
	players : firebase.database().ref('/players'),
	p1 : firebase.database().ref('/players/1'),
	p2 : firebase.database().ref('/players/2'),
	connected : firebase.database().ref('.info/connected'),
}

//============= Connecting =======================
//Take the .push() key and store in local variables
// all players key
var opponent;
// this player index who point to players array
var me; 
db.root.ref('.info/connected').on('value', snap => {
	
  if (snap.val()) {
  	// Look for Player Key
  	const status = db.root.ref('/players').push('on');
  	db.root.ref('/players').once('value', function(snap){
  		snap.forEach(function(childsnap){
  			me = childsnap.key;

  			// Look for Opponent Key
  			db.players.on('value', function(snap){	
  				var temp = Object.keys(snap.val());
  				for(var i = 0; i<temp.length; i++){
  					if(me === temp[i]){
  						
  					}else{
  						opponent = temp[i];
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
//==================== Local copy of DB ==========


//================================================






$(document).ready(function(){

	
	// Click Events	=================
	// Start Form
	$$.btnStart.on("click", function(e){
		e.preventDefault();
		var player = $$.playerName.val().trim();
		write.player(player, me);
		console.log(player);
	});

	// P1 Panel click event
	$$.chose.on("click", function(){
		var chose = $(this).attr("data-value").trim();
		write.playerChose(chose, me);			
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








