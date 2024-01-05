const {json,urlencoded,} = require("express")
require("dotenv").config()
const port = process.env.PORT || 4000
const cookieParser = require("cookie-parser")
const session = require('express-session')
const express = require("express");
const cors = require("cors")
const passport = require("passport");
const app = express();
const appJson = require("../app.json")
const routes = require("./futures")


require("./config/passportAuth")
app.use(json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())
app.use(session({ secret:process.env.SESSION_SECRET,resave: false, saveUninitialized: true,  cookie: { secure: false }}))
app.use(passport.initialize());
app.use(passport.session())

const corsOptions ={ origin:appJson.origin, credentials:true,  optionSuccessStatus:200 }
app.use(cors(corsOptions))
routes.forEach(fn=> app.use("/api/v-1", fn));
app.get("/", (_req, res) => res.send({ message: "server is ok" }));
// app.use((req, res, next) => res.send({ message: "bad url" }));
// app.use((err, req, res, next) => res.send({ message: "other error" }));
app.listen(port, () => console.log(`app listening on port ${port}!`))

module.exports = app;