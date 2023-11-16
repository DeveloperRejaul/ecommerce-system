const { Router } = require("express");
const {createUser, getUsers, updateUser, deleteUser, getUser, loginUser, logoutUser, forgotPassword, newPassword, googleAuthSuccess, googleAuthFailure} = require("../controllers/userControllers");
const { auth } = require("../middleware/auth");
const passport = require("passport");
const router = Router();

//all user auth routes 
router.post("/user/login", loginUser)
router.post("/user/logout", logoutUser)
router.post("/user/forgot-password", forgotPassword)
router.post("/user/new-password", newPassword)


// all user routes 
router.get("/user", auth ,getUsers);
router.post("/user", createUser);
router.get("/user:id",auth, getUser);
router.put("/user:id",auth,updateUser);
router.delete("/user:id",auth, deleteUser);



// google auth routes 
router.get('/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));
router.get( '/google/callback', passport.authenticate( 'google', { successRedirect: '/auth/google/success', failureRedirect: '/auth/google/failure'}));

router.get("/google/failure", googleAuthFailure)
router.get("/google/success", googleAuthSuccess)



module.exports = router;