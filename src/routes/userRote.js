const { Router } = require("express");
const {createUser, getUsers, updateUser, deleteUser, getUser, loginUser, forgetPassword} = require("../controllers/userControllers");
const { auth } = require("../middleware/auth");
const router = Router();



//all user auth routes 
router.post("/auth/login", loginUser)
router.post("/auth/logout", loginUser)


// all user routes 
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id",auth,updateUser);
router.delete("/:id", deleteUser);

module.exports = router;