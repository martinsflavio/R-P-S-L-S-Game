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

FirebaseInt.prototype.tableAdd = function (tKey) {
	var tableKey;
	var tableRef;
	if(tKey){
		tableKey = tKey;
		tableRef = this.db.ref('Game-Room/'+tKey);
	}else {
		tableKey = this.gameRoomRef.push('table').key;
		tableRef = this.db.ref('Game-Room/'+tableKey);
	}
	this.tableRef = tableRef;
	this.tableKey = tableKey;
	return tableKey;
};

//--------------------------------------

FirebaseInt.prototype.playerAdd = function (tableKey) {
	// Store playerKey and create playerRef
	this.playerKey = this.gameRoomRef.child(tableKey).push('ok').key;
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

FirebaseInt.prototype.dataSync = function ($) {

	// Table Listener
	this.tableRef.on('child_added', function (playerSnap) {
		console.log('table on');
		console.log(playerSnap.key);
		if(playerSnap.key !== 'Counter'){
			this.getOpponentKey(playerSnap.key);
		}
	}.bind(this));

	// Player listener
	this.playerRef.on('value', function (snap) {
		console.log('player on');
		if(snap.hasChildren()){
			var obj = snap.val();

			$.nameDisplay.text(obj.name);
			$.lose.text(obj.score.lose);
			$.win.text(obj.score.win);
		}
	}.bind(this));

	// Opponent Listener
	this.opponentRef.on('value', function (snap) {
		console.log('opponent on');
		if(snap.hasChildren()){
			var obj = snap.val();

			$.oppNameDisplay.text(obj.name);
			$.oppLose.text(obj.score.lose);
			$.oppWin.text(obj.score.win);
		}
	}.bind(this));

	// Counter Listener
	this.counterRef.on('value', function (turnSnap) {
		console.log('Counter on');
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

FirebaseInt.prototype.getOpponentKey = function (pKey) {
	if( pKey !== this.playerKey && pKey !== 'Counter'){
		this.opponentKey = pKey;
		this.opponentRef = this.tableRef.child(pKey);
	}
};

//--------------------------------------

FirebaseInt.prototype.turnInit = function (tKey) {
	var tRef = this.db.ref('Game-Room/'+tKey);
	this.counterRef = tRef.child('Counter');
	this.counterRef.set({turn:0});
	this.counterRef.onDisconnect().remove();
};

//--------------------------------------


