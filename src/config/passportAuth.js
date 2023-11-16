const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:4000/auth/google/callback",
    passReqToCallback:true
},
(request, accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
    }

))


passport.serializeUser((user, done) =>{
    done(null, user)
})

passport.deserializeUser((user, done) =>{
    done(null, user)
})