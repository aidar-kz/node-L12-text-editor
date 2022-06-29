const express = require("express");
const router = express.Router();
const Document = require("../models/Documents.js");

router.get("/new", (req, res) => {
  res.render("doc-new", { title: "Новый документ" });
});

router.post("/", (req, res) => {
  const { title, text } = req.body;
  const document = new Document({ title, text, userId: req.user.id });
  document
    .save()
    .then((document) => res.redirect(`documents/${document.slug}`))
    .catch((err) => console.error(err));
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const document = await Document.findOne({ slug });
  if (document) {
    res.render("doc-view", { document, title: document.title });
  } else {
    res.redirect("/");
  }
});

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const document = await Document.findById(id);
  res.render("doc-edit", {
    document,
    title: `Редактирование документа "${document.title}"`,
  });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  req.document = await Document.findById(id);
  let document = req.document;
  const { title, text } = req.body;
  document.title = title;
  document.text = text;

  try {
    document = await document.save();
    res.redirect(`/documents/${document.slug}`);
  } catch (error) {
    console.log(error.message);
    res.redirect(`/documents/edit/${document.id}`);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Document.findByIdAndDelete(id);
  res.redirect("/");
});

module.exports = router;
