//<--------------- Require code --------------->
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const port = process.env.PORT ? process.env.PORT : "3000";
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
const authController = require("./controllers/auth.js");
const artworksController = require('./controllers/artworks.js');
const session = require('express-session');
// const isSignedIn = require('./middleware/is-signed-in.js');
// const passUserToView = require('./middleware/pass-user-to-view.js');


//<--------------- Middleware --------------->
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
// app.use(isSignedIn);
app.use("/xkii/auth", authController);
// app.use("/xkii/artworks", artworksController);
//<--------------- Get --------------->
app.get("/xkii", async (req, res) => {
  res.render('xkii.ejs', {
    user: req.session.user,
  });
});

app.get('/xkii/artworks', (req, res) => {
  res.render('artworks.ejs', {
    user: req.session.user,
  });
});






//<--------------- Localhost --------------->
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
