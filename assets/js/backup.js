







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






