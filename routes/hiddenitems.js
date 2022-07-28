var express = require("express")

var AuthLoginRoute = express.Router()
// This will help us connect to the database
const dbo = require("../dbcon")

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId


//get all hidden items
AuthLoginRoute.get("/getAllHiddenItems", async function (req, res) {
    let db_connect = dbo.getDb()
    let hiddenItems = await db_connect.collection("HiddenItems").find({}).toArray()
    res.json(hiddenItems)
})

//remove items where time placed has passed
AuthLoginRoute.get("/removeHiddenItems", async function (req, res) {
    let db_connect = dbo.getDb()
    let hiddenItems = await db_connect.collection("HiddenItems").find({}).toArray()
    for (let i = 0; i < hiddenItems.length; i++) {
        if (hiddenItems[i].timePlaced < Date.now()) {
            await db_connect.collection("HiddenItems").deleteOne({ _id: ObjectId(hiddenItems[i]._id) })
        }
    }
})

//check location of player and item
AuthLoginRoute.post("/checkLocation", async function (req, res) {
    let db_connect = dbo.getDb()
    let { playerLocation, itemLocation, userId } = req.body
    if (!playerLocation || !itemLocation) {
        res.status(401)
        res.json({ error: "missing playerLocation or itemLocation" })
        return
    }

    let hiddenItems = await db_connect.collection("HiddenItems").find({}).toArray()
    let itemFound = false
    for (let i = 0; i < hiddenItems.length; i++) {
        if (hiddenItems[i].location == itemLocation) {
            itemFound = true
            break
        }
    }

        // give userWhoFound the item
        let user = await db_connect.collection("Users").findOne({ _id: ObjectId(userId) })
        let item = await db_connect.collection("Items").findOne({ _id: ObjectId(itemId) })
        user.items.push(item)
        await db_connect.collection("Users").updateOne({ _id: ObjectId(userId) }, { $set: { items: user.items } })
        
        await db_connect.collection("HiddenItems").deleteOne({ _id: ObjectId(itemId) })
        res.json({ success: true })

    res.json({ itemFound: itemFound })
}) 



AuthLoginRoute.post("/addHiddenItem", async function (req, res) {
    let db_connect = dbo.getDb()
    let { name, loc, itemID, playerID,timePlaced } = req.body
    if (!name || !loc || !itemID || !playerID || !timePlaced) {
        res.status(401)
        res.json({ error: "missing name or description or price or image" })
        return
    }

    let newItem = {
        name: name,
        location:[loc],
        timePlaced:timePlaced,
        itemId:itemID,
        userId:playerID
    }

    await db_connect.collection("HiddenItems").insertOne(newItem)
    res.json({ success: true })
})

module.exports = AuthLoginRoute