const express = require("express");
const app = express();
const { getAllTopics } = require("./controller/controllers");

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});

module.exports = app;
