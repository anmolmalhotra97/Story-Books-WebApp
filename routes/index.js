const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

router.get("/", ensureGuest, (req, res) => {
  console.log(req.method + "    " + req.url);
  res.render("index/welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  console.log(req.method + "    " + req.url);
  res.render("index/dashboard");
});

router.get("/about", (req, res) => {
  console.log(req.method + "    " + req.url);
  res.render("index/about");
});

module.exports = router;
