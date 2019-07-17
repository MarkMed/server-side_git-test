const mongoClient = require("mongodb").MongoClient;
const assert = require('assert');
const url = "mongodb://localhost:27017/0";
const dbName = "conFusion";
const dbOperations = require("./operation")


mongoClient.connect(url, (error, client)=>{
	
	assert.equal(error, null);
	console.log("Successfully connected to server!\n");

	const db = client.db(dbName);
	const collection = "teachers"
	dbOperations.insertDocument(db, {"name": "Shaggy", "lastName": "Cosmico"}, collection, (result)=>{

		console.log(`Inserted Document:\n ${result}\n`);

		dbOperations.findDocuments(db, collection, (docs)=>{

			console.log(`Documents found:\n ${result.ops}\n`);

			dbOperations.updateDocument(db, {"name": "Ricarditos"}, {"lastName": "Milos"}, collection, (result)=>{

				console.log(`Document Updated!\nNew version: ${result.result}\n`);

				dbOperations.findDocuments(db, collection, (docs)=>{
					
					console.log(`Documents found:\n ${result.ops}\n`);
					dbOperations.insertDocument(db, {"name": "TestName", "lastName": "TestLastName"}, collection, (result)=>{
				
						console.log(`Inserted Document:\n ${result.ops}\n`);
						
						dbOperations.removeDocument(db, {"name": "Shaggy"}, collection, (result)=>{
							console.log(`Deleted Document:\n ${result.ops}\n`)
						});
						// NO drop collection. I do not want lose my memory :´v
						client.close();
					});
				});
			});
		});
	});
});
