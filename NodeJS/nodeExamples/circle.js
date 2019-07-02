const circleLogic = (r, callback) => {
			
	if(r>=0){
		setTimeout(() => 
			callback(null, {
				l: () => ((Math.PI * r)*2),
				a: () => (Math.PI * r*r)
			})
		, 1000);
	}
	else{
		setTimeout(() => 
			callback(new Error("Invalid value of radio: "+r), null)
		, 1000);
	}
}

const otherWea = (param)=> console.log("Quiero que se imprima lo que se pasó: "+param);

module.exports ={
	circleLogic: circleLogic, 
	otherWea: otherWea
};