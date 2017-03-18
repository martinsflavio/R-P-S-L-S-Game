//Get DOM Elements
const $$ = {
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
	oppContainer : $('#opp-cards-container'),
	oppGameCards : $('.opp-game-card'),
	oppWin : $('#opp-win'),
	oppLose : $('#opp-lose'),
	//chat
	textChat : $('#text-chat'),
	btnSend : $('#btn-send'),	
}
//Firebase Ref
const db = firebase.database();

// Functions
var game = {
	db: firebase.database(),
	player: function(name, key){
		this.db.ref('players/'+key).child('name').set(name);
		this.db.ref('players/'+key).child('active').set(true);
	},
	playerChose(myChose, key){
		this.db.ref('players/'+key).child('chose').set(myChose);
	},
	counter: function(turn){
		if(turn < 4){
			turn++;
			
		}else{
			turn = 0;
		}
		this.db.ref('turn').set(turn);
	},
	decideWiner: function(arr){
		var p1 = arr[0].chose;
		var p2 = arr[1].chose;

		
		if(p1 === p2){
			result = 0;
		}else if(p1 === 'rock'){
			if(p2 === 'paper'){result = 2;} 
			if(p2 === 'scissors'){result = 1;}
			if(p2 === 'lizard'){result = 1;}
			if(p2 === 'spock'){result = 2;}
		
		}else if(p1 === 'paper'){
			if(p2 === 'scissors'){result = 2;}
			if(p2 === 'rock'){result = 1;}
			if(p2 === 'lizard'){result = 2;}
			if(p2 === 'spock'){result = 1;}
		
		}else if(p1 === 'scissors'){
			if(p2 === 'paper'){result = 1;}
			if(p2 === 'rock'){result = 2;}
			if(p2 === 'lizard'){result = 1;}
			if(p2 === 'spock'){result = 2;}
		
		}else if(p1 === 'lizard'){
			if(p2 === 'paper'){result = 1;}
			if(p2 === 'rock'){result = 2;}
			if(p2 === 'scissors'){result = 2;}
			if(p2 === 'spock'){result = 1;}
		
		}else if(p1 === 'spock'){
			if(p2 === 'paper'){result = 2;}
			if(p2 === 'rock'){result = 1;}
			if(p2 === 'scissors'){result = 1;}
			if(p2 === 'lizard'){result = 2;}
		
		}
		return result;
	}
}

var playersArr = [];
var turn = 1;
var playerID;
var winnerID;
//Initialize players
db.ref('.info/connected').on('value', function(snap){
	
	if(snap.val()){
		const playersRef = db.ref('players');
		
		playersRef.once('value').then(function(playersSnap){ 
			
			if(playersSnap.hasChildren() && playersSnap.numChildren() < 2){
				
				if(playersSnap.hasChild('1')){
					playerID = 2;
				}
				if(playersSnap.hasChild('2')){
					playerID = 1;	
				}

			}else if(playersSnap.numChildren() < 2){
				playerID = 1;
			}

			const player = db.ref('players').child(playerID);
			player.set({
				active: false,
				name:'Waiting for player '+playerID,
				chose: 'none',
				score: {
					win: 0,
					lose: 0
				}
		});
			player.onDisconnect().remove();		
		});	
	}  
});
//--------------------

/* Turn */
//Save
db.ref('turn').on('value', function(turnSnap){
	turn = turnSnap.val();
	
	if(turn === 2){
		if(playerID === 1){
			$$.gameCards.css({'display':'inline'});	
		}		
	}

	if(turn === 3){
		if(playerID === 2){
			$$.oppGameCards.css({'display':'inline'});	
			$$.gameCards.css({'display':'none'});	
		}else{
			$$.gameCards.css({'display':'none'});	
		}
	}

	if(turn === 4){
		var winner;
		var winnerTag;
		var winResult;
		var loserResult;

		winnerID = game.decideWiner(playersArr);
		
		//increments winner's  and loser's score
		if(winnerID === 1){
			winResult = 1;
			loserResult = 2;
		}else{
			winResult = 2;
			loserResult = 1;
		}
		// win++
		var winRef = db.ref('players/'+winResult+'/score').child('win');
		winRef.once('value', function(snap){
			var increments = snap.val();
			console.log(snap.val());
			increments++;
			winRef.set(increments);
		});
		
		// lose++
		var loseRef = db.ref('players/'+loserResult+'/score').child('lose');
		loseRef.once('value', function(snap){
			var increments = snap.val();
			console.log(snap.val());			
			increments++;
			loseRef.set(increments);
		});

		// Display Winners name on the page
		if(winnerID === 0){
			winnerName = "Tie";
		}else{
			winnerName = playersArr[winnerID-1].name;
		}

		winnerTag = $('<h3>Player '+winnerName+' Wins!</h3>');
		$$.gameCards.css({'display':'none'});
		$$.oppGameCards.css({'display':'none'});
		$$.table.append(winnerTag);
	}
});

//Remove
db.ref('players').on('child_removed', function(snap){
	db.ref('turn').remove();
});
//--------------------



/* Connect with DataBase */
//P1
db.ref('players').child('1').on('value', function(snap){
	var obj = snap.val();
	
	if(snap.val()){
		$$.nameDisplay.text(obj.name);
		$$.win.text(obj.score.win);
		$$.lose.text(obj.score.lose);		
	}
	playersArr[0] = obj;
});

//P2
db.ref('players').child('2').on('value', function(snap){
	var obj = snap.val();

	if(snap.val()){
		$$.oppNameDisplay.text(obj.name);
		$$.oppWin.text(obj.score.win);
		$$.oppLose.text(obj.score.lose);
	}
	playersArr[1] = obj;
});
//---------------------



//=================== Click Events ===============

$(document).ready(function(){	
	
	// Start Form
	$$.btnStart.on("click", function(e){
		e.preventDefault();
		var playerName = $$.nameInput.val().trim();
		
		if(playerName !== ""){
			game.player(playerName, playerID);
			game.counter(turn);

			$$.formStart.css({'display':'none'});
		}
		
	});

	// Cards on Click

	// P1
	$$.gameCards.on("click", function(){
		var chose = $(this).attr("data-value").trim();
		console.log(chose);
		game.playerChose(chose, playerID);
		game.counter(turn);
	});

	//P2
	$$.oppGameCards.on("click", function(){
		var chose = $(this).attr("data-value").trim();
		
		console.log(chose);
		game.playerChose(chose, playerID);
		game.counter(turn);
	});

});











