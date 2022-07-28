require("dotenv").config()
const { MongoClient } = require("mongodb")

// Server path 
console.log("Connecting to MongoDB at " + process.env.DB_URL)

// declare mongo client
const client = new MongoClient(process.env.DB_URL, {
    useNewUrlParser: false,
    useUnifiedTopology: true,
})

// Name of the database
const dbname = "Ghost_game"

var _db
module.exports = {
    connectToServer: async function () {
        let db = await client.connect()
        if (db) {
            _db = db.db(dbname)
            console.log("Successfully connected to MongoDB.")
        }
    },

    getDb: function () {
        return _db
    },
}