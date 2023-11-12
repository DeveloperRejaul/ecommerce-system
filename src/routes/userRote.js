const { Router } = require("express");
const {createUser, getUsers, updateUser, deleteUser, getUser, loginUser, logoutUser, forgotPassword, newPassword} = require("../controllers/userControllers");
const { auth } = require("../middleware/auth");
const router = Router();



//all user auth routes 
router.post("/auth/login", loginUser)
router.post("/auth/logout", logoutUser)
router.post("/auth/forgot-password", forgotPassword)
router.post("/auth/new-password", newPassword)


// all user routes 
router.get("/", auth, getUsers);
router.post("/", createUser);
router.get("/:id",auth, getUser);
router.put("/:id",auth,updateUser);
router.delete("/:id",auth, deleteUser);

module.exports = router;