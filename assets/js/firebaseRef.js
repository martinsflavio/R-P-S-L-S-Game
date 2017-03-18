




/*//============== Monitoring db/players  ==========

db.players.on('value', function(snap){
	
	// Me
	if(typeof(meKey) === 'string'){	
		db.players.child(meKey).on('value', function(snap){
			var dbMe = snap.val();
		
			//========== DOM =============

			$$.meNameDisplay.text(dbMe.username);
			$$.meWin.text(dbMe.score.win);
			$$.meLose.text(dbMe.score.lose);
			$$.meChose.text(dbMe.chose);
			//----------------------------
		});
	}
	
	// Opponent
	if(typeof(opponentKey) === 'string'){	
		db.players.child(opponentKey).on('value', function(snap){
			var dbOpponent = snap.val();
			
			//========== DOM =============
			$$.opponentNameDisplay.text(dbOpponent.username);
			$$.opponentWin.text(dbOpponent.score.win);
			$$.opponentLose.text(dbOpponent.score.lose);
			$$.opponentChose.text(dbOpponent.chose);
			//----------------------------
		});
	}
});*/