const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

//load model
require("./models/user");
require("./models/story");

// Passport Config
require("./config/passport")(passport);

// Load Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");

//load keys file
const keys = require("./config/keys");

//Handlebars helpers
const { truncate, striptags, formatDate, select } = require("./helpers/hbs");

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

//method override middleware
app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate: truncate,
      striptags: striptags,
      formatDate: formatDate,
      select: select
    },
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

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

//Set static folder
app.use(express.static(path.join(__dirname, "public")));
// Use Routes
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
