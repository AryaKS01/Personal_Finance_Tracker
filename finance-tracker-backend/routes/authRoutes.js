const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");

router.post(
  "/register",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  authController.register
);

router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);

module.exports = router;
