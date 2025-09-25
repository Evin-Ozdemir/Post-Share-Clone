const {
  register,
  login,
  getUserProfile,
  updateProfile,
  followUser,
  getNotifications,
  markNotificationAsRead,
  getAllUsers,
} = require("../controllers/auth");
const { upload } = require("../config/cloudinary");

const express = require("express");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", upload.single("avatar"), updateProfile);
router.post("/follow/:id", followUser);
router.get("/notifications/:id", getNotifications);
router.put("/notifications/:id", markNotificationAsRead);

module.exports = router;
