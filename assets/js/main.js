function rps(p1, p2){
	p1 = p1.toLowerCase();
	p2 = p2.toLowerCase();
	
	console.log("p1: "+p1);
	console.log("p2 : "+p2);	

	console.log("======================");
	if(p1 === p2){
		console.log("tie");
	}else if(p1 === "rock"){
		if(p2 === "paper"){console.log("p2 win");}
		if(p2 === "scissors"){console.log("p1 win");}
		if(p2 === "lizard"){console.log("p1 win");}
		if(p2 === "spock"){console.log("p2 win");}
	}else if(p1 === "paper"){
		if(p2 === "scissors"){console.log("p2 win");}
		if(p2 === "rock"){console.log("p1 win");}
		if(p2 === "lizard"){console.log("p2 win");}
		if(p2 === "spock"){console.log("p1 win");}
	}else if(p1 === "scissors"){
		if(p2 === "paper"){console.log("p1 win");}
		if(p2 === "rock"){console.log("p2 win");}
		if(p2 === "lizard"){console.log("p1 win");}
		if(p2 === "spock"){console.log("p2 win");}
	}else if(p1 === "lizard"){
		if(p2 === "paper"){console.log("p1 win");}
		if(p2 === "rock"){console.log("p2 win");}
		if(p2 === "scissors"){console.log("p2 win");}
		if(p2 === "spock"){console.log("p1 win");}
	}else if(p1 === "spock"){
		if(p2 === "paper"){console.log("p2 win");}
		if(p2 === "rock"){console.log("p1 win");}
		if(p2 === "scissors"){console.log("p1 win");}
		if(p2 === "lizard"){console.log("p2 win");}
	}else{
		console.log("input Invalid");
	}
}

// firebase 
var db = firebase.database();

$(document).ready(function(){
	//assign faribase to variable
	var db = firebase.database();

	//variables 
	var player;


	// Click Events	=================
	// Start Form
	$("#player-submit").on("click", function(){
		player = $("#player-name").val().trim();
		console.log(player);
		
		write("p1",player,"none");
	});
	// P1 Panel click event
	$(".p1").on("click", function(){
		var chose = $(this).attr("data-value").trim();
		console.log("p1",player,chose);
			
	});
	// P2 Panel click event
	$(".p2").on("click", function(){
		var chose = $(this).attr("data-value").trim();
		console.log(chose);	
		
	});

});




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



















