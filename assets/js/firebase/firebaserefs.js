///////////////// Instantiating FB Obj //////////////////

var fb = new FirebaseInt();

////////////////// Assigning player /////////////////////
fb.gameRoomRef.once('value').then( function (gameRoomSnap) {

	if(gameRoomSnap.val()){
		//-------------------------------------------------------------
		var opponentFound = false;
		// loop tru the tables looking for opponent
		gameRoomSnap.forEach(function (thisTableSnap) {
			if(thisTableSnap.numChildren() <= 1){
				fb.playerAdd(fb.tableAdd(true,thisTableSnap.key));                     //
				opponentFound = true;                                                  // Find a way to pass this logic to a prototype function
			}                                                                        //
		});
		// if there's no opponent then create a new table
		if(!opponentFound){
			fb.playerAdd(fb.tableAdd(false));
		}
		//-------------------------------------------------------------
	}else {
		fb.playerAdd(fb.tableAdd(false));
	}

}).catch(function(err) {
	console.log('Unable to access Game-Room!', err);
});

///////////////////////// End ///////////////////////////




////////////////// FB Obj Constructor ///////////////////
function FirebaseInt() {
	this.db = firebase.database();
	this.gameRoomRef = firebase.database().ref('Game-Room');

	this.tableKey;
	this.tableRef;
	this.playerKey;
	this.playerRef;
	this.opponentRef = '';
	this.opponentKey = 'Waiting';
}


/////////////////// Prototypes /////////////////////////

FirebaseInt.prototype.tableAdd = function (exists, tableKey) {
	if(exists){
		this.tableKey = tableKey;
		this.tableRef = this.db.ref('Game-Room/'+tableKey);
		return tableKey;
	}else {
		this.tableKey = this.gameRoomRef.push('table').key;
		this.tableRef = this.db.ref('Game-Room/'+this.tableKey);
		return this.tableKey;
	}
};

//--------------------------------------

FirebaseInt.prototype.playerAdd = function (tableKey) {
	// Store playerKey
	this.playerKey = this.gameRoomRef.child(tableKey).push('player').key;
	// Return playerRef
	this.playerRef = this.db.ref('Game-Room/'+tableKey+'/'+this.playerKey);
	this.playerRef.onDisconnect().remove();
};

//--------------------------------------

FirebaseInt.prototype.playerInit = function(name){
	// Initialize player
	this.playerRef.set({
		name: name,
		chose: '',
		score:{
			win: 0,
			lose: 0
		}
	});
};

//--------------------------------------

FirebaseInt.prototype.listenToTable = function (tRef) {
	tRef.on('value', function (snap) {
		console.log(snap.val());
	});
};

//--------------------------------------

