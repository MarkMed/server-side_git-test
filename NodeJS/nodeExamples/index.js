var circleModule = require('./circle');

function calcCircle(radio){
	console.log("");
	console.log(">>> Calculating circle area and longitude with radio = " + radio+" ...");

	function circleCallback(err, circle){
		if(err){
			console.log("<<< Error: "+err.message);
		}
		else {
			console.log("<<< Result: The circle with radio "+radio+" has an area of "+ circle.a() +" and its longitude is "+circle.l());
		}
	}
	circleModule.circleLogic(radio, circleCallback);
	
	console.log(">>> Module called, the values has been returned?");
	console.log("");
}

calcCircle(3);
calcCircle(0);
calcCircle(-2);
circleModule.otherWea("texto");