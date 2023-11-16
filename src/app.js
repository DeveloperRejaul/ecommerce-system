const {json,urlencoded,} = require("express")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const express = require("express");
const userRoute = require("./routes/userRote");
const passport = require("passport");
const app = express();
require("./config/passportAuth")
app.use(json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())
app.use(session({ secret:process.env.SESSION_SECRET,resave: false, saveUninitialized: true,  cookie: { secure: false }}))
app.use(passport.initialize());
app.use(passport.session())

// user routes
app.use("/auth", userRoute)


module.exports = app;