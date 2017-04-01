var game = {
	fbGameRoomRef: firebase.database().ref('Game-Room'),
	player: '',
	opponent: ''
}
////////////////// Assigning player /////////////////////


game.fbGameRoomRef.once('value').then( function (gameRoomSnap) {

	if(gameRoomSnap.val()){

		var opponentCheck = true;
		var tablesCount = 0;

		gameRoomSnap.forEach(function (thisTableSnap) {
			tablesCount++;
			// If open table is true then create a player inside this table
			if(thisTableSnap.numChildren() <= 1){

				opponentCheck = false;

				game.tableRef = game.fbGameRoomRef.child(thisTableSnap.key);
				game.playerKey = game.tableRef.push('player').key;
				game.playerRef = game.tableRef.child(game.playerKey);

				game.tableRef.child(game.playerKey).on('value', function (pSnap) {
					if (pSnap.val()){
						game.player = pSnap.val();
					}
				});

				game.playerRef.onDisconnect().remove();
			}


			// If no open table then create a new table with player
			if (opponentCheck && tablesCount === gameRoomSnap.numChildren()){
				game.tableKey = game.fbGameRoomRef.push('table').key;
				game.tableRef = game.fbGameRoomRef.child(game.tableKey);
				game.playerKey = game.tableRef.push('player').key;
				game.playerRef = game.tableRef.child(game.playerKey);

				game.tableRef.child(game.playerKey).on('value', function (pSnap) {
					if (pSnap.val()){
						game.player = pSnap.val();
					}
				});
				game.playerRef.onDisconnect().remove();
			}
		});

	}else {
		game.tableKey = game.fbGameRoomRef.push('table').key;
		game.tableRef = game.fbGameRoomRef.child(game.tableKey);
		game.playerKey = game.tableRef.push('player').key;
		game.playerRef = game.tableRef.child(game.playerKey);

		game.tableRef.child(game.playerKey).on('value', function (pSnap) {
			if (pSnap.val()){
				game.player = pSnap.val();
			}
		});
		game.playerRef.onDisconnect().remove();
	}


}).catch(function(err) {
	console.log('Unable to access Game-Room!', err);
});









function playerInit (name){
	// Initialize player
	this.playerRef.set({
		name: name,
		chose: '',
		score:{
			win: 0,
			lose: 0
		}
	});
}

