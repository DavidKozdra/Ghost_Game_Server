const e = require("express")
var express = require("express")

var AuthLoginRoute = express.Router()
// This will help us connect to the database
const dbo = require("../dbcon")

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId


//get all items
AuthLoginRoute.get("/getAllItems", async function (req, res) {
    let db_connect = dbo.getDb()
    let items = await db_connect.collection("Items").find({}).toArray()
    res.json(items)
})



AuthLoginRoute.post("/addItem", async function (req, res) {
    console.log("newItem")
    let db_connect = dbo.getDb()
    let { name} = req.body
    if (!name) {
        res.status(401)
        res.json({ error: "missing name or description or price or image" })
        return
    }

    let newItem = {
        name: name,
        user:"62e182f0a0cd174ebe86a1ac"
    }
    console.log(newItem.name)
    await db_connect.collection("Item").insertOne(newItem)

})

module.exports = AuthLoginRoute