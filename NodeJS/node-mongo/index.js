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

		console.log(`Inserted Document:\n ${result.ops}\n`);
		return dbOperations.findDocuments(db, collection)
	})
	.then((docs)=>{

		console.log(`Documents found:\n ${docs}\n`);
		return dbOperations.updateDocument(db, {"name": "Ricardito"}, {"lastName": "Milos"}, collection)
	})
	.then((result)=>{

		console.log(`Document Updated!\nNew version: ${result.result}\n`);
		return dbOperations.findDocuments(db, collection)
	})
	.then((docs)=>{

		console.log(`Documents found:\n ${docs}\n`);
		return dbOperations.insertDocument(db, {"name": "TestName", "lastName": "TestLastName"}, collection)
	})
	.then( (result)=>{
				
		console.log(`Inserted Document:\n ${result.ops}\n`);						
		return dbOperations.removeDocument(db, {"name": "Shaggy"}, collection)
	})
	.then( (result)=>{

		console.log(`Deleted Document:\n ${result.ops}\n`)
		return db.dropCollection("teachers")
	})
	.then((result)=>{
	
		console.log(`Collection drop:\n ${result.ops}\n`)
		return client.close();				
	})
	.catch((err)=>{console.log(err)});
})
.catch((err)=>{console.log(err)});
