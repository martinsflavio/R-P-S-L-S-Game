// While it may not seem imperative for smaller programs, you should 
// get in the habit of wrapping your js code in either a 

// $(document).ready(function(){
//  // code goes here
// })

// or an IIFE (immediately invoked function expression)
// ;(function(){
//  // code goes here
// })()

// You are already wrapping your click handler code in a $(document).ready block so I'd suggest moving
// the rest of your logic into there as well. Otherwise you're giving users near direct access to your
// database through the console.

// Flavio, I commend you for taking on this extra challenging assignment! You certainly made admirable headway 
// and I think this is right on the cusp of being a fully functional game. I would suggest that in the future
// you put your focus on getting the logic sorted out before you spend time on styling. It's much more impressive
// to have an aesthetically awful and functionally solid app than an aesthetically appealing and functionally broken & brittle one.

// I dig this approach to storing DOM elements 👌
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
	oppCardsContainer : $('#opp-cards-container'),
	oppGameCards : $('.opp-game-card'),
	oppWin : $('#opp-win'),
	oppLose : $('#opp-lose'),
	//chat
	displayChat : $('#display-chat'),
	inputChat : $('#input-chat'),
	btnSend : $('#btn-send'),	
}

//Firebase Ref
const db = firebase.database();

// Functions
var game = {
	// I would only initialize your main firebase db ref once
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
// Instead of initializing players the moment they connect - it might serve you well to only initialize them
// when they actually submit a username. By doing it that way, you can avoid having to set players until they're
// actually ready to play which helps simplify the necessary logic. Otherwise things begin to go very haywire 
// when things out of your control begin to happen (ie more than two users visit your site before anybody has signed in).
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

/* Chat */

db.ref('chat').on('child_added', function(snap){
	var key = snap.key;
	
	db.ref('chat').child(key).once('value', function(snap){
		var chatObj = snap.val();
	
		if(snap.val()){
		
			var textDisplay = $('<p>'+chatObj.name+' : '+chatObj.text+'</p>');

			textDisplay[0].scrollTop = $$.displayChat[0].scrollHeight;

			$$.displayChat.append(textDisplay);
			$$.displayChat.animate({scrollTop: $$.displayChat[0].scrollHeight}, 'slow');
		}		
	});
});

//========= Removing Turn and display player disconnect
db.ref('players').once('child_removed', function(snap){
	db.ref('turn').remove();
	db.ref('chat').remove();
});
//--------------------------------------------------------------


/* Game logic happens herer based on the steps */

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

	// Winner decision logic
	if(turn === 4){
		var winner;
		var winnerTag;
		var whoWins;
		var whoLoses;

		winnerID = game.decideWiner(playersArr);
		
		//increments winner's  and loser's score
		if(winnerID === 1){
			whoWins = 1;
			whoLoses = 2;
		}else if (winnerID === 2){
			whoWins = 2;
			whoLoses = 1;
		}else{
			whoWins = 0;
			whoLoses = 0;
		}
		// if is Tie do nothing
		if(whoLoses !== 0 && whoWins !== 0){
			// win++
			var winRef = db.ref('players/'+whoWins+'/score').child('win');
			winRef.once('value', function(snap){
				var increments = snap.val();
				console.log(snap.val());
				increments++;
				winRef.set(increments);
			});
			
			// lose++
			var loseRef = db.ref('players/'+whoLoses+'/score').child('lose');
			loseRef.once('value', function(snap){
				var increments = snap.val();
				console.log(snap.val());			
				increments++;
				loseRef.set(increments);
			});
		}


		// Display Winners name on the page
		if(winnerID === 0){
			winnerName = "Tie";
			winnerTag = $('<h3> '+winnerName+' </h3>');
		}else{
			winnerName = playersArr[winnerID-1].name;
			winnerTag = $('<h3>Player '+winnerName+' Wins!</h3>');
		}

		
		$$.gameCards.css({'display':'none'});
		$$.oppGameCards.css({'display':'none'});
		$$.table.append(winnerTag);

		// would be nice to have some reset logic so users can play more than one round
	}
});
//----------------------------------------------

//=================== Click Events ===============

$(document).ready(function(){	
	
	// Start Form
	$$.btnStart.on('click', function(e){
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
	$$.gameCards.on('click', function(){
		var chose = $(this).attr("data-value").trim();
		
		game.playerChose(chose, playerID);
		game.counter(turn);
			
		$$.cardsContainer.append('<img class="game-card-off nounderline" data-value="paper" src="./assets/images/'+chose+'.png">');	

	});

	//P2
	$$.oppGameCards.on('click', function(){
		var chose = $(this).attr("data-value").trim();
		
		game.playerChose(chose, playerID);
		game.counter(turn);

		$$.oppCardsContainer.append('<img class="game-card-off nounderline" data-value="paper" src="./assets/images/'+chose+'.png">');

	});

	// You probably should prevent users who aren't logged in from sending chats, or possibly just give them an anonymous username
	//Chat
	$$.btnSend.on('click', function(e){
		e.preventDefault();

		var chat = $$.inputChat.val();
		
		db.ref('chat').push({
			name: playersArr[playerID-1].name,
			text: chat 
		});
		$$.inputChat.val('');

	});
});

//================================================


