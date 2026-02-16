require("dotenv").config()
const mongoose = require("mongoose");
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require('./config/corsOptions')
const ConnectDB = require("./config/mongo")
const path = require("path")

ConnectDB()

const app = express();

const PORT = process.env.NODE_ENV == "production" ? process.env.PORT : 2001

 

app.use(cookieParser());

app.use(express.json());

app.use(cors(corsOptions))





 

app.use('/api/auth', require("./routers/auth"))


app.use('/users', require("./routers/users"))





mongoose.connection.once("open", () => {
    app.listen(PORT, () => {
        console.log("run on 2001")
    })
})

mongoose.connection.on("error", () => {

    console.log("error connection")

})

