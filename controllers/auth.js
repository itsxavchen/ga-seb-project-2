//<--------------- Require code --------------->
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user.js");

//<--------------- Get --------------->
router.get("/log-in", (req, res) => {
    res.render("auth/log-in.ejs");
});

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
  });


  router.get('/log-out', (req, res) => {
    req.session.destroy();
    res.redirect('/xkii');
  });

//<--------------- Post --------------->
router.post("/sign-up", async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.send("Username is already taken.");
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.send('Password and Confirm Password must match');
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
  
        const user = await User.create(req.body);
        res.redirect('/xkii/auth/log-in'); 

    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).send("An error occurred during sign-up. Please try again.");
    }
    
});

router.post('/log-in', async (req, res) => {
  try {

    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('no username. Please try again.');
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send('wrong password. Please try again.');
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };
    res.redirect('/xkii/artworks');

  } catch (error) {
    console.log(error);
    res.redirect('/log-in');
  }
});

//<--------------- export --------------->
module.exports = router;
