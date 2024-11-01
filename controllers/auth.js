const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
    res.send("Login Page");
});

router.get("/signup", (req, res) => {
    res.render("auth/sign-up.ejs");
});

module.exports = router;
