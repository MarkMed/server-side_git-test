const mongoClient = require("mongodb").MongoClient;
const assert = require('assert');
const url = "mongodb://localhost:27017/0";
const dbName = "conFusion";


mongoClient.connect(url, (error, client)=>{
	
	assert.equal(error, null);
	console.log("Connected successfully to server");

	const db = client.db(dbName);
	const teachers = db.collection("teachers");
	teachers.insertOne({"name": "Ricarditos", "lastName": "Milhos"}, (error, result)=>{
		
	
		assert.equal(error, null);
		console.log("After Inster:\n");
		console.log(result.ops);

		teachers.find({}).toArray((error, docs)=>{        
	
			assert.equal(error, null);
			
			console.log("Found:\n");
			console.log(docs);
			db.dropCollection("teachers", (error, result)=>{     
	
				assert.equal(error, null);

				client.close();
			});
		});
	});
});
