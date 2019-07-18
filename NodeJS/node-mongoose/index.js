const mongoose = require("mongoose")
const Dishes = require("./models/dishes");
const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url);

connect
.then((db)=>{
	console.log("Correctly connected to server");

	Dishes.create({
		name: "Tallarines",
		description: "Tallarines con tuquito y quesito papu :v",
		price: 33
	})
	.then((data)=>{
		console.log("\n\nCreated a new dish intance\n", data);
		return Dishes.find({}).exec();
	})
	.then((dataCollection)=>{
		console.log("\n\nCollection of dishes\n", dataCollection);
		console.log("\n\nCollection will be deleted...\n");
		return Dishes.remove({});
	})
	.then(()=>{
		mongoose.connection.close();
	})
	.catch((err)=>{
		console.error(err)
	});
})
.catch((err)=>{
	console.error(err)
});