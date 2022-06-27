const express = require("express");
const mongoose = require("mongoose");
const documentRouter = require("./routes/documents.js");

const dbURL = "mongodb://localhost/text-editor";

mongoose
  .connect(dbURL)
  .then((mongoose) => {
    const connection = mongoose.connections[0];
    const { host, port, name } = connection;
    console.log(`${host}:${port}/${name}`);
  })
  .catch((error) => console.log(error));

const app = express();
app.engine("ejs", require("ejs-locals"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер слушает порт ${PORT}`);
});

app.use("/bootstrap", express.static("./node_modules/bootstrap"));
app.use("/icons", express.static("./node_modules/material-icons"));
app.use("/documents", documentRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Все документы" });
});