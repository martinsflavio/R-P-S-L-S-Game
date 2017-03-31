///////////////// Instantiating FB Obj //////////////////
var fb = new FirebaseInt();



////////////////// Assigning player /////////////////////
fb.gameRoomRef.once('value').then( function (roomSnap) {

	if(roomSnap.val()){

		var opponentFound = false;

		// loop tru the tables looking for opponent
		roomSnap.forEach(function (thisTableSnap) {

			if(thisTableSnap.numChildren() < 2){
				fb.discDetection(fb.playerAdd(thisTableSnap.key));
				opponentFound = true;
			}

		});

		// if there's no opponent then create a new table
		if(!opponentFound){
			fb.discDetection(fb.playerAdd(fb.tableAdd()));
		}
	}else {
		fb.discDetection(fb.playerAdd(fb.tableAdd()));
	}

});



////////////////// FB Obj Constructor ///////////////////
function FirebaseInt() {
	this.db = firebase.database();
	this.gameRoomRef = firebase.database().ref('Game-Room');

	this.tableKey;
	this.playerKey;
	this.playerRef;
	// Opponent //
	this.opponentKey;

}



/////////////////// Prototypes /////////////////////////
FirebaseInt.prototype.tableAdd = function () {
	this.tableKey = this.gameRoomRef.push('table').key;
	return this.tableKey;
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

FirebaseInt.prototype.playerAssign = function (rSnap) {
	console.log(tSnap);
}

//--------------------------------------


///////////////////////// End ///////////////////////////