var circle = require('./circle');

function calcCircle(radio){
	console.log("");
	console.log("Calculating circle area and longitude with radio = " + radio);
	if(radio>=0){
		console.log(">>> The circle with radio of "+radio+" has "+circle.l(radio)+" of longitude and "+circle.a(radio)+" of area.")
	}
	else{
		console.log("Invalid value of radio: "+radio)
	}
}

calcCircle(3);
calcCircle(0);
calcCircle(-2);