const bodyParser = require("body-parser")
const express = require("express")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const Router = require("mx-file-router")
const db = require("./utils/Database.js")
db.connect()

const app = express()

app.set("view engine", "ejs")
app.set("trust proxy", 1)
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 60
    }
}))

app.use(bodyParser.json())
app.use(bodyParser.raw())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

const surveys = new Map()

// globalize variables
global.surveys = surveys

Router(app)