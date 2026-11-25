var express = require('express');
var path = require("path");

module.exports = function(db) {
    var api = express.Router();

    var activity = [
        {id: 1001, class: 'Football', rating: 5, location: 'Dubai, Al Wasl Sports Club', price: 110, image: 'football.png', availableInventory: 10, quantity: 0},
        {id: 1002, class: 'Basketball', rating: 3,location: 'Dubai, JSS Private School', price: 120, image: 'basketball.png', availableInventory: 10, quantity: 0},
        {id: 1003, class: 'Swimming', rating: 5, location: 'Abu Dhabi, Country Club', price: 130, image: 'swimming.png', availableInventory: 10, quantity: 0},
        {id: 1004, class: 'Tennis', rating: 3, location: 'Dubai, Al Naayat Street', price: 140, image: 'tennis.png', availableInventory: 10, quantity: 0},
        {id: 1005, class: 'Cricket', rating: 4, location: 'Abu Dhabi, Zayed  City', price: 150, image: 'cricket.png', availableInventory: 10, quantity: 0},
        {id: 1006, class: 'Dance', rating: 3, location: 'Sharjah, Wanderers Club', price: 160, image: 'dance.png', availableInventory: 10, quantity: 0},
        {id: 1007, class: 'Singing', rating: 2, location: 'Dubai, Al Wasl Sports Club', price: 170, image: 'singing.png', availableInventory: 10, quantity: 0},
        {id: 1008, class: 'Gymnastics', rating: 4, location: 'Sharjah, Baseline Academy', price: 180, image: 'gymnastics.png', availableInventory: 10, quantity: 0},
        {id: 1009, class: 'Ice Hockey', rating: 3, location: 'Abu Dhabi, Zayed City', price: 190, image: 'ice_hockey.png', availableInventory: 10, quantity: 0},
        {id: 1010, class: 'Karate', rating: 1, location: 'Sharjah, Wanderers Club', price: 200, image: 'karate.png', availableInventory: 10, quantity: 0}
    ];

    db.collection("lesson").countDocuments()
    .then(function(count) {
        if(count == 0) {
            db.collection("lesson").insertMany(activity);
            console.log("Lessons added to MongoDB");
        }
    });

    api.get("/lessons", async function(request, response) {
        try {
            var lessons = await db.collection("lesson").find().toArray();
            response.json(lessons);
        } catch(error) {
            console.log(error);
            response.status(500).json("Could not retrieve lessons");
        }
    });

    api.get("/orders", async function(request, response) {
        try {
            var orders = await db.collection("order").find().toArray();
            response.json(orders);
        } catch(err) {
            console.log(err);
            response.status(500).json("Could not retrieve orders")
        }
    })

    api.post("/orders", async function(request, response) {
        var body = request.body;

        var order = {
            Name: body.firstName + ' ' + body.lastName,
            phone: body.phone,
            postalCode: body.postalCode,
            lessonIDs: body.lessonIDs,
            numOfSpaces: body.numOfSpaces
        }   

        try {
            await db.collection("order").insertOne(order);
            response.json({ message: "Order received" });

            console.log("Order received");
            console.log("Name:", body.firstName + " " + body.lastName);
            console.log("Phone:", body.phone);
            console.log("Postal code:", body.postalCode);
            console.log("Lesson IDs:", body.lessonIDs);
            console.log("Number of Spaces:", body.numOfSpaces);

        } catch (error) {
            console.error(error);
            response.status(500).json({
                message: "Saving order failed"
            });
        }
    });

    api.put("/lessons/:id", async function(request, response) {
        var lessonId = Number(request.params.id);
        var body = request.body;

        try {
                
            var idExist = await db.collection("lesson").findOne({id: lessonId});
            
            if(!idExist) {
                return response.status(404).json(
                    {message: "Lesson not found"}
                );
            }
            console.log("PUT body:", body);
            
            await db.collection("lesson").updateOne(
                {id: lessonId},
                {$set: body}
            );

            response.status(200).json(
                {message: "Lesson updated Successfully"}
            );

        } catch (error) {
            console.error("PUT ERROR:", error);
            response.status(500).json("Update failed");
        }
    });
    return api;
}
