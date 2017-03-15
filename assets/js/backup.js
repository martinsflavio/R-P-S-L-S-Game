


	var test;

	//===============================
	var connectedRef = db.ref(".info/connected");
	var test = db.ref("players");
	
	// When the client's connection state changes...
	connectedRef.on("value", function(snap) {
		test = snap;
	  // If they are connected..
	  //if (snap.val()) {

	    // Add user to the connections list.
	    //var con = connectionsRef.push(true);

	    // Remove user from the connection list when they disconnect.
	    //con.onDisconnect().remove();
	  //}
	  //console.log(snap + "  ./info/connected after if() ");
	});




	//-------------------------- insert player in data base
	function write(id, name, rps) {
	  db.ref('players/' + id).set({
	    id: id,
	    username: name,
	    chose: rps,
	  });
	}
	//-------------------------- return what the opponent chosed
	function read(player){
		var result = "";
		var opponent = db.ref('players/' + player + '/chose');
		opponent.on('value', function(snapshot) {
		  result = snapshot.val();
		});
		return result;
	}
	//--------------------------
	function playerPosition(){

		var connectedRef = db.ref(".info/connected");

		// When the client's connection state changes...
		connectedRef.on("value", function(snap) {
			console.log(snap + "  ./info/connected");
		  // If they are connected..
		  if (snap.val()) {

		    // Add user to the connections list.
		    var con = connectionsRef.push(true);

		    // Remove user from the connection list when they disconnect.
		    con.onDisconnect().remove();
		  }
		  console.log(snap + "  ./info/connected after if() ");
		});

		// When first loaded or when the connections list changes...
		connectionsRef.on("value", function(snap) {

		  // Display the viewer count in the html.
		  // The number of online users is the number of children in the connections list.
		  //$("#watchers").html(snap.numChildren());
		});
	}





