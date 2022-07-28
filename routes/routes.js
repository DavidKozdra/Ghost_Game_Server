
var express = require("express")
var router = express.Router()

var usersRoute = require("./users")
var AuthLoginRoute = require("./auth")
var itemRoute = require("./items")
var HiddenitemsRoute = require("./hiddenitems")

router.use(express.json())

router.get("/", function (req, res) {
    res.send("default route /")
    console.log("ping")
})

router.use("/users", usersRoute)
router.use("/items", itemRoute)
router.use("/auth", AuthLoginRoute)
router.use("/hiddenitems", HiddenitemsRoute)

module.exports = router