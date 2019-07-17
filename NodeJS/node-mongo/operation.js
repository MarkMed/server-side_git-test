const assert = require("assert");

exports.findDocuments = (db, collection, callback)=>{

    const collect = db.collection(collection);
    collect.find({}).toArray((err, docs)=>{
        assert.equal(err, null);
        callback(docs);
    });
    
};
exports.insertDocument = (db, document, collection, callback)=>{

    const collect = db.collection(collection);
    collect.insert(document, (err, result)=>{
        assert.equal(err, null);
        console.log(`\nInserted: ${result.result.n} into the collection.`);
        callback(result);
    });
    
};
exports.removeDocument = (db, document, collection, callback)=>{

    const collect = db.collection(collection);
    collect.deleteOne(document, (err, result)=>{
        assert.equal(err, null);
        console.log(`\nDeleted: \n`, document);
        callback(result);
    }); 
};
exports.updateDocument = (db, document, update, collection, callback)=>{

    const collect = db.collection(collection);
    collect.updateOne(document, {$set: update}, null, (err, result)=>{
        assert.equal(err, null);
        console.log(`\nUpdated the document: \n`, update);
        callback(result);
    }); 
};