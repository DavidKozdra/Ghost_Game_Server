var express = require("express");

var AuthLoginRoute = express.Router();
// This will help us connect to the database
const dbo = require("../dbcon");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

//get all hidden items
AuthLoginRoute.get("/getAllHiddenItems", async function (req, res) {
  let db_connect = dbo.getDb();
  let hiddenItems = await db_connect
    .collection("HiddenItems")
    .find({})
    .toArray();
  res.json(hiddenItems);
});

//remove items where time placed has passed
AuthLoginRoute.get("/removeHiddenItems", async function (req, res) {
  let db_connect = dbo.getDb();
  let hiddenItems = await db_connect
    .collection("HiddenItems")
    .find({})
    .toArray();
  for (let i = 0; i < hiddenItems.length; i++) {
    if (hiddenItems[i].timePlaced < Date.now()) {
      await db_connect
        .collection("HiddenItems")
        .deleteOne({ _id: ObjectId(hiddenItems[i]._id) });
    }
  }
});

//check location of player and item
AuthLoginRoute.post("/checkLocation", async function (req, res) {
  let db_connect = dbo.getDb();
  let { playerLocation, itemLocation, userId } = req.body;
  if (!playerLocation || !itemLocation) {
    res.status(401);
    res.json({ error: "missing playerLocation or itemLocation" });
    return;
  }

  let hiddenItems = await db_connect
    .collection("HiddenItems")
    .find({})
    .toArray();
  let itemFound = false;
  for (let i = 0; i < hiddenItems.length; i++) {
    if (hiddenItems[i].location == itemLocation) {
      itemFound = true;
      break;
    }
  }

  // give userWhoFound the item
  let user = await db_connect
    .collection("Users")
    .findOne({ _id: ObjectId(userId) });
  let item = await db_connect
    .collection("Item")
    .findOne({ _id: ObjectId(itemId) });
  user.items.push(item);
  await db_connect
    .collection("Users")
    .updateOne({ _id: ObjectId(userId) }, { $set: { items: user.items } });

  await db_connect
    .collection("HiddenItems")
    .deleteOne({ _id: ObjectId(itemId) });
  res.json({ success: true });

  res.json({ itemFound: itemFound });
});

AuthLoginRoute.post("/addHiddenUserItem", async function (req, res) {
  let db_connect = dbo.getDb();
  let { name, loc, itemID, playerID, timePlaced } = req.body;
  if (!name || !loc || !itemID || !playerID || !timePlaced) {
    res.status(401);
    var message = "missing : ";
    if (!name) {
      message += "name, ";
    }
    if (!loc) {
      message += "location, ";
    }
    if (!itemID) {
      message += "ItemID, ";
    }
    if (!playerID) {
      message += "playerID, ";
    }
    if (!timePlaced) {
      message += "timePlaced, ";
    }
    res.json({ error: message });
    return;
  }
  await db_connect.collection("HiddenItems").insertOne({
    name: name,
    location: loc,
    itemID: itemID,
    playerID: playerID,
    timePlaced: timePlaced,
  });
  await db_connect.collection("Item").deleteOne(
    {
      _id: ObjectId("62e18401a0cd174ebe86a1b8"),
      userId: ObjectId("62e182f0a0cd174ebe86a1ac"),
    },
    { $set: { hidden: true } }
  );
  res.json({ success: true });
});

AuthLoginRoute.post("/addHiddenItem", async function (req, res) {
  let db_connect = dbo.getDb();
  let { name, loc, itemID, playerID, timePlaced } = req.body;
  if (!name || !loc || !itemID || !playerID || !timePlaced) {
    var message = "missing : ";

    res.status(401);

    if (!name) {
      message += "name, ";
    }
    if (!loc) {
      message += "location, ";
    }
    if (!itemID) {
      message += "ItemID, ";
    }
    if (!playerID) {
      message += "playerID, ";
    }
    if (!timePlaced) {
      message += "timePlaced, ";
    }
    res.json({ error: message });
    return;
  }

  let newItem = {
    name: name,
    location: [loc],
    timePlaced: timePlaced,
    itemId: itemID,
    userId: playerID,
  };

  await db_connect.collection("HiddenItems").insertOne(newItem);
  res.json({ success: true });
});

module.exports = AuthLoginRoute;
