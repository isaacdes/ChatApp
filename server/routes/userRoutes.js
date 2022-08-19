const {
  register,
  login,
  setAvatar,
  checkAvatar,
  getAllUsers,
} = require("../controllers/userController");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);

router.get("/checkAvatar/:id", checkAvatar);
router.get("/allUsers/:id", getAllUsers);
module.exports = router;
