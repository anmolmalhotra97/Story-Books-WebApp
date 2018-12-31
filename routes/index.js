const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.method + "    " + req.url);
  res.render("index/welcome");
});

router.get("/dashboard", (req, res) => {
  console.log(req.method + "    " + req.url);
  res.render("index/dashboard");
});

module.exports = router;
