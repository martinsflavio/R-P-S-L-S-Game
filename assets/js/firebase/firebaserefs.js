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
	// Get opponent Key
	this.getOpponentKey(tableKey, this.playerKey);
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
	// Invoking my promise my Promise
	this.dataSync(this.tableKey,this.playerKey,this.opponentKey);
	/////////////////////////////////
};

//--------------------------------------

FirebaseInt.prototype.getOpponentKey = function (tKey, pKey) {

	this.gameRoomRef.child(tKey).on('child_added', function (playerSnap) {
		if( playerSnap.key !== pKey && playerSnap.key !== 'Counter'){
			this.opponentKey = playerSnap.key;
			this.opponentRef = this.tableRef.child(playerSnap.key);
		}
	}.bind(this));
};

//--------------------------------------

FirebaseInt.prototype.turnInit = function (tKey) {
	var tRef = this.db.ref('Game-Room/'+tKey);
	this.counterRef = tRef.child('Counter');
	this.counterRef.set({turn:0});
	this.counterRef.onDisconnect().remove();
};

//--------------------------------------

FirebaseInt.prototype.dataSync = function (playerKey,opponentKey) {
	var p1 = new Promise(function (resolve, reject) {
		if (playerKey) {
			resolve(playerKey);
		}
	});
	p1.then(function (values) {
		this.dataDisplay('player');
	}.bind(this)).catch(function (reason) {
		console.log(reason);
	});


	var p2 = new Promise(function (resolve, reject) {
		if (opponentKey) {
			resolve(opponentKey);
		}
	});
	p2.then(function (values) {
		this.dataDisplay('opp');
	}.bind(this)).catch(function (reason) {
		console.log(reason);
	});
};

//--------------------------------------

FirebaseInt.prototype.dataDisplay = function (position) {
	var $ = this.jq;

	if(position === 'player'){
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
	}
	if(position === 'opp'){
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
	}



/*	// Counter Listener
	this.counterRef.on('value', function (turnSnap) {
		console.log('Counter on');
	}.bind(this));*/
};

//--------------------------------------
FirebaseInt.prototype.connected = function () {
	this.gameRoomRef.on('child_changed', function (roomSnap) {
		if(roomSnap.val()){
			console.log('Room on "Value" Fired');
			this.dataSync(this.playerRef,this.opponentRef);
		}
	}.bind(this));
};
