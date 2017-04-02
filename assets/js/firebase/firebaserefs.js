////////////////// FB Obj Constructor ///////////////////
function FirebaseInt(jqueryObj) {
	this.jq = jqueryObj;
	this.db = firebase.database();
	this.gameRoomRef = firebase.database().ref('Game-Room');

	this.tableKey;
	this.tableRef;
	this.playerKey;
	this.playerRef;
	this.tableObj;
	this.opponentKey;
	this.opponentRef;
	this.playerAssign();
}

/////////////////// Prototypes /////////////////////////

FirebaseInt.prototype.tableAdd = function (tableKey) {
	if(tableKey){
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
	// Store playerKey and create playerRef
	this.playerKey = this.gameRoomRef.child(tableKey).push('player').key;
	this.playerRef = this.db.ref('Game-Room/'+tableKey+'/'+this.playerKey);
	this.playerRef.onDisconnect().remove();
};

//--------------------------------------

FirebaseInt.prototype.playerStart = function(name){
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

FirebaseInt.prototype.pageUptade = function (tRef) {

	tRef.on('value', function (tableSnap) {
		if (tableSnap.val()){
			this.tableObj = tableSnap.val();          // (TODO) remove later
			this.getOppentKey(tableSnap, this.playerKey);

			this.displayData(this.playerRef, this.opponentRef, this.jq);

		}
	}.bind(this));
};

//--------------------------------------

FirebaseInt.prototype.playerAssign = function () {

	this.gameRoomRef.once('value', function(roomSnap) {
		var openTableCheck = true;

		if (roomSnap.val()){

			// look for open table to add a player
			roomSnap.forEach(function (thisTableSnap) {
				if(thisTableSnap.numChildren() <= 1){
					this.playerAdd(this.tableAdd(thisTableSnap.key));
					openTableCheck = false;
					return;
				}
			}.bind(this));

			// if there's no open tables create one with player
			if (openTableCheck){
				this.playerAdd(this.tableAdd(false));
			}

		}else{

			this.playerAdd(this.tableAdd(false));

		}

	}.bind(this));

};

//--------------------------------------

FirebaseInt.prototype.getOppentKey = function (tSnap, pKey) {

	tSnap.forEach(function (thisTableSnap) {
		if (thisTableSnap.key !== pKey){
			this.opponentKey = thisTableSnap.key;
			this.opponentRef = this.tableRef.child(this.opponentKey);
		}
	}.bind(this));
}

//--------------------------------------

FirebaseInt.prototype.displayData = function (pRef, oRef, $) {

	//Player Listener Event
	pRef.on('value', function (pSnap) {
		var pObj = pSnap.val();
		if (pObj){
			$.nameDisplay.text(pObj.name);
			$.lose.text(pObj.score.lose);
			$.win.text(pObj.score.win);
		}
	}.bind(this));

	//Opponent Listener Event
	oRef.on('value', function (oSnap) {
		var oObj = oSnap.val();
		if (oObj){
			$.oppNameDisplay.text(oObj.name);
			$.oppLose.text(oObj.score.lose);
			$.oppWin.text(oObj.score.win);
		}
	}.bind(this));

};
