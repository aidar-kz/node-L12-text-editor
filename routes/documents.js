const express = require("express");
const router = express.Router();

router.get("/documents/new", (req, res) => {
  res.render("doc-new", { title: "Новый документ" });
});

router.post("/documents", (req, res) => {
  console.log(req.body);
});

module.exports = router;
