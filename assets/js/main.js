function rps(p1, p2){
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
	p1 : $('#p1-name'),
	p1Chose : $('.p1'),
	p1Current : $('#p1-current'),
	p1Win : $('#p1-win'),
	p1Lose : $('#p1-lose'),
	// Player 2
	p2 : $('#p2-name'),
	p2Chose : $('.p2'),
	p2Current : $('#p2-current'),
	p2Win : $('#p2-win'),
	p2Lose : $('#p2-lose'),
	// DOM
	btnStart : $('#btn-start'),
}
//Create references
const db = {
	root : firebase.database(),
	players : firebase.database().ref('players'),
	p1 : firebase.database().ref('players/1'),
	p2 : firebase.database().ref('players/2'),
}
// starting the game
/*db.root.ref().child('.info/connected').on('value', snap =>{
	console.log(snap.val());
	if(snap.val() === true){
		addPlayer("1");
	}else{
		addPlayer("2");
	}
});*/

// Sync Players with the DataBase
db.p1.on('value', snap => {
	var obj = snap.val();
	$$.p1.text(obj.name);
	$$.p1Chose.text(obj.chose);
	$$.p1Current.text(obj.chose);
	$$.p1Win.text(obj.score.win);
	$$.p1Lose.text(obj.score.lose);
});
db.p2.on('value', snap => {
	var obj = snap.val();
	$$.p2.text(obj.name);
	$$.p2Chose.text(obj.chose);
	$$.p2Current.text(obj.chose);
	$$.p2Win.text(obj.score.win);
	$$.p2Lose.text(obj.score.lose);
});


$(document).ready(function(){
	// Click Events	=================
	// Start Form
	$$.btnStart.on("click", function(e){
		e.preventDefault();

		var player = $("#player-name").val().trim();
		console.log(player);
	});
	// P1 Panel click event
	$$.p1Chose.on("click", function(){
		var chose = $(this).attr("data-value").trim();
		db.p1.child('chose').set(chose);		
		
	});
	// P2 Panel click event
	$$.p2Chose.on("click", function(){
		var chose = $(this).attr("data-value").trim();
		db.p2.child('chose').set(chose);		
	
	});
});




















function play(player){
	const dbPlayer = firebase.database().ref('players/'+player);
	dbPlayer.on('value', snap => {
	});
}






function addPlayer(player){
	const bdPlayer = firebase.database().ref('players').child(player).set({
		name: "player "+player,
		chose: "none",
		on: false,
		score: {
			win:0,
			lose:0
		}
	});
}




















