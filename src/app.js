const {json,urlencoded,} = require("express")
const cookieParser = require("cookie-parser")
const express = require("express");
const userRoute = require("./routes/userRote")
const app = express();
app.use(json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())

// user routes
app.use("/user", userRoute);


module.exports = app;