const { Router } = require("express");
const { auth } = require("../../middleware/auth");
const passport = require("passport");
const router = Router();
const {
    createUser, getUsers, updateUser, deleteUser, getUser, loginUser, logoutUser, forgotPassword,
    newPassword, googleAuthSuccess, facebookAuthSuccess, githubAuthSuccess, codeVerification
} = require("./user.fn");

//all user auth routes 
router.post("/user/login", loginUser)
router.post("/user/logout", logoutUser)
router.post("/user/forgot-password", forgotPassword)
router.post("/user/code-check", codeVerification)
router.post("/user/new-password", newPassword)


// all user routes 
router.get("/auth/user", auth ,getUsers);
router.post("/auth/user", createUser);
router.get("/auth/user:id",auth, getUser);
router.put("/auth/user:id",auth,updateUser);
router.delete("/auth/user:id",auth, deleteUser);



// google auth routes 
router.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));
router.get( '/auth/google/callback', passport.authenticate( 'google', { successRedirect: '/api/v-1/auth/google/success', failureRedirect: '/auth/user/login'}));
router.get("/auth/google/success", googleAuthSuccess)


// facebook auth routes
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/auth/user/login', successRedirect:"/auth/facebook/success"}));
router.get("/facebook/success", facebookAuthSuccess)


// github auth routes 
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/user/login', successRedirect:"/auth/github/success"}));
router.get("/github/success",githubAuthSuccess)


module.exports = router;