const express = require("express");

const app = express();
app.engine("ejs", require("ejs-locals"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер слушает порт ${PORT}`);
});

app.use("/bootstrap", express.static("./node_modules/bootstrap"));

app.get("/", (req, res) => {
  res.render("index", { title: "Все документы" });
});
