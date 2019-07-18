const mongoose = require("mongoose")
const Dishes = require("./models/dishes");
const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url);

connect
.then((db)=>{
    console.log("Correctly connected to server");

    let pastaDish = Dishes({
        name: "Tallarines",
        description: "Tallarines con tuquito y quesito papu :v",
        price: 33
    });
    pastaDish.save()
        .then((data)=>{
            console.log("Created a new dish intance\n", data);
            return Dishes.find({}).exec();
        })
        .then((dataCollection)=>{
            console.log("Collection of dishes\n", dataCollection);
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