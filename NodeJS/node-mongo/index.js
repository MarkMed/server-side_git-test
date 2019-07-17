const mongoClient = require("mongodb").MongoClient;
const assert = require('assert');
const url = "mongodb://localhost:27017/0";
const dbName = "conFusion";
const dbOperations = require("./operation")


mongoClient.connect(url)
.then((client)=>{
	console.log("Successfully connected to server!\n");

	const db = client.db(dbName);
	const collection = "teachers"

	dbOperations.insertDocument(db, {"name": "Shaggy", "lastName": "Cosmico"}, collection)
	.then((result)=>{

		console.log("\nInserted Document:\n", result.ops);
		return dbOperations.findDocuments(db, collection)
	})
	.then((data)=>{

		console.log("\nDocuments found:\n", data);
		return dbOperations.updateDocument(db, {"name": "Ricardito"}, {"lastName": "Milos"}, collection)
	})
	.then((result)=>{

		console.log("\nDocument Updated:\n", result.result);
		return dbOperations.findDocuments(db, collection)
	})
	.then((data)=>{

		console.log("\nDocuments found:\n", data);
		return dbOperations.insertDocument(db, {"name": "TestName", "lastName": "TestLastName"}, collection)
	})
	.then( (result)=>{
				
		console.log("\nInserted Document:\n", result.ops);						
		return dbOperations.removeDocument(db, {"name": "Shaggy"}, collection)
	})
	.then( (result)=>{

		console.log("\nDeleted Document:\n", result.result);
		return db.dropCollection("teachers")
	})
	.then((result)=>{
	
		console.log("\nCollection Dropped:\n", result)
		return client.close();				
	})
	// dbOperations.findDocuments(db, collection)
	// .then((data)=>{

	// 	console.log("\nDocuments found:\n", data);
	// 	console.log("\nUpdating docs:\n", data);
	// 	return dbOperations.updateDocument(db, {"name": "Ricardito"}, {"name": "Ricarditos", "lastName": "Milos"}, collection)

	// })
	// .then((result)=>{

	//  	console.log("\nDocument Updated:\n", result.result);

	// 	return db.dropCollection("teachers")
	// })
	// .then((result)=>{
	
	// 	console.log("\nCollection Dropped:\n", result)
	// 	return client.close();				
	// })
	.catch((err)=>{console.log(err)});
})
.catch((err)=>{console.log(err)});
