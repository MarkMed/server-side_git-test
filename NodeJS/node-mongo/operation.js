const assert = require("assert");

exports.findDocuments = (db, collection, callback)=>{

    const collect = db.collection(collection);
    return collect.find({}).toArray();
    
};
exports.insertDocument = (db, document, collection, callback)=>{

    const collect = db.collection(collection);
    return collect.insert(document);
    
};
exports.removeDocument = (db, document, collection, callback)=>{

    const collect = db.collection(collection);
    return collect.deleteOne(document); 
};
exports.updateDocument = (db, document, update, collection, callback)=>{

    const collect = db.collection(collection);
    return collect.updateOne(document, {$set: update}, null); 
};