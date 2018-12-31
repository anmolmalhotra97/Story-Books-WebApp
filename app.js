const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

//load user model
require("./models/user");
// Passport Config
require("./config/passport")(passport);

// Load Routes
const auth = require("./routes/auth");

//load keys file
const keys = require("./config/keys");

//Map global promises
mongoose.Promise = global.Promise;

//mongoose connect
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => console.log(err));

const app = express();

app.get("/", (req, res) => {
  res.send("It Works!");
});

app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use Routes
app.use("/auth", auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
