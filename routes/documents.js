const express = require("express");
const router = express.Router();
const Document = require("../models/Documents.js");

router.get("/new", (req, res) => {
  res.render("doc-new", { title: "Новый документ" });
});

router.post("/", (req, res) => {
  const { title, text } = req.body;
  const document = new Document({ title, text });
  document
    .save()
    .then((document) => res.redirect(`documents/${document.slug}`))
    .catch((err) => console.error(err));
});

module.exports = router;
