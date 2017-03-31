///////////////// Instantiating FB Obj //////////////////
var fb = new FirebaseInt();



////////////////// Assigning player /////////////////////
fb.gameRoomRef.once('value').then( function (gameRoomSnap) {

	if(gameRoomSnap.val()){
		//-------------------------------------------------------------
		var opponentFound = false;
		// loop tru the tables looking for opponent
		gameRoomSnap.forEach(function (thisTableSnap) {
			if(thisTableSnap.numChildren() < 2){
				fb.discDetection(fb.playerAdd(fb.tableAdd(true,thisTableSnap.key)));   //
				opponentFound = true;                                                  // Find a way to pass this logic to a prototype function
			}                                                                        //
		});
		// if there's no opponent then create a new table
		if(!opponentFound){
			fb.discDetection(fb.playerAdd(fb.tableAdd(false)));
		}
		//-------------------------------------------------------------
	}else {
		fb.discDetection(fb.playerAdd(fb.tableAdd(false)));
	}

});

///////////////////////// End ///////////////////////////


firebase.database().ref('Game-Room').on('value', function (gameRoomSnap) {
	console.log(gameRoomSnap.val());

	if(gameRoomSnap.val()){
		if(typeof fb.playerRef !== undefined){
			console.log('ok');
			console.log(fb.playerRef);
		}
	}
});






















////////////////// FB Obj Constructor ///////////////////
function FirebaseInt() {
	this.db = firebase.database();
	this.gameRoomRef = firebase.database().ref('Game-Room');

	this.tableKey;
	this.tableRef;
	this.playerKey;
	this.playerRef;
	this.opponentKey;

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
	return this.playerRef;
};

//--------------------------------------

FirebaseInt.prototype.discDetection = function (playerRef) {
	playerRef.onDisconnect().remove();
};

//--------------------------------------
// not saving opponent key o local variable
/*FirebaseInt.prototype.opponentDetect = function (tKey, pKey) {
	this.gameRoomRef.child(tKey).once('value').then(function (tableSnap) {
		tableSnap.forEach(function (playerSnap) {
			if(playerSnap.key !== pKey){
				console.log(playerSnap.key);
				this.opponentKey = playerSnap.key;
			}
		})
	});
};*/

//--------------------------------------

FirebaseInt.prototype.playerInit = function(name){
	this.playerRef.set({
		name: name,
		chose: '',
		score:{
			win: 0,
			lose: 0
		}
	});
};



