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







