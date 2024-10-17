const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const passport = require("passport");
const { generateToken } = require("../services/authService");

// Route to initiate Google authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
  })
);

// Callback route after successful authentication
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
  const token = generateToken(req.user);

    res.redirect(`http://localhost:4000/login/?token=${token}`); // Redirect to dashboard or any other page
  }
);



router.post("/", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalide email or password");

  const validePassword = await bcrypt.compare(req.body.password, user.password);
  if (!validePassword)
    return res.status(400).send("Invalide email or password");

  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_PRIVATE_KEY
  );

  res.send(token);
});

module.exports = router;
