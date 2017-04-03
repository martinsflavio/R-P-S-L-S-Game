////////////////// FB Obj Constructor ///////////////////
function FirebaseInt(jqueryObj) {
	this.jq = jqueryObj;
	this.db = firebase.database();
	this.gameRoomRef = firebase.database().ref('Game-Room');

	this.tableKey;
	this.tableRef;
	this.playerKey;
	this.playerRef;
	this.opponentKey;
	this.opponentRef;
	this.counterRef;
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
	this.playerKey = this.gameRoomRef.child(tableKey).push('ok').key;
	this.playerRef = this.db.ref('Game-Room/'+tableKey+'/'+this.playerKey);
	this.playerRef.onDisconnect().remove();
	this.getOppentKey();
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

FirebaseInt.prototype.dataSync = function () {
	this.tableRef.on('value', function (tableSnap) {
		if(tableSnap.val()){

			this.displayData(tableSnap.val(), this.jq);

		}
	}.bind(this));

	this.counterRef.on('value', function (turnSnap) {
		console.log(turnSnap.val());
	}.bind(this));
};

//--------------------------------------

FirebaseInt.prototype.playerAssign = function () {

	this.gameRoomRef.once('value', function(roomSnap) {
		var openTableCheck = true;

		if (roomSnap.val()){

			// look for open table to add a player
			roomSnap.forEach(function (thisTableSnap) {
				if(thisTableSnap.numChildren() <= 2 && openTableCheck){
					this.turnInit(thisTableSnap.key);
					this.playerAdd(this.tableAdd(thisTableSnap.key));
					openTableCheck = false;
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

FirebaseInt.prototype.getOppentKey = function () {
	this.tableRef.on('child_added', function (tSnap) {
		if(tSnap.val() === 'player' && tSnap.key !== this.playerKey){
			this.opponentKey = tSnap.key;
			this.opponentRef = this.gameRoomRef.child(tSnap.key);

		}
	}.bind(this));
};

//--------------------------------------

FirebaseInt.prototype.displayData = function (obj, $) {

	console.log(obj);

/*	$.nameDisplay.text(obj.name);
	$.lose.text(obj.score.lose);
	$.win.text(obj.score.win);

	$.oppNameDisplay.text(obj.name);
	$.oppLose.text(obj.score.lose);
	$.oppWin.text(obj.score.win);*/

};

//--------------------------------------

FirebaseInt.prototype.turnInit = function (tKey) {
	var tRef = this.db.ref('Game-Room/'+tKey);
	this.counterRef = tRef.child('Counter');
	this.counterRef.set({turn:0});

	tRef.on('child_removed', function (snap) {
		if(snap.val()){
			console.log(snap.key+' was removed');
			tRef.child('Counter').remove();
		}
	});
};

//--------------------------------------


