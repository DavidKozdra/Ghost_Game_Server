 require("dotenv").config()
 
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = 9080

var session = require('express-session');

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/", require("./routes/routes.js"))
app.use(session({secret: "loginsession"}));


const dbo = require("./dbcon")

async function start() {
    // perform a database connection when server starts
    await dbo.connectToServer()

    app.listen(port, function () {
        console.log(
            `Success! Your application is running on port new connection ${port}.`
        )
    })
}

start()

